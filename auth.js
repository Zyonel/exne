import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// SIGNUP
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      //await sendEmailVerification(cred.user);

      await sendEmailVerification(cred.user, {
  url: "https://exne.onrender.com/index.html",
  handleCodeInApp: false
});

      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        profileCompleted: false
      });

      alert("Verify your email, then login.");
      window.location.href = "index.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (!cred.user.emailVerified) {
        alert("Verify your email first.");
        return;
      }

      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (!snap.data().profileCompleted) {
        window.location.href = "profile.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } catch (err) {
      alert(err.message);
    }
  });
}

// GOOGLE LOGIN
const googleBtn = document.getElementById("googleLogin");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const cred = await signInWithPopup(auth, provider);

      const userRef = doc(db, "users", cred.user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          email: cred.user.email,
          profileCompleted: false
        });
      }

      if (!snap.exists() || !snap.data().profileCompleted) {
        window.location.href = "profile.html";
      } else {
        window.location.href = "dashboard.html";
      }
    } catch (err) {
      alert(err.message);
    }
  });
}
