const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { HttpError } = require('../utils/httpError');

async function listTasks(req, res, next) {
  try {
    const filter = { owner: req.user.id };
    if (req.query.projectId) filter.project = req.query.projectId;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { projectId, title, description, priority, status, dueDate } = req.body;

    const project = await Project.findOne({ _id: projectId, owner: req.user.id });
    if (!project) return next(new HttpError(404, 'Project not found'));

    const task = await Task.create({
      owner: req.user.id,
      project: projectId,
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const update = {
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
    };

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: update },
      { new: true }
    );
    if (!task) return next(new HttpError(404, 'Task not found'));

    res.json({ task });
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!task) return next(new HttpError(404, 'Task not found'));
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function dashboardStats(req, res, next) {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.id);
    const [stats] = await Task.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
          todo: { $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } }
        }
      }
    ]);

    const total = stats?.total || 0;
    const done = stats?.done || 0;
    const pending = total - done;

    res.json({
      totalTasks: total,
      completedTasks: done,
      pendingTasks: pending,
      byStatus: {
        todo: stats?.todo || 0,
        inProgress: stats?.inProgress || 0,
        done,
      },
      byPriority: {
        low: stats?.low || 0,
        medium: stats?.medium || 0,
        high: stats?.high || 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listTasks, createTask, updateTask, deleteTask, dashboardStats };


