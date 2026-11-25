const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');

const router = express.Router();

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET /categories
router.get('/categories', async (req, res) => {
  const raw = await Course.distinct('category');
  const data = raw
    .filter(Boolean)
    .map((name, i) => ({ _id: 'cat-' + i, name, slug: slugify(name), count: 0 }));
  res.json({ success: true, data });
});

// GET /brands (instructor names)
router.get('/brands', async (req, res) => {
  const instructors = await User.find({ role: 'instructor' });
  const data = instructors.map((i) => `${i.firstName} ${i.lastName}`.trim());
  res.json({ success: true, data });
});

// GET /instructors
router.get('/instructors', async (req, res) => {
  const data = await User.find({ role: 'instructor' }).select('-password');
  res.json({ success: true, data });
});

module.exports = router;