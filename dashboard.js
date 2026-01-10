import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const content = document.getElementById("content");
const avatar = document.getElementById("avatar");
const welcomeText = document.getElementById("welcomeText");

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
  document.addEventListener("DOMContentLoaded", () => {
    const greetingEl = document.getElementById("welcomeText") + data.username;
    if (greetingEl) {
      greetingEl.textContent = getGreeting();
    }
  });


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return;

  const data = snap.data();
  avatar.src = data.photoURL;
  //welcomeText.textContent = `document.getElementById("welcomeText"), ${data.username}`;

//  welcomeText.textContent = `document.getElementById("welcomeText"), ${data.username}`;

});

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

    if (action === "rewards") alert("Daily Rewards");
    if (action === "tasks") alert("Daily Tasks");
    if (action === "games") alert("Mini Games");
    if (action === "watch") alert("Watch & Earn");
  });
});
