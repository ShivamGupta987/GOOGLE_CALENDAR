
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
