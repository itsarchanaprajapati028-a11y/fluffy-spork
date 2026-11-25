const mongoose = require('mongoose');

module.exports = async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log('[FS-03] MongoDB connected');
  } catch (err) {
    console.error('[FS-03] MongoDB connection error:', err.message);
    process.exit(1);
  }
};