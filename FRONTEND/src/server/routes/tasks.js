
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('goalId', 'title color');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get tasks by goal
// @route   GET /api/tasks/goal/:goalId
// @access  Public
router.get('/goal/:goalId', async (req, res) => {
  try {
    const tasks = await Task.find({ goalId: req.params.goalId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, goalId, completed } = req.body;
    
    const task = await Task.create({
      title,
      goalId,
      completed: completed || false
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const { title, goalId, completed } = req.body;
    
    task.title = title || task.title;
    task.goalId = goalId || task.goalId;
    task.completed = completed !== undefined ? completed : task.completed;
    
    const updatedTask = await task.save();
    
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
