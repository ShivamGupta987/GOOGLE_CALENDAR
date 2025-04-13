
const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const Task = require('../models/Task');

// @desc    Get all goals
// @route   GET /api/goals
// @access  Public
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find({});
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single goal with its tasks
// @route   GET /api/goals/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    const tasks = await Task.find({ goalId: goal._id });
    
    res.json({
      goal,
      tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a goal
// @route   POST /api/goals
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, color } = req.body;
    
    const goal = await Goal.create({
      title,
      color
    });
    
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
