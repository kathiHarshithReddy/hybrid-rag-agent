export function errorHandler(error, req, res, next) {
  console.error('Unhandled error', { path: req.path, message: error.message });
  if (res.headersSent) return next(error);
  return res.status(error.statusCode ?? 500).json({ error: error.message ?? 'Internal server error' });
}
