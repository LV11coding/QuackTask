const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://PrimeUser:prime123Prime@mycluster.7gbfl7e.mongodb.net/?appName=MyCluster")

const Mission = mongoose.model("Mission", {
  title: String,
  xp: Number,
  comments: [{ user: String, text: String }]
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
  const mission = await Mission.findByIdAndDelete(req.params.id)
  if (mission) {
    res.json({ message: "Completed" })
  } else {
    res.status(404).json({ error: "Not found" })
  }
})

app.post("/missions/:id/comment", async (req, res) => {
  const mission = await Mission.findById(req.params.id)
  if (mission) {
    mission.comments.push(req.body)
    await mission.save()
    res.json(mission)
  } else {
    res.status(404).json({ error: "Not found" })
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
  res.json([]) 
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})
