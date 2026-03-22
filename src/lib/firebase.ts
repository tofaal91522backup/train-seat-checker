import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC9-dT7_sLNYCCtSCBQFMQhmXSZ2U9mEH0",
  authDomain: "train-seat-tracker.firebaseapp.com",
  databaseURL: "https://train-seat-tracker-default-rtdb.firebaseio.com",
  projectId: "train-seat-tracker",
  storageBucket: "train-seat-tracker.firebasestorage.app",
  messagingSenderId: "187097079844",
  appId: "1:187097079844:web:f9fc3f75bc28ce616078b1",
  measurementId: "G-XRJ95TXPWN",
};

// prevent re-init issue (Next.js hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getDatabase(app);
