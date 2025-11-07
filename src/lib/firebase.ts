
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && 
         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'REPLACE_WITH_YOUR_PROJECT_ID';
};

// Firebase configuration - use environment variables if available
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "REPLACE_WITH_YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "REPLACE_WITH_YOUR_APP_ID"
};

let app: any = null;
let db: any = null;
let storage: any = null;

// Only initialize Firebase if properly configured
if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase initialized successfully");
  } catch (e) {
    console.error("Firebase initialization error", e);
  }
} else {
  console.log("Firebase not configured - using mock data mode");
}

export { db, storage, isFirebaseConfigured };
