
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes
const eventRoutes = require('./routes/events');
const goalRoutes = require('./routes/goals');
const taskRoutes = require('./routes/tasks');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', taskRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
