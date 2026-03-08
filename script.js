const API_URL = "https://quacktask.onrender.com";

let missions = [];
let users = [];
let knowledge = [];

// Get stored data from the browser's memory
let currentUser = localStorage.getItem("quackUser");
let lastLoginTime = localStorage.getItem("quackLoginTime");

window.onload = function() {
    // 1. Always fetch data from the server so the leaderboard/missions show up
    loadData();

    // 2. Check if we should auto-log the user in
    if (currentUser && lastLoginTime) {
        const fiveMinutes = 5 * 60 * 1000;
        const now = new Date().getTime();

        if (now - lastLoginTime < fiveMinutes) {
            showLoggedInUI();
        } else {
            logout();
        }
    }
    
    // 3. Set up automatic refresh every 30 seconds
    setInterval(loadData, 30000);
};

function login() {
    const nameInput = document.getElementById("username");
    const name = nameInput ? nameInput.value.trim() : "";

    if (!name) {
        alert("Please enter a name to login!");
        return;
    }

    currentUser = name;
    const now = new Date().getTime();

    // Save login state
    localStorage.setItem("quackUser", name);
    localStorage.setItem("quackLoginTime", now);

    showLoggedInUI();
    loadData();
}

function showLoggedInUI() {
    // Show the main app content
    const appDiv = document.getElementById("app");
    if (appDiv) appDiv.style.display = "block";

    // Toggle header buttons
    const nameInput = document.getElementById("username");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (nameInput) {
        nameInput.style.display = "none";
        nameInput.value = currentUser;
    }
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
}

function logout() {
    localStorage.removeItem("quackUser");
    localStorage.removeItem("quackLoginTime");
    currentUser = null;

    // Hide app content
    const appDiv = document.getElementById("app");
    if (appDiv) appDiv.style.display = "none";

    // Reset header buttons
    const nameInput = document.getElementById("username");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (nameInput) {
        nameInput.style.display = "inline-block";
        nameInput.value = "";
    }
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
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

// --- API FETCH FUNCTIONS ---

async function loadMissions() {
    const res = await fetch(API_URL + "/missions");
    missions = await res.json();
    renderMissions();
}

async function addMission() {
    const title = document.getElementById("missionTitle").value;
    const xp = parseInt(document.getElementById("missionXP").value);

    if (!title || !xp) return;

    await fetch(API_URL + "/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, xp })
    });

    loadMissions();
}

async function completeMission(id) {
    if (!currentUser) return alert("You must be logged in!");

    await fetch(API_URL + "/missions/" + id + "/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: currentUser })
    });

    loadData();
}

async function addComment(id) {
    const text = document.getElementById("comment" + id).value;
    if (!text || !currentUser) return;

    await fetch(API_URL + "/missions/" + id + "/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: currentUser, text: text })
    });

    loadMissions();
}

async function loadLeaderboard() {
    const res = await fetch(API_URL + "/leaderboard");
    users = await res.json();
    renderLeaderboard();
}

async function loadKnowledge() {
    const res = await fetch(API_URL + "/knowledge");
    knowledge = await res.json();
    renderKnowledge();
}

async function addResource() {
    const title = document.getElementById("knowledgeTitle").value;
    const link = document.getElementById("knowledgeLink").value;
    if (!title || !link) return;

    await fetch(API_URL + "/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, link })
    });

    loadKnowledge();
}

// --- RENDERING FUNCTIONS ---

function renderMissions() {
    const missionsDiv = document.getElementById("missions");
    if (!missionsDiv) return;
    missionsDiv.innerHTML = "";

    missions.forEach(m => {
        let commentsHTML = "";
        if (m.comments) {
            m.comments.forEach(c => {
                commentsHTML += `<div class="comment"><b>${c.user}</b>: ${c.text}</div>`;
            });
        }

        missionsDiv.innerHTML += `
            <div class="mission">
                <h3>${m.title}</h3>
                <p>Reward: ${m.xp} XP</p>
                <button onclick="completeMission('${m._id}')">Complete</button>
                ${commentsHTML}
                <div class="commentBox">
                    <input id="comment${m._id}" placeholder="Ask a question">
                    <button onclick="addComment('${m._id}')">Send</button>
                </div>
            </div>`;
    });
}

function renderLeaderboard() {
    const div = document.getElementById("leaderboard");
    if (!div) return;
    div.innerHTML = "";

    users.forEach(u => {
        div.innerHTML += `
            <div class="leader">
                <span>${u.name}</span>
                <span>${u.xp} XP</span>
            </div>`;
    });
}

function renderKnowledge() {
    const div = document.getElementById("knowledge");
    if (!div) return;
    div.innerHTML = "";

    knowledge.forEach(r => {
        div.innerHTML += `
            <div class="resource">
                <a href="${r.link}" target="_blank">${r.title}</a>
            </div>`;
    });
}
