const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { HttpError } = require('../utils/httpError');

function signToken(userId) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
  return jwt.sign({}, process.env.JWT_SECRET, { subject: String(userId), expiresIn: '7d' });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return next(new HttpError(409, 'Email already registered'));

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new HttpError(401, 'Invalid email or password'));

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return next(new HttpError(401, 'Invalid email or password'));

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };


