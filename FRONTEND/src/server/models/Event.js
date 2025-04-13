
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['exercise', 'eating', 'work', 'relax', 'family', 'social'],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  taskId: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
