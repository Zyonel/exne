import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("profileForm");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const user = auth.currentUser;

  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=6a5af9&color=fff`;

  try {
    await updateDoc(doc(db, "users", user.uid), {
      username,
      photoURL: avatar,
      profileCompleted: true
    });

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});
