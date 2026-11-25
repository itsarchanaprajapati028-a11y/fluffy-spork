module.exports = (err, req, res, next) => {
  console.error('[FS-03] Error:', err.message);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'Duplicate value already exists' });
  }
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
};