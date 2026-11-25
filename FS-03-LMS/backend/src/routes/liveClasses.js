const express = require('express');
const LiveClass = require('../models/LiveClass');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /live-classes
router.get('/', auth, async (req, res) => {
  const q = {};
  if (req.query.course) q.course = req.query.course;
  const data = await LiveClass.find(q).populate('course').populate('instructor', 'firstName lastName').sort({ scheduledAt: 1 });
  res.json({ success: true, data });
});

// GET /live-classes/:id
router.get('/:id', auth, async (req, res) => {
  const liveClass = await LiveClass.findById(req.params.id).populate('course').populate('instructor', 'firstName lastName');
  if (!liveClass) return res.status(404).json({ success: false, message: 'Live class not found' });
  res.json({ success: true, data: liveClass });
});

// POST /live-classes (instructor/admin)
router.post('/', auth, authorize('instructor', 'admin'), async (req, res) => {
  const liveClass = await LiveClass.create({ ...req.body, instructor: req.user._id });
  res.status(201).json({ success: true, data: liveClass });
});

// POST /live-classes/:id/join
router.post('/:id/join', auth, async (req, res) => {
  const liveClass = await LiveClass.findById(req.params.id);
  if (!liveClass) return res.status(404).json({ success: false, message: 'Live class not found' });
  res.json({
    success: true,
    data: {
      meetingUrl: liveClass.meetingUrl || 'https://meet.example.com/room',
      meetingId: liveClass.meetingId || String(liveClass._id),
      password: liveClass.password || '',
      token: 'live-token-' + Date.now(),
    },
  });
});

// POST /live-classes/:id/end
router.post('/:id/end', auth, authorize('instructor', 'admin'), async (req, res) => {
  const liveClass = await LiveClass.findById(req.params.id);
  if (!liveClass) return res.status(404).json({ success: false, message: 'Live class not found' });
  liveClass.status = 'ended';
  await liveClass.save();
  res.json({ success: true, data: liveClass });
});

module.exports = router;