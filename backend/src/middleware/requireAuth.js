const jwt = require('jsonwebtoken');
const { HttpError } = require('../utils/httpError');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next(new HttpError(401, 'Missing token'));
  if (!process.env.JWT_SECRET) return next(new HttpError(500, 'JWT_SECRET is missing'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    return next();
  } catch {
    return next(new HttpError(401, 'Invalid token'));
  }
}

module.exports = { requireAuth };


