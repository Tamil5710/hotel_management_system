export function serializeHotel(row) {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    city: row.city,
    imageUrl: row.image_url,
    altText: row.alt_text,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    price: Number(row.price),
    rating: Number(row.rating),
    reviewsCount: Number(row.reviews_count),
    originalPrice: row.original_price == null ? null : Number(row.original_price),
    amenities: row.amenities || [],
    featured: Boolean(row.featured),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function validateHotel(body) {
  const errors = {};
  const title = String(body.title ?? '').trim();
  const description = String(body.description ?? '').trim();
  const city = String(body.city ?? '').trim();
  const imageUrl = String(body.imageUrl ?? '').trim();
  const latitude = Number(body.latitude);
  const longitude = Number(body.longitude);
  const price = Number(body.price);

  if (title.length < 3 || title.length > 180) errors.title = 'Title must be 3–180 characters.';
  if (description.length < 20) errors.description = 'Description must contain at least 20 characters.';
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) errors.latitude = 'Latitude must be between -90 and 90.';
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) errors.longitude = 'Longitude must be between -180 and 180.';
  if (!Number.isFinite(price) || price <= 0) errors.price = 'Price must be a number greater than zero.';
  if (city.length > 180) errors.city = 'City must be 180 characters or fewer.';
  if (imageUrl.length > 2000) errors.imageUrl = 'Image URL is too long.';
  if (body.amenities !== undefined && !Array.isArray(body.amenities)) errors.amenities = 'Amenities must be an array.';
  return { errors, values: { title, description, city, imageUrl, altText: String(body.altText ?? '').slice(0,250), latitude, longitude, price } };
}
