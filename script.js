const API_URL = "https://quacktask.onrender.com"

let currentUser = null
let missions = []
let users = {}
let knowledge = []

function login(){

const name = document.getElementById("username").value

if(!name) return

currentUser = name

document.getElementById("app").style.display="block"

loadData()

}

async function loadData() {
    try {
        await Promise.all([
            loadMissions(),
            loadLeaderboard(),
            loadKnowledge()
        ]);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

async function loadMissions(){

const res = await fetch(API_URL + "/missions")

missions = await res.json()

renderMissions()

}

async function addMission(){

const title = document.getElementById("missionTitle").value
const xp = parseInt(document.getElementById("missionXP").value)

if(!title || !xp) return

await fetch(API_URL + "/missions",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

title:title,
xp:xp

})

})

loadMissions()

}

async function completeMission(id){

await fetch(API_URL + "/missions/"+id+"/complete",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user:currentUser

})

})

loadData()

}

async function addComment(id){

const text=document.getElementById("comment"+id).value

if(!text) return

await fetch(API_URL + "/missions/"+id+"/comment",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

user:currentUser,
text:text

})

})

loadMissions()

}

async function loadLeaderboard(){

const res = await fetch(API_URL + "/leaderboard")

users = await res.json()

renderLeaderboard()

}

async function loadKnowledge(){

const res = await fetch(API_URL + "/knowledge")

knowledge = await res.json()

renderKnowledge()

}

async function addResource(){

const title=document.getElementById("knowledgeTitle").value
const link=document.getElementById("knowledgeLink").value

await fetch(API_URL + "/knowledge",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

title,
link

})

})

loadKnowledge()

}

function renderMissions(){

const missionsDiv=document.getElementById("missions")

missionsDiv.innerHTML=""

missions.forEach(m=>{

let comments=""

if(m.comments){

m.comments.forEach(c=>{

comments+=`<div class="comment"><b>${c.user}</b>: ${c.text}</div>`

})

}

missionsDiv.innerHTML+=`

<div class="mission">

<h3>${m.title}</h3>

<p>Reward: ${m.xp} XP</p>

<button onclick="completeMission('${m._id}')">Complete</button>

${comments}

<div class="commentBox">

<input id="comment${m._id}" placeholder="Ask a question">

<button onclick="addComment('${m._id}')">Send</button>

</div>

</div>

`

})

}

function renderLeaderboard(){

const div=document.getElementById("leaderboard")

div.innerHTML=""

users.forEach(u=>{

div.innerHTML+=`

<div class="leader">

<span>${u.name}</span>
<span>${u.xp} XP</span>

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

