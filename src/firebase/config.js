import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <-- ADD THIS IMPORT
// =================================================================
// PASTE YOUR COPIED FIREBASE CONFIGURATION OBJECT HERE
// It should look like this:
const firebaseConfig = {
  apiKey: "AIzaSyCnMgq19Pa3l7dHBYQT9rtS3IwAMSod4jE",
  authDomain: "portfolio-forge-4e0a9.firebaseapp.com",
  projectId: "portfolio-forge-4e0a9",
  storageBucket: "portfolio-forge-4e0a9.firebasestorage.app",
  messagingSenderId: "701512154883",
  appId: "1:701512154883:web:15128fafeac3068b683336",
  measurementId: "G-P6FZ0HJHHR"
};
// =================================================================


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the services you'll need
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); // <-- ADD THIS EXPORT