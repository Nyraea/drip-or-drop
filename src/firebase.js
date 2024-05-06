import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCS80JJHsGookrjpt6ssIsBAA3FFXAlelQ",
  authDomain: "drip-or-drop-dev.firebaseapp.com",
  projectId: "drip-or-drop-dev",
  storageBucket: "drip-or-drop-dev.appspot.com",
  messagingSenderId: "473114674113",
  appId: "1:473114674113:web:e9704b2dde475aca69a540",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
