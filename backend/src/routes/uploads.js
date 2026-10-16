import express from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Always store images in backend/uploads, regardless of the directory used to start Node.
const uploadDir = path.resolve(__dirname, '../../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => {
    const extensionByMime = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };
    const extension = extensionByMime[file.mimetype] || path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error('Only JPG, PNG, WebP, and GIF images are allowed'));
    }
    callback(null, true);
  },
});

router.post('/', (req, res) => {
  upload.single('image')(req, res, (error) => {
    if (error) {
      return res.status(400).json({ message: error.message || 'Image upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Please select an image' });
    }

    // Return a usable URL for both the hotel cards and details page.
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(req.file.filename)}`;
    return res.status(201).json({
      message: 'Image uploaded successfully',
      imageUrl,
      url: imageUrl,
    });
  });
});

export default router;
