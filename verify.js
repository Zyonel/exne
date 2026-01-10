import { auth } from "./firebase.js";
import {
  applyActionCode,
  checkActionCode
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const status = document.getElementById("status");

const params = new URLSearchParams(window.location.search);
const oobCode = params.get("oobCode");

if (!oobCode) {
  status.textContent = "Invalid or missing verification code.";
} else {
  try {
    await checkActionCode(auth, oobCode);
    await applyActionCode(auth, oobCode);

    status.textContent = "Email verified successfully! Redirecting...";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (err) {
    status.textContent = "Verification failed or expired.";
  }
}
