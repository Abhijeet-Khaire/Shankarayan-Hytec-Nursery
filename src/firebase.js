// Firebase Configuration for Shankarayan Hytec Nursery
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-pFS_QqdNg22uGD17UFx3xn7szVzXU54",
  authDomain: "nursery-website-3e968.firebaseapp.com",
  projectId: "nursery-website-3e968",
  storageBucket: "nursery-website-3e968.firebasestorage.app",
  messagingSenderId: "500745317342",
  appId: "1:500745317342:web:dc8aa56d29d1b6f9b2cb4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
