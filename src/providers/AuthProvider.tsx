"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChanged, isGuestUser, signInAsGuest } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import type { User, AuthState } from "@/types";

interface AuthContextValue extends AuthState {
  isConfigured: boolean;
  signUpAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapFirebaseUser(fbUser: FirebaseUser | null): User | null {
  if (!fbUser) return null;
  return {
    id: fbUser.uid,
    name: fbUser.displayName || (fbUser.isAnonymous ? "Guest" : fbUser.email?.split("@")[0] || null),
    email: fbUser.email || null,
    phone: null,
    authProvider: fbUser.isAnonymous ? "guest" : fbUser.providerData[0]?.providerId === "google.com" ? "google" : "email",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/** Create a fake guest user for offline/demo mode */
function makeOfflineUser(): User {
  return {
    id: "offline-guest-" + Date.now(),
    name: "Guest",
    email: null,
    phone: null,
    authProvider: "guest",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (!firebaseReady) {
      // No Firebase config — skip auth entirely with no user
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthChanged((fbUser) => {
      setUser(mapFirebaseUser(fbUser));
      setIsLoading(false);
    });
    return unsubscribe;
  }, [firebaseReady]);

  const signUpAsGuest = async () => {
    if (!firebaseReady) {
      // Offline mode: create a fake guest user so the UI works
      setUser(makeOfflineUser());
      return;
    }
    try {
      const fbUser = await signInAsGuest();
      if (fbUser) {
        setUser(mapFirebaseUser(fbUser));
      }
    } catch {
      // Fallback: create offline user on error
      setUser(makeOfflineUser());
    }
  };

  const isGuest = user?.authProvider === "guest";

  return (
    <AuthContext.Provider value={{ user, isLoading, isGuest, isConfigured: firebaseReady, signUpAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
