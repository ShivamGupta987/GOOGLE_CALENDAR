
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create an event
// @route   POST /api/events
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, category, startTime, endTime, taskId, color } = req.body;
    
    const event = await Event.create({
      title,
      category,
      startTime,
      endTime,
      taskId,
      color
    });
    
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const { title, category, startTime, endTime, taskId, color } = req.body;
    
    event.title = title || event.title;
    event.category = category || event.category;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.taskId = taskId || event.taskId;
    event.color = color || event.color;
    
    const updatedEvent = await event.save();
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    await event.deleteOne();
    
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
