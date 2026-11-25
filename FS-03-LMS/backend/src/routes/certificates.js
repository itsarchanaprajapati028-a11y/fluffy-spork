const express = require('express');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /certificates/my-certificates
router.get('/my-certificates', auth, async (req, res) => {
  const data = await Certificate.find({ user: req.user._id })
    .populate('course')
    .populate('user')
    .sort({ issuedAt: -1 });
  res.json({ success: true, data });
});

// GET /certificates/:id
router.get('/:id', auth, async (req, res) => {
  const cert = await Certificate.findById(req.params.id).populate('course').populate('user');
  if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
  res.json({ success: true, data: cert });
});

// GET /certificates/:id/download - returns a simple text file as PDF stand-in
router.get('/:id/download', auth, async (req, res) => {
  const cert = await Certificate.findById(req.params.id).populate('course').populate('user');
  if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
  const user = cert.user;
  const course = cert.course;
  const content = `CERTIFICATE OF COMPLETION\n\nCertificate ID: ${cert.certificateId}\n\nAwarded to: ${user.firstName} ${user.lastName}\n\nFor completing: ${course.title}\n\nIssued: ${cert.issuedAt.toDateString()}\nGrade: ${cert.grade}\n`;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="${cert.certificateId}.txt"`);
  res.send(content);
});

module.exports = router;