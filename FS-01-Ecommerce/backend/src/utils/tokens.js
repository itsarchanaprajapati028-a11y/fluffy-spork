const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_SECRET || 'fs01-access-secret-dev';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fs01-refresh-secret-dev';

function signAccess(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, ACCESS_SECRET, { expiresIn: '15m' });
}

function signRefresh(user) {
  return jwt.sign({ id: user._id.toString() }, REFRESH_SECRET, { expiresIn: '7d' });
}

function verifyAccess(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefresh(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };