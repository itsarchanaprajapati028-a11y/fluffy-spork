const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// GET /enrollments/my-courses
router.get('/my-courses', async (req, res) => {
  const data = await Enrollment.find({ user: req.user._id })
    .populate('course')
    .sort({ createdAt: -1 });
  res.json({ success: true, data });
});

// POST /enrollments
router.post('/', async (req, res) => {
  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
  let enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
  if (enrollment) return res.json({ success: true, data: enrollment });
  enrollment = await Enrollment.create({ user: req.user._id, course: course._id });
  course.students += 1;
  await course.save();
  res.status(201).json({ success: true, data: enrollment });
});

// GET /enrollments/:courseId/progress
router.get('/:courseId/progress', async (req, res) => {
  const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId });
  if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
  res.json({
    success: true,
    data: {
      enrollmentId: enrollment._id,
      completedLessons: enrollment.completedLessons,
      currentLesson: enrollment.currentLesson,
      percent: enrollment.progress,
    },
  });
});

// PUT /enrollments/:courseId/progress
router.put('/:courseId/progress', async (req, res) => {
  const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId });
  if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
  const course = await Course.findById(req.params.courseId);
  const { lessonId, completed } = req.body;
  if (lessonId && completed && !enrollment.completedLessons.map(String).includes(String(lessonId))) {
    enrollment.completedLessons.push(lessonId);
  }
  if (lessonId) enrollment.currentLesson = lessonId;
  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0) || 1;
  enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
  if (enrollment.progress >= 100 && !enrollment.certificateId) {
    enrollment.status = 'completed';
    enrollment.completedAt = new Date();
    const cert = await Certificate.create({
      certificateId: 'CERT-' + Date.now().toString().slice(-8),
      user: req.user._id,
      course: course._id,
    });
    enrollment.certificateId = cert.certificateId;
  }
  await enrollment.save();
  res.json({ success: true, data: enrollment });
});

// POST /enrollments/:courseId/complete-lesson
router.post('/:courseId/complete-lesson', async (req, res) => {
  const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId });
  if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
  const { lessonId } = req.body;
  if (lessonId && !enrollment.completedLessons.map(String).includes(String(lessonId))) {
    enrollment.completedLessons.push(lessonId);
  }
  await enrollment.save();
  res.json({ success: true, data: enrollment });
});

// GET /enrollments/:courseId
router.get('/:courseId', async (req, res) => {
  const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.courseId }).populate(
    'course'
  );
  if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
  res.json({ success: true, data: enrollment });
});

module.exports = router;