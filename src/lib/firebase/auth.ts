// Firebase Authentication service (safe without credentials)

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import { getAuthInstance, isFirebaseConfigured } from "./config";

const googleProvider = new GoogleAuthProvider();

function getAuth() {
  const auth = getAuthInstance();
  if (!auth) throw new Error("Firebase is not configured. Create .env.local with Firebase credentials.");
  return auth;
}

export async function signInWithGoogle() {
  if (!isFirebaseConfigured()) throw new Error("Firebase not configured");
  try {
    const result = await signInWithPopup(getAuth(), googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string) {
  if (!isFirebaseConfigured()) throw new Error("Firebase not configured");
  try {
    const result = await signInWithEmailAndPassword(getAuth(), email, password);
    return result.user;
  } catch (error) {
    console.error("Email sign-in error:", error);
    throw error;
  }
}

export async function registerWithEmail(email: string, password: string) {
  if (!isFirebaseConfigured()) throw new Error("Firebase not configured");
  try {
    const result = await createUserWithEmailAndPassword(getAuth(), email, password);
    return result.user;
  } catch (error) {
    console.error("Email registration error:", error);
    throw error;
  }
}

export async function signInAsGuest(): Promise<FirebaseUser | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const result = await signInAnonymously(getAuth());
    return result.user;
  } catch (error) {
    console.error("Guest sign-in error:", error);
    throw error;
  }
}

export async function logout() {
  if (!isFirebaseConfigured()) return;
  try {
    await signOut(getAuth());
  } catch (error) {
    console.error("Sign-out error:", error);
    throw error;
  }
}

export function onAuthChanged(callback: (user: FirebaseUser | null) => void) {
  if (!isFirebaseConfigured()) {
    // Immediately callback with null so AuthProvider knows we're done loading
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(getAuth(), callback);
}

export function getUserDisplayName(user: FirebaseUser | null): string {
  if (!user) return "";
  if (user.isAnonymous) return "Guest";
  return user.displayName || user.email?.split("@")[0] || "User";
}

export function isGuestUser(user: FirebaseUser | null): boolean {
  return !!user?.isAnonymous;
}
