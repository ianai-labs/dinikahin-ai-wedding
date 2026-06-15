// Firebase client configuration (lazy-initialized, safe without credentials)

import { initializeApp, getApps, getApp as getFirebaseApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

/** Check if Firebase credentials are properly configured (not dummy values) */
export function isFirebaseConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  // Valid Firebase API keys are ~39 characters, alphanumeric with underscores/dashes
  if (!key || key.length < 20 || key === "demo-api-key" || key.startsWith("demo")) {
    return false;
  }
  return true;
}

function getOrInitApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!_app) {
    _app = !getApps().length ? initializeApp(firebaseConfig) : getFirebaseApp();
  }
  return _app;
}

export function getDb(): Firestore | null {
  if (!isFirebaseConfigured()) return null;
  if (!_db) {
    const app = getOrInitApp();
    if (!app) return null;
    _db = getFirestore(app);
  }
  return _db;
}

export function getAuthInstance(): Auth | null {
  if (!isFirebaseConfigured()) return null;
  if (!_auth) {
    const app = getOrInitApp();
    if (!app) return null;
    _auth = getAuth(app);
  }
  return _auth;
}
