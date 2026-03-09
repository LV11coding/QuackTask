const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB securely!"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

const Mission = mongoose.model("Mission", {
  title: String,
  xp: Number,
  comments: [{ user: String, text: String }]
})

const User = mongoose.model("User", {
  name: String,
  xp: { type: Number, default: 0 }
})

const Resource = mongoose.model("Resource", {
  title: String,
  link: String
})

app.get("/missions", async (req, res) => {
  const missions = await Mission.find()
  res.json(missions)
})

app.post("/missions", async (req, res) => {
  const mission = new Mission(req.body)
  await mission.save()
  res.json(mission)
})

app.post("/missions/:id/complete", async (req, res) => {
  const { user: username } = req.body
  
  try {
    const mission = await Mission.findById(req.params.id)
    if (!mission) return res.status(404).json({ error: "Mission not found" })

    await User.findOneAndUpdate(
      { name: username },
      { $inc: { xp: mission.xp } },
      { upsert: true, new: true }
    )
    
    await Mission.findByIdAndDelete(req.params.id)
    
    res.json({ message: "Mission completed and XP awarded!" })
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
})

app.post("/missions/:id/comment", async (req, res) => {
  const mission = await Mission.findById(req.params.id)
  if (mission) {
    mission.comments.push(req.body)
    await mission.save()
    res.json(mission)
  } else {
    res.status(404).json({ error: "Mission not found" })
  }
})

app.get("/knowledge", async (req, res) => {
  const resources = await Resource.find()
  res.json(resources)
})

app.post("/knowledge", async (req, res) => {
  const resource = new Resource(req.body)
  await resource.save()
  res.json(resource)
})

app.get("/leaderboard", async (req, res) => {
  const users = await User.find().sort({ xp: -1 })
  res.json(users)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})

