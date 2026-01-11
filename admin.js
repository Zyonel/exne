import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("taskForm");
const typeEl = document.getElementById("type");
const quizFields = document.getElementById("quizFields");
const visitFields = document.getElementById("visitFields");

// 🔐 ADMIN PROTECTION
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists() || !snap.data().isAdmin) {
    alert("Access denied");
    window.location.href = "dashboard.html";
  }
});

// 🔁 TOGGLE FIELDS
typeEl.addEventListener("change", () => {
  if (typeEl.value === "quiz") {
    quizFields.classList.remove("hidden");
    visitFields.classList.add("hidden");
  } else {
    quizFields.classList.add("hidden");
    visitFields.classList.remove("hidden");
  }
});

// 📤 SUBMIT TASK
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const type = typeEl.value;
  const title = document.getElementById("title").value;
  const reward = Number(document.getElementById("reward").value);

  const taskId = `${type}_${Date.now()}`;

  let taskData = {
    type,
    title,
    reward,
    active: true,
    createdAt: serverTimestamp()
  };

  if (type === "quiz") {
    taskData.question = document.getElementById("question").value;
    taskData.options = document.getElementById("options").value.split(",");
    taskData.correctIndex = Number(document.getElementById("correctIndex").value);
  }

  if (type === "visit") {
    taskData.url = document.getElementById("url").value;
    taskData.duration = Number(document.getElementById("duration").value);
  }

  try {
    await setDoc(doc(db, "dailyTasks", taskId), taskData);
    alert("✅ Task published");
    form.reset();
  } catch (err) {
    console.error(err);
    alert("Failed to publish task");
  }
});
