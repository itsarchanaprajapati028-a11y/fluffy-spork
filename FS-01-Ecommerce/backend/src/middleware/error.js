module.exports = (err, req, res, next) => {
  console.error('[FS-01] Error:', err.message);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate value already exists' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
};