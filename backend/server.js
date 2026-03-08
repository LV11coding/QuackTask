const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://PrimeUser:<prime123Prime>@mycluster.7gbfl7e.mongodb.net/?appName=MyCluster")

const Mission = mongoose.model("Mission", {

title:String,
xp:Number

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

app.listen(3000, ()=>{

console.log("Server running")

})