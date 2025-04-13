  const express = require("express")
  const cors = require("cors")
  const { MongoClient, ObjectId } = require("mongodb")
  require("dotenv").config()

  const app = express()
  const PORT = process.env.PORT || 5000
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/calendar"
  const MONGODB_DB = process.env.MONGODB_DB || "calendar"

  // Middleware
  app.use(cors())
  app.use(express.json())

  // MongoDB Connection
  let db

  async function connectToDatabase() {
    try {
      const client = new MongoClient(MONGODB_URI)
      await client.connect()
      db = client.db(MONGODB_DB)
      console.log("Connected to MongoDB")
    } catch (error) {
      console.error("MongoDB connection error:", error)
      process.exit(1)
    }
  }

  // API Routes

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await db.collection("events").find({}).toArray()
      res.json(events)
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" })
    }
  })

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = req.body
      const result = await db.collection("events").insertOne({
        ...eventData,
        createdAt: new Date(),
      })
      const newEvent = await db.collection("events").findOne({ _id: result.insertedId })
      res.json(newEvent)
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" })
    }
  })

  app.put("/api/events/:id", async (req, res) => {
    try {
      const id = req.params.id
      const eventData = req.body

      await db
        .collection("events")
        .updateOne({ _id: new ObjectId(id) }, { $set: { ...eventData, updatedAt: new Date() } })

      const updatedEvent = await db.collection("events").findOne({ _id: new ObjectId(id) })
      res.json(updatedEvent)
    } catch (error) {
      res.status(500).json({ error: "Failed to update event" })
    }
  })

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = req.params.id
      await db.collection("events").deleteOne({ _id: new ObjectId(id) })
      res.json({ id })
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" })
    }
  })

  // Goals
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await db.collection("goals").find({}).toArray()

      // If no goals exist, seed some sample data
      if (goals.length === 0) {
        const sampleGoals = [
          { name: "Be fit", color: "bg-red-200" },
          { name: "Academics", color: "bg-blue-200" },
          { name: "LEARN", color: "bg-purple-200" },
          { name: "Sports", color: "bg-green-200" },
        ]

        await db.collection("goals").insertMany(sampleGoals)
        return res.json(await db.collection("goals").find({}).toArray())
      }

      res.json(goals)
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch goals" })
    }
  })

  // Tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await db.collection("tasks").find({}).toArray()

      // If no tasks exist, seed some sample data
      if (tasks.length === 0) {
        // First get the LEARN goal ID
        const learnGoal = await db.collection("goals").findOne({ name: "LEARN" })

        if (learnGoal) {
          const sampleTasks = [
            { name: "AI based agents", goalId: learnGoal._id.toString() },
            { name: "MLE", goalId: learnGoal._id.toString() },
            { name: "DE related", goalId: learnGoal._id.toString() },
            { name: "Basics", goalId: learnGoal._id.toString() },
          ]

          await db.collection("tasks").insertMany(sampleTasks)
          return res.json(await db.collection("tasks").find({}).toArray())
        }
      }

      res.json(tasks)
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" })
    }
  })

  // Seed route
  app.get("/api/seed", async (req, res) => {
    try {
      // Clear existing data
      await db.collection("goals").deleteMany({})
      await db.collection("tasks").deleteMany({})
      await db.collection("events").deleteMany({})

      // Seed goals
      const goalsResult = await db.collection("goals").insertMany([
        { name: "Be fit", color: "bg-red-200" },
        { name: "Academics", color: "bg-blue-200" },
        { name: "LEARN", color: "bg-purple-200" },
        { name: "Sports", color: "bg-green-200" },
      ])

      const goalIds = Object.values(goalsResult.insertedIds)

      // Seed tasks
      await db.collection("tasks").insertMany([
        { name: "AI based agents", goalId: goalIds[2].toString() },
        { name: "MLE", goalId: goalIds[2].toString() },
        { name: "DE related", goalId: goalIds[2].toString() },
        { name: "Basics", goalId: goalIds[2].toString() },
      ])

      // Get current date
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      const day = today.getDate()

      // Seed events
      await db.collection("events").insertMany([
        {
          title: "Monday Wake-Up",
          category: "exercise",
          date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          startTime: "8:00",
          endTime: "8:30",
        },
        {
          title: "All-Team Kickoff",
          category: "work",
          date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          startTime: "9:00",
          endTime: "10:00",
        },
        {
          title: "Financial Update",
          category: "work",
          date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          startTime: "10:00",
          endTime: "11:00",
        },
      ])

      res.json({ message: "Database seeded successfully" })
    } catch (error) {
      console.error("Seed error:", error)
      res.status(500).json({ error: "Failed to seed database" })
    }
  })

  // Start server
  async function startServer() {
    await connectToDatabase()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  }

  startServer()
