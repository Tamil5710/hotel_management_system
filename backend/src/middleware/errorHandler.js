export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}
export function errorHandler(err, req, res, next) {
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image must be 5 MB or smaller.' });
  }
  if (err?.message === 'Only JPG, PNG, and WebP images are allowed.') {
    return res.status(400).json({ message: err.message });
  }
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: status === 500 ? 'Internal server error.' : err.message });
}
