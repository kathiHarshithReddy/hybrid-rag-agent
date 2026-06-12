export function validateApiKey(req, res, next) {
  const expected = process.env.INTERNAL_API_KEY;
  if (!expected) return next();

  const incoming = req.header('x-api-key');
  if (incoming !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
}
