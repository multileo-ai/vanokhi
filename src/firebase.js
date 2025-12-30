// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore for database
import { getAnalytics } from "firebase/analytics"; // Ensure this is imported

const firebaseConfig = {
  apiKey: "AIzaSyBG-MnVch2qmwHEqJ5bTya_jy2eAgfoGBg",
  authDomain: "vanokhi-web.firebaseapp.com",
  projectId: "vanokhi-web",
  storageBucket: "vanokhi-web.firebasestorage.app",
  messagingSenderId: "399331187738",
  appId: "1:399331187738:web:1fa2dfc4a3025ab46405a3",
  measurementId: "G-YT6WQ40V8K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // Export the database for your cart/wishlist
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
