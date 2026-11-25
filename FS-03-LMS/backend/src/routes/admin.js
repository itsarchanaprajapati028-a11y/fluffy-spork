const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const LiveClass = require('../models/LiveClass');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(auth, authorize('admin'));

router.get('/dashboard', async (req, res) => {
  const users = await User.countDocuments();
  const courses = await Course.countDocuments();
  const instructors = await User.countDocuments({ role: 'instructor' });
  res.json({
    success: true,
    data: { stats: { users, courses, instructors, revenue: 0 }, growth: [] },
  });
});

router.get('/users', async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 20);
  const q = {};
  if (req.query.role) q.role = req.query.role;
  if (req.query.search) q.email = { $regex: req.query.search, $options: 'i' };
  const total = await User.countDocuments(q);
  const data = await User.find(q)
    .select('-password')
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } });
});

router.get('/courses', async (req, res) => {
  const total = await Course.countDocuments();
  const data = await Course.find().populate('instructor', 'firstName lastName');
  res.json({ success: true, data, pagination: { page: 1, limit: data.length, total, totalPages: 1 } });
});

router.get('/instructors', async (req, res) => {
  const data = await User.find({ role: 'instructor' }).select('-password');
  res.json({ success: true, data, pagination: { page: 1, limit: data.length, total: data.length, totalPages: 1 } });
});

router.get('/live-classes', async (req, res) => {
  const data = await LiveClass.find().populate('course').populate('instructor', 'firstName lastName');
  res.json({ success: true, data });
});

router.get('/analytics', async (req, res) => {
  res.json({ success: true, data: { revenue: [], signups: [], courseStats: [] } });
});

module.exports = router;