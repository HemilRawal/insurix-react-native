import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArkShE8XXzVrgc9swKRiXBsIUiCM0KP2w",
  authDomain: "insurix-app.firebaseapp.com",
  projectId: "insurix-app",
  storageBucket: "insurix-app.firebasestorage.app",
  messagingSenderId: "1036424392744",
  appId: "1:1036424392744:web:747be354a191e45109851d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);