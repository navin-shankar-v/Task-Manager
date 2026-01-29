const { validationResult } = require('express-validator');
const { HttpError } = require('../utils/httpError');

function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const first = result.array({ onlyFirstError: true })[0];
  return next(new HttpError(400, first?.msg || 'Validation error'));
}

module.exports = { validate };


