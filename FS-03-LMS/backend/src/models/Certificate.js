const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    issuedAt: { type: Date, default: Date.now },
    grade: { type: String, default: 'Pass' },
    status: { type: String, enum: ['issued', 'revoked'], default: 'issued' },
    pdfUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);