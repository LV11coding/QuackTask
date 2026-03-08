const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://PrimeUser:prime123Prime@mycluster.7gbfl7e.mongodb.net/?appName=MyCluster")

const Mission = mongoose.model("Mission", {

title:String,
xp:Number
comments: [{ user: String, text: String }]

})

app.get("/missions", async (req,res)=>{

const missions = await Mission.find()

res.json(missions)

})

app.post("/missions", async (req,res)=>{

const mission = new Mission(req.body)

await mission.save()

res.json(mission)

})

app.post("/missions/:id/complete", async (req, res) => {
  const { user } = req.body;
  const mission = await Mission.findById(req.params.id);

  if (mission) {
    console.log(`${user} completed mission: ${mission.title}`);
    await Mission.findByIdAndDelete(req.params.id);
    res.json({ message: "Mission completed and removed!" });
  } else {
    res.status(404).json({ error: "Mission not found" });
  }
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})



