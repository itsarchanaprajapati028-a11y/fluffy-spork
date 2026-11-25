const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/tokens');
const { auth } = require('../middleware/auth');

const router = express.Router();

function authResponse(user) {
  return {
    user: user.toPublic(),
    accessToken: signAccess(user),
    refreshToken: signRefresh(user),
  };
}

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: hashed,
    phone: phone || '',
  });
  res.status(201).json(authResponse(user));
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  res.json(authResponse(user));
});

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });
  try {
    const payload = verifyRefresh(refreshToken);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json({ accessToken: signAccess(user), refreshToken: signRefresh(user) });
  } catch (err) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

router.get('/profile', auth, async (req, res) => {
  res.json({ user: req.user.toPublic() });
});

router.patch('/profile', auth, async (req, res) => {
  const allowed = ['firstName', 'lastName', 'phone', 'avatar'];
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) req.user[k] = req.body[k];
  });
  if (req.body.password) {
    req.user.password = await bcrypt.hash(req.body.password, 10);
  }
  await req.user.save();
  res.json({ user: req.user.toPublic() });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (user) {
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
  }
  res.json({ message: 'If the email exists, a reset link has been sent' });
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
  res.json({ message: 'Password reset successful' });
});

module.exports = router;