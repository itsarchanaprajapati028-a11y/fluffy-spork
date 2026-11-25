const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scheduledAt: Date,
    duration: { type: Number, default: 60 },
    meetingUrl: String,
    meetingId: String,
    password: String,
    status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
    maxParticipants: { type: Number, default: 100 },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    recordingUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('LiveClass', liveClassSchema);