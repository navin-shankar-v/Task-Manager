const { HttpError } = require('../utils/httpError');

function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-unused-vars
  void next;
  const status = err instanceof HttpError ? err.status : 500;
  const message = err?.message || 'Server error';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({ message });
}

module.exports = { errorHandler };


