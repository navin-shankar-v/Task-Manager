const express = require('express');
const { body, param } = require('express-validator');
const { requireAuth } = require('../middleware/requireAuth');
const { validate } = require('../middleware/validate');
const {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');

const router = express.Router();

router.use(requireAuth);

router.get('/', listProjects);

router.post(
  '/',
  [
    body('name').isString().withMessage('Name is required').trim().isLength({ min: 1, max: 120 }),
    body('description').optional().isString().withMessage('Description must be a string').trim().isLength({ max: 1000 }),
    validate,
  ],
  createProject
);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid project id'), validate],
  getProject
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid project id'),
    body('name').isString().withMessage('Name is required').trim().isLength({ min: 1, max: 120 }),
    body('description').optional().isString().withMessage('Description must be a string').trim().isLength({ max: 1000 }),
    validate,
  ],
  updateProject
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid project id'), validate],
  deleteProject
);

module.exports = router;


