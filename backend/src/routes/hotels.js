import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../db.js';
import { serializeHotel, validateHotel } from '../utils.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '../../uploads');
const imageMimeExtensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

// Supports data URLs sent in the existing JSON hotel payload without changing API routes.
// A browser blob: URL is only valid in that browser and cannot be read by the backend.
async function persistImageUrl(imageUrl) {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('blob:')) {
    const error = new Error('The selected image must be uploaded before saving. Send it to the existing POST /api/uploads endpoint and save the returned imageUrl.');
    error.status = 400;
    throw error;
  }

  const match = imageUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=\r\n]+)$/i);
  if (!match) return imageUrl;

  const mimeType = match[1].toLowerCase();
  const buffer = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
  if (!buffer.length || buffer.length > 5 * 1024 * 1024) {
    const error = new Error('Image must be a valid image smaller than 5 MB.');
    error.status = 400;
    throw error;
  }

  await fs.mkdir(uploadsDir, { recursive: true });
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${imageMimeExtensions[mimeType]}`;
  await fs.writeFile(path.join(uploadsDir, filename), buffer, { flag: 'wx' });
  return `/uploads/${filename}`;
}

function imageUrlForResponse(imageUrl, req) {
  if (!imageUrl) return '';
  if (/^(?:https?:|data:)/i.test(imageUrl)) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) {
    return `${req.protocol}://${req.get('host')}${imageUrl.split('/').map((part, i) => i < 2 ? part : encodeURIComponent(decodeURIComponent(part))).join('/')}`;
  }
  return imageUrl;
}

function serializeForRequest(row, req) {
  const hotel = serializeHotel(row);
  hotel.imageUrl = imageUrlForResponse(hotel.imageUrl, req);
  return hotel;
}
const SORTS = {
  default: 'created_at DESC, id DESC',
  'price-asc': 'price ASC',
  'price-desc': 'price DESC',
  'rating-desc': 'rating DESC',
  'title-asc': 'title ASC',
};

router.get('/', async (req, res, next) => {
  try {
    const { search = '', minPrice = '', maxPrice = '', sortBy = 'default', page = '1', limit } = req.query;
    const values = [];
    const where = [];
    const q = String(search).trim();
    if (q) {
      values.push(`%${q}%`);
      where.push(`(title ILIKE $${values.length} OR city ILIKE $${values.length} OR description ILIKE $${values.length})`);
    }
    if (minPrice !== '' && Number.isFinite(Number(minPrice))) {
      values.push(Number(minPrice)); where.push(`price >= $${values.length}`);
    }
    if (maxPrice !== '' && Number.isFinite(Number(maxPrice))) {
      values.push(Number(maxPrice)); where.push(`price <= $${values.length}`);
    }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM hotels ${clause}`, values);
    const total = countResult.rows[0].total;
    const order = SORTS[sortBy] || SORTS.default;

    // Existing frontend loads the complete filtered set and paginates in the browser.
    if (limit === undefined && page === '1') {
      const result = await pool.query(`SELECT * FROM hotels ${clause} ORDER BY ${order}`, values);
      return res.json({ data: result.rows.map((row) => serializeForRequest(row, req)), total });
    }
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(limit || '6', 10) || 6));
    const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
    const offset = (currentPage - 1) * pageSize;
    const result = await pool.query(
      `SELECT * FROM hotels ${clause} ORDER BY ${order} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, pageSize, offset]
    );
    res.json({ data: result.rows.map((row) => serializeForRequest(row, req)), total, page: currentPage, limit: pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ message: 'Hotel not found.' });
    const result = await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Hotel not found.' });
    res.json(serializeForRequest(result.rows[0], req));
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const body = { ...req.body, imageUrl: await persistImageUrl(String(req.body.imageUrl ?? '').trim()) };
    const { errors, values } = validateHotel(body);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the hotel details.', errors });
    const b = body;
    const result = await pool.query(
      `INSERT INTO hotels (title, description, city, image_url, alt_text, latitude, longitude, price, rating, reviews_count, original_price, amenities, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [values.title, values.description, values.city, values.imageUrl, values.altText, values.latitude, values.longitude, values.price,
       Number(b.rating) || 4.5, Math.max(0, Number.parseInt(b.reviewsCount,10) || 1), b.originalPrice ? Number(b.originalPrice) : null,
       JSON.stringify(Array.isArray(b.amenities) ? b.amenities : []), Boolean(b.featured)]
    );
    res.status(201).json(serializeForRequest(result.rows[0], req));
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ message: 'Hotel not found.' });
    const body = { ...req.body, imageUrl: await persistImageUrl(String(req.body.imageUrl ?? '').trim()) };
    const { errors, values } = validateHotel(body);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Please correct the hotel details.', errors });
    const b = body;
    const result = await pool.query(
      `UPDATE hotels SET title=$1, description=$2, city=$3, image_url=$4, alt_text=$5, latitude=$6, longitude=$7, price=$8,
       rating=$9, reviews_count=$10, original_price=$11, amenities=$12, featured=$13, updated_at=NOW()
       WHERE id=$14 RETURNING *`,
      [values.title, values.description, values.city, values.imageUrl, values.altText, values.latitude, values.longitude, values.price,
       Number(b.rating) || 4.5, Math.max(0, Number.parseInt(b.reviewsCount,10) || 1), b.originalPrice ? Number(b.originalPrice) : null,
       JSON.stringify(Array.isArray(b.amenities) ? b.amenities : []), Boolean(b.featured), req.params.id]
    );
    if (!result.rowCount) return res.status(404).json({ message: 'Hotel not found.' });
    res.json(serializeForRequest(result.rows[0], req));
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ message: 'Hotel not found.' });
    const result = await pool.query('DELETE FROM hotels WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Hotel not found.' });
    res.json({ success: true, id: String(result.rows[0].id) });
  } catch (err) { next(err); }
});

export default router;
