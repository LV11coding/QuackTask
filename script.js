let currentUser = null

let missions = JSON.parse(localStorage.getItem("missions")) || []
let users = JSON.parse(localStorage.getItem("users")) || {}
let knowledge = JSON.parse(localStorage.getItem("knowledge")) || []

function saveData(){
localStorage.setItem("missions", JSON.stringify(missions))
localStorage.setItem("users", JSON.stringify(users))
localStorage.setItem("knowledge", JSON.stringify(knowledge))
}

function login(){

const name = document.getElementById("username").value

if(!name) return

currentUser = name

if(!users[name]){
users[name] = 0
}

document.getElementById("app").style.display="block"

render()

}

function addMission(){

const title = document.getElementById("missionTitle").value
const xp = parseInt(document.getElementById("missionXP").value)

if(!title || !xp) return

missions.push({
id:Date.now(),
title:title,
xp:xp,
comments:[],
doneBy:[]
})

saveData()

render()

}

function completeMission(id){

const mission = missions.find(m=>m.id===id)

if(mission.doneBy.includes(currentUser)) return

mission.doneBy.push(currentUser)

users[currentUser]+=mission.xp

saveData()

render()

}

function addComment(id){

const text = document.getElementById("comment"+id).value

const mission = missions.find(m=>m.id===id)

mission.comments.push({
user:currentUser,
text:text
})

saveData()

render()

}

function addResource(){

const title=document.getElementById("knowledgeTitle").value
const link=document.getElementById("knowledgeLink").value

knowledge.push({title,link})

saveData()

render()

}

function render(){

const missionsDiv = document.getElementById("missions")

missionsDiv.innerHTML=""

missions.forEach(m=>{

let commentsHTML=""

m.comments.forEach(c=>{
commentsHTML+=`<div class="comment"><b>${c.user}</b>: ${c.text}</div>`
})

missionsDiv.innerHTML+=`

<div class="mission">

<h3>${m.title}</h3>

<p>XP: ${m.xp}</p>

<button onclick="completeMission(${m.id})">Complete</button>

<h4>Comments</h4>

${commentsHTML}

<input id="comment${m.id}" placeholder="Ask something">

<button onclick="addComment(${m.id})">Send</button>

</div>

`

})

renderLeaderboard()
renderKnowledge()

}

function renderLeaderboard(){

const div=document.getElementById("leaderboard")

let sorted=Object.entries(users).sort((a,b)=>b[1]-a[1])

div.innerHTML=""

sorted.forEach(u=>{

div.innerHTML+=`<div>${u[0]} : ${u[1]} XP</div>`

})

}

function renderKnowledge(){

const div=document.getElementById("knowledge")

div.innerHTML=""

knowledge.forEach(r=>{

div.innerHTML+=`

<div class="resource">

<a href="${r.link}" target="_blank">${r.title}</a>

</div>

`

})

}