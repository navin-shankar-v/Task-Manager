const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').optional().isString().withMessage('Name must be a string').trim().isLength({ max: 80 }),
    body('email').isEmail().withMessage('Email is invalid').normalizeEmail(),
    body('password')
      .isString()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    validate,
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email is invalid').normalizeEmail(),
    body('password').isString().withMessage('Password is required'),
    validate,
  ],
  login
);

module.exports = router;


