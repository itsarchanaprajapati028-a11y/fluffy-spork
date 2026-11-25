const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/tokens');
const { auth } = require('../middleware/auth');

const router = express.Router();

function authResponse(user) {
  return { user: user.toPublic(), accessToken: signAccess(user), refreshToken: signRefresh(user) };
}

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: await bcrypt.hash(password, 10),
    phone: phone || '',
    role: 'student',
  });
  res.status(201).json({ success: true, ...authResponse(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  res.json({ success: true, ...authResponse(user) });
});

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required' });
  try {
    const payload = verifyRefresh(refreshToken);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    res.json({ success: true, accessToken: signAccess(user), refreshToken: signRefresh(user) });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

router.get('/me', auth, async (req, res) => {
  res.json({ success: true, data: req.user.toPublic() });
});

router.put('/profile', auth, async (req, res) => {
  const allowed = ['firstName', 'lastName', 'phone', 'avatar', 'bio', 'headline', 'expertise'];
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) req.user[k] = req.body[k];
  });
  await req.user.save();
  res.json({ success: true, data: req.user.toPublic() });
});

router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!(await bcrypt.compare(currentPassword || '', req.user.password))) {
    return res.status(400).json({ success: false, message: 'Current password incorrect' });
  }
  req.user.password = await bcrypt.hash(newPassword, 10);
  await req.user.save();
  res.json({ success: true, message: 'Password changed' });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (user) {
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
  }
  res.json({ success: true, data: { message: 'Reset email sent' } });
});

router.post('/reset-password/:token', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });
  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
  res.json({ success: true, data: { message: 'Password reset successful' } });
});

module.exports = router;