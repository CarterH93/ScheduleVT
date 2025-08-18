import { initializeApp } from "firebase/app";
import { getFirestore, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9u5FG32JTALTYRFt3czdUX8gQyaF6llk",
  authDomain: "schedulevt-56b72.firebaseapp.com",
  projectId: "schedulevt-56b72",
  storageBucket: "schedulevt-56b72.firebasestorage.app",
  messagingSenderId: "326236716515",
  appId: "1:326236716515:web:bb89aae3fa2a89f59ff4d6"
};

//init firebase
initializeApp(firebaseConfig);

//init firestore
const db = getFirestore();

//init firebase auth
const auth = getAuth();

//timestamp
const timestamp = Timestamp;

export { db, auth, timestamp };
