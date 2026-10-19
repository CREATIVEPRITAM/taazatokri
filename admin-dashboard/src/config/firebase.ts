import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate that minimum configuration is provided
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn(
    '[TaazaTokari] Firebase configuration missing in environment variables. Check .env'
  );
}

// Initialize Firebase app singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Authentication instance for Admin
export const auth = getAuth(app);

// Cloud Firestore instance for Admin Dashboard
export const db = getFirestore(app);

// NOTE: Firebase Storage is intentionally NOT initialized here per Phase 2 foundation instructions.
