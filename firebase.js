import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCKzecKCOTrK1mwpEOZvsuHumcyHsIeITk",
  authDomain: "exnex-1fae3.firebaseapp.com",
  projectId: "exnex-1fae3",
  storageBucket: "exnex-1fae3.firebasestorage.app",
  messagingSenderId: "984288706160",
  appId: "1:984288706160:web:7aebb32407964d85f17eb5"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
