
# Calendar Application

A Google Calendar-like application built with React and MongoDB.

## Features

- Create, update, and delete events
- Color-coded event categories
- Drag and drop tasks onto the calendar
- Task and goal management
- MongoDB integration for data persistence

## Backend API Endpoints

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event
- `GET /api/goals` - Get all goals
- `GET /api/goals/:id` - Get a specific goal with its tasks
- `POST /api/goals` - Create a new goal
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/goal/:goalId` - Get tasks by goal
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task

## MongoDB Configuration

The application uses MongoDB with the following configuration:

- Connection URI: `mongodb+srv://sg0802599:WUmxS3fNnGHBO2di@react-calendar.qqxmroc.mongodb.net/?retryWrites=true&w=majority&appName=react-calendar`
- Database Name: `calendar`
- Server Port: `5000`

## Running the Application

1. Start the backend server:
   ```
   node src/server/server.js
   ```

2. In a separate terminal, start the React app:
   ```
   npm run dev
   ```

## Technologies Used

- React
- TypeScript
- Node.js
- Express
- MongoDB
- Mongoose
- React Query for data fetching
