import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists() || !snap.data().profileCompleted) {
    window.location.href = "profile.html";
    return;
  }

  const data = snap.data();
  document.getElementById("username").textContent = data.username;
  document.getElementById("email").textContent = user.email;
  document.getElementById("profilePic").src = data.photoURL;
});
