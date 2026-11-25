const express = require('express');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const LiveClass = require('../models/LiveClass');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth, authorize('instructor', 'admin'));

router.get('/dashboard', async (req, res) => {
  const courses = await Course.find({ instructor: req.user._id });
  const courseIds = courses.map((c) => c._id);
  const enrollments = await Enrollment.countDocuments({ course: { $in: courseIds } });
  const liveClasses = await LiveClass.countDocuments({ instructor: req.user._id });
  res.json({
    success: true,
    data: {
      stats: { courses: courses.length, students: enrollments, earnings: req.user.earnings || 0, liveClasses },
      recentEnrollments: [],
    },
  });
});

router.get('/courses', async (req, res) => {
  const data = await Course.find({ instructor: req.user._id }).populate('instructor', 'firstName lastName');
  res.json({ success: true, data });
});

router.get('/analytics', async (req, res) => {
  res.json({ success: true, data: { revenue: [], enrollments: [], ratings: [] } });
});

router.get('/live-classes', async (req, res) => {
  const data = await LiveClass.find({ instructor: req.user._id }).populate('course');
  res.json({ success: true, data });
});

router.get('/earnings', async (req, res) => {
  res.json({ success: true, data: { balance: req.user.earnings || 0, payouts: [] } });
});

module.exports = router;