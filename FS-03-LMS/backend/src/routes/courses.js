const express = require('express');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseBool(v) {
  return v === true || v === 'true';
}

// GET /courses/featured
router.get('/featured', async (req, res) => {
  const limit = Number(req.query.limit) || 8;
  const courses = await Course.find({ isFeatured: true, isPublished: true })
    .limit(limit)
    .populate('instructor', 'firstName lastName avatar');
  res.json({ success: true, data: courses });
});

// GET /courses/search
router.get('/search', async (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const q = { isPublished: true };
  if (req.query.search) q.title = { $regex: req.query.search, $options: 'i' };
  const courses = await Course.find(q).limit(limit).populate('instructor', 'firstName lastName avatar');
  res.json({ success: true, data: { courses } });
});

// GET /courses (list)
router.get('/', async (req, res) => {
  const {
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    isFeatured,
    level,
    page = 1,
    limit = 20,
  } = req.query;

  const q = { isPublished: true };
  if (search) q.title = { $regex: search, $options: 'i' };
  if (category) q.category = category;
  if (level) q.level = level;
  if (parseBool(isFeatured)) q.isFeatured = true;
  if (minPrice || maxPrice) {
    q.price = {};
    if (minPrice) q.price.$gte = Number(minPrice);
    if (maxPrice) q.price.$lte = Number(maxPrice);
  }
  if (brand) {
    const instructors = await require('../models/User').find({
      role: 'instructor',
      $or: [
        { firstName: { $in: String(brand).split(',') } },
        { lastName: { $in: String(brand).split(',') } },
      ],
    });
    q.instructor = { $in: instructors.map((i) => i._id) };
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const total = await Course.countDocuments(q);
  const data = await Course.find(q)
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .populate('instructor', 'firstName lastName avatar');

  res.json({
    success: true,
    data,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) || 1 },
  });
});

// GET /courses/related/:id
router.get('/related/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  const limit = Number(req.query.limit) || 4;
  const data = await Course.find({ _id: { $ne: course._id }, category: course.category })
    .limit(limit)
    .populate('instructor', 'firstName lastName avatar');
  res.json({ success: true, data });
});

// GET /courses/:courseId/lessons/:lessonId
router.get('/:courseId/lessons/:lessonId', async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  const lesson = course.modules.flatMap((m) => m.lessons).find((l) => String(l._id) === req.params.lessonId);
  if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
  res.json({ success: true, data: lesson });
});

// GET /courses/:slug
router.get('/:slug', async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug }).populate(
    'instructor',
    'firstName lastName avatar headline rating'
  );
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json({ success: true, data: course });
});

// POST /courses (instructor/admin)
router.post('/', auth, authorize('instructor', 'admin'), async (req, res) => {
  const b = req.body;
  const course = await Course.create({
    title: b.title,
    slug: b.slug || slugify(b.title),
    description: b.description || '',
    shortDescription: b.shortDescription || '',
    thumbnail: b.thumbnail || { url: '/placeholder-course.svg', alt: b.title },
    images: b.images || [{ url: '/placeholder-course.svg', alt: b.title }],
    instructor: req.user._id,
    category: b.category || '',
    price: Number(b.price) || 0,
    originalPrice: Number(b.originalPrice) || Number(b.price) || 0,
    level: b.level || 'beginner',
    duration: Number(b.duration) || 0,
    modules: b.modules || [],
    isFeatured: parseBool(b.isFeatured),
    tags: b.tags || [],
    attributes: b.attributes || {},
  });
  res.status(201).json({ success: true, data: course });
});

// PUT /courses/:id
router.put('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  if (req.user.role !== 'admin' && String(course.instructor) !== String(req.user._id)) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  const allowed = [
    'title',
    'description',
    'shortDescription',
    'thumbnail',
    'images',
    'category',
    'price',
    'originalPrice',
    'level',
    'duration',
    'modules',
    'isFeatured',
    'isPublished',
    'status',
    'tags',
    'attributes',
  ];
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) course[k] = req.body[k];
  });
  course.lessonsCount = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  await course.save();
  res.json({ success: true, data: course });
});

// DELETE /courses/:id
router.delete('/:id', auth, authorize('instructor', 'admin'), async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  if (req.user.role !== 'admin' && String(course.instructor) !== String(req.user._id)) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }
  await course.deleteOne();
  res.json({ success: true, message: 'Course deleted' });
});

module.exports = router;