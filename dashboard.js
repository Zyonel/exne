import { auth, db } from "./firebase.js";

import { setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
//import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  doc,
  getDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

//Daily tasks logic
const DAILY_TASKS = [
  {
    id: "quiz_1",
    type: "quiz",
    title: "Answer today’s quiz",
    reward: 20,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Transfer Machine Language",
      "Hyperlinks Text Management Logic"
    ],
    correctIndex: 0
  },
  {
    id: "visit_1",
    type: "visit",
    title: "Visit a page for 20 seconds",
    reward: 15,
    url: "https://example.com",
    duration: 20
  }
];

const content = document.getElementById("content");
const avatar = document.getElementById("avatar");
const welcomeText = document.getElementById("welcomeText");
const totalCoinsEl = document.getElementById("balanceValue");

let currentCoins = 0;
let userRef = null;


// greeting script

function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 22) {
      return "Good evening";
    } else {
      return "Good night";
    }
  }

  // Example usage
 /* document.addEventListener("DOMContentLoaded", () => {
    const greetingEl = document.getElementById("welcomeText");
    if (greetingEl) {
      greetingEl.textContent = getGreeting();
    }
  });*/


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  //const snap = await getDoc(doc(db, "users", user.uid));
 userRef = doc(db, "users", user.uid);
const snap = await getDoc(userRef);

  if (!snap.exists()) return;

  const data = snap.data();
  avatar.src = data.photoURL;
  //welcomeText.textContent = `Welcome, ${data.username}`;
  
  //welcomeText.textContent = document.getElementById("welcomeText")`, ${data.username}`;

//  welcomeText.textContent = `document.getElementById("welcomeText"), ${data.username}`;

const greeting = getGreeting();
welcomeText.textContent = `${greeting}, ${data.username}`;

currentCoins = data.coins || 0;
if (totalCoinsEl) {
  totalCoinsEl.textContent = currentCoins;
}

});

//change coins
async function addCoins(amount) {
  if (!userRef) return;

  try {
    await updateDoc(userRef, {
      coins: increment(amount)
    });

    currentCoins += amount;

    if (totalCoinsEl) {
      totalCoinsEl.textContent = currentCoins;
    }

  } catch (err) {
    console.error("Coin update failed:", err);
    alert("Something went wrong. Please try again.");
  }
}

// Navigation
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const page = btn.dataset.page;

    if (page === "home") {
      content.innerHTML = "<h2>Home</h2>";
    } 
    else if (page === "transactions") {
      content.innerHTML = "<h2>Transactions</h2>";
    } 
    else if (page === "profile") {
      content.innerHTML = "<h2>Profile</h2>";
    }
  });
});

/* sub main */
document.querySelectorAll(".dash-card").forEach(card => {
  card.addEventListener("click", () => {
    const action = card.dataset.action;

if (action === "rewards") {
  addCoins(10);
  alert("🎁 Daily Reward claimed! +10 Exnex Coins");
}

/*if (action === "tasks") {
  addCoins(5);
  alert("✅ Task completed! +5 Exnex Coins");
}*/
if (action === "tasks") {
  document.getElementById("taskModal").classList.remove("hidden");
  renderTasks();
}


if (action === "games") {
  addCoins(3);
  alert("🎮 Game played! +3 Exnex Coins");
}

if (action === "watch") {
  addCoins(2);
  alert("📺 Video watched! +2 Exnex Coins");
}

  });
});

//close daily task modal
document.getElementById("closeTasks").onclick = () => {
  document.getElementById("taskModal").classList.add("hidden");
};

//render task 
const taskList = document.getElementById("taskList");

function renderTasks() {
  taskList.innerHTML = "";

  DAILY_TASKS.forEach(task => {
    const div = document.createElement("div");

    div.innerHTML = `
      <p>${task.title}</p>
      <button onclick="startTask('${task.id}')">
        Earn ${task.reward} coins
      </button>
    `;

    taskList.appendChild(div);
  });
}

//task ctrl
function startTask(taskId) {
  const task = DAILY_TASKS.find(t => t.id === taskId);
  if (!task) return;

  if (task.type === "quiz") startQuiz(task);
  if (task.type === "visit") startVisit(task);
}

//quiz task
function startQuiz(task) {
  const answer = prompt(
    task.question + "\n\n" +
    task.options.map((o, i) => `${i + 1}. ${o}`).join("\n")
  );

  if (parseInt(answer) - 1 === task.correctIndex) {
    addCoins(task.reward);
    alert("Correct! Coins added.");
  } else {
    alert("Wrong answer.");
  }
}

//link visit
function startVisit(task) {
  const win = window.open(task.url, "_blank");

  let time = task.duration;
  const timer = setInterval(() => {
    time--;
    if (time <= 0) {
      clearInterval(timer);
      if (win && !win.closed) win.close();
      addCoins(task.reward);
      alert("Task completed. Coins added.");
    }
  }, 1000);
}

//coin system
/*let coins = 0;

function addCoins(amount) {
  coins += amount;
  document.getElementById("balanceValue").textContent = coins;
}*/
