const mongoose = require('mongoose');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { HttpError } = require('../utils/httpError');

async function listProjects(req, res, next) {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

async function createProject(req, res, next) {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ owner: req.user.id, name, description });
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) return next(new HttpError(404, 'Project not found'));

    // progress: total + done
    const projectId = new mongoose.Types.ObjectId(project._id);
    const ownerId = new mongoose.Types.ObjectId(req.user.id);

    const [stats] = await Task.aggregate([
      { $match: { owner: ownerId, project: projectId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          done: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      project,
      progress: {
        totalTasks: stats?.total || 0,
        doneTasks: stats?.done || 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const { name, description } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: { name, description } },
      { new: true }
    );
    if (!project) return next(new HttpError(404, 'Project not found'));
    res.json({ project });
  } catch (err) {
    next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!project) return next(new HttpError(404, 'Project not found'));

    await Task.deleteMany({ owner: req.user.id, project: project._id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
};


