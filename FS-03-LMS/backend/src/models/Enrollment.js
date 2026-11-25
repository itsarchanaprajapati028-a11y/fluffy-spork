const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
    currentLesson: { type: mongoose.Schema.Types.ObjectId, default: null },
    enrolledAt: { type: Date, default: Date.now },
    lastAccessedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    certificateId: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema);