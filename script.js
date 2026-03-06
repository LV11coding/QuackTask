let currentUser=null

let missions=JSON.parse(localStorage.getItem("missions"))||[]
let users=JSON.parse(localStorage.getItem("users"))||{}
let knowledge=JSON.parse(localStorage.getItem("knowledge"))||[]

function save(){

localStorage.setItem("missions",JSON.stringify(missions))
localStorage.setItem("users",JSON.stringify(users))
localStorage.setItem("knowledge",JSON.stringify(knowledge))

}

function login(){

const name=document.getElementById("username").value

if(!name)return

currentUser=name

if(!users[name]) users[name]=0

document.getElementById("app").style.display="block"

render()

}

function addMission(){

const title=document.getElementById("missionTitle").value
const xp=parseInt(document.getElementById("missionXP").value)

if(!title||!xp)return

missions.unshift({

id:Date.now(),
title,
xp,
comments:[],
doneBy:[]

})

save()

render()

}

function completeMission(id){

let m=missions.find(x=>x.id===id)

if(m.doneBy.includes(currentUser))return

m.doneBy.push(currentUser)

users[currentUser]+=m.xp

save()

render()

}

function addComment(id){

let text=document.getElementById("comment"+id).value

if(!text)return

let m=missions.find(x=>x.id===id)

m.comments.push({

user:currentUser,
text

})

save()

render()

}

function addResource(){

const title=document.getElementById("knowledgeTitle").value
const link=document.getElementById("knowledgeLink").value

knowledge.unshift({title,link})

save()

render()

}

function render(){

const missionsDiv=document.getElementById("missions")

missionsDiv.innerHTML=""

missions.forEach(m=>{

let comments=""

m.comments.forEach(c=>{

comments+=`<div class="comment"><b>${c.user}</b>: ${c.text}</div>`

})

missionsDiv.innerHTML+=`

<div class="mission">

<h3>${m.title}</h3>

<p>Reward: ${m.xp} XP</p>

<button onclick="completeMission(${m.id})">Complete</button>

${comments}

<div class="commentBox">

<input id="comment${m.id}" placeholder="Ask a question">

<button onclick="addComment(${m.id})">Send</button>

</div>

</div>

`

})

renderLeaderboard()
renderKnowledge()

}

function renderLeaderboard(){

const div=document.getElementById("leaderboard")

div.innerHTML=""

let sorted=Object.entries(users).sort((a,b)=>b[1]-a[1])

sorted.forEach(u=>{

div.innerHTML+=`

<div class="leader">

<span>${u[0]}</span>
<span>${u[1]} XP</span>

</div>

`

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
