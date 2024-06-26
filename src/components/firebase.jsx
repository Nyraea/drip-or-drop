// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Add this import for Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCS80JJHsGookrjpt6ssIsBAA3FFXAlelQ",
  authDomain: "drip-or-drop-dev.firebaseapp.com",
  databaseURL: "https://drip-or-drop-dev-default-rtdb.firebaseio.com",
  projectId: "drip-or-drop-dev",
  storageBucket: "drip-or-drop-dev.appspot.com",
  messagingSenderId: "473114674113",
  appId: "1:473114674113:web:e9704b2dde475aca69a540",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
