const express = require('express');
const { body, param, query } = require('express-validator');
const { requireAuth } = require('../middleware/requireAuth');
const { validate } = require('../middleware/validate');
const {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  dashboardStats,
} = require('../controllers/task.controller');

const router = express.Router();

router.use(requireAuth);

router.get('/stats/dashboard', dashboardStats);

router.get(
  '/',
  [query('projectId').optional().isMongoId().withMessage('Invalid projectId'), validate],
  listTasks
);

router.post(
  '/',
  [
    body('projectId').isMongoId().withMessage('projectId is required'),
    body('title').isString().withMessage('Title is required').trim().isLength({ min: 1, max: 160 }),
    body('description').optional().isString().withMessage('Description must be a string').trim().isLength({ max: 5000 }),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
    body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid date'),
    validate,
  ],
  createTask
);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task id'),
    body('title').isString().withMessage('Title is required').trim().isLength({ min: 1, max: 160 }),
    body('description').optional().isString().withMessage('Description must be a string').trim().isLength({ max: 5000 }),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
    body('dueDate').optional({ nullable: true }).custom((value) => {
      if (value === null || value === '') return true;
      // express-validator's isISO8601 doesn't accept null, so we custom-validate here.
      const date = new Date(value);
      return !Number.isNaN(date.getTime());
    }),
    validate,
  ],
  updateTask
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid task id'), validate],
  deleteTask
);

module.exports = router;


