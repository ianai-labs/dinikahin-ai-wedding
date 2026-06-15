// Firestore service functions (client-side, safe without credentials)

import {
  doc,
  collection,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./config";
import type {
  Conversation,
  Message,
  Venue,
  Vendor,
  Recommendation,
  ExtractedRequirements,
} from "@/types";

function db() {
  const d = getDb();
  if (!d) throw new Error("Firebase is not configured. Create .env.local with Firebase credentials.");
  return d;
}

function firebaseNotConfigured(): never {
  throw new Error("Firebase is not configured. Create .env.local with Firebase credentials.");
}

// --- Conversations ---

export async function createConversation(userId: string): Promise<string> {
  if (!isFirebaseConfigured()) return "offline-conv-" + Date.now();
  const docRef = await addDoc(collection(db(), "conversations"), {
    userId,
    messages: [],
    extractedRequirements: null,
    completenessScore: 0,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getConversation(id: string) {
  if (!isFirebaseConfigured()) return null;
  const docSnap = await getDoc(doc(db(), "conversations", id));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Conversation;
}

export function listenToConversation(
  id: string,
  callback: (data: Conversation | null) => void
) {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => {};
  }
  return onSnapshot(doc(db(), "conversations", id), (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback({ id: snap.id, ...snap.data() } as Conversation);
  });
}

export async function addMessage(
  conversationId: string,
  message: Omit<Message, "id" | "timestamp">
) {
  if (!isFirebaseConfigured()) {
    return { id: crypto.randomUUID(), ...message, timestamp: new Date() };
  }
  const convRef = doc(db(), "conversations", conversationId);
  const newMessage = {
    id: crypto.randomUUID(),
    ...message,
    timestamp: Timestamp.now(),
  };

  const convSnap = await getDoc(convRef);
  const existing = convSnap.data();
  const messages = [...(existing?.messages || []), newMessage];

  await updateDoc(convRef, {
    messages,
    updatedAt: serverTimestamp(),
  });

  return newMessage;
}

export async function updateRequirements(
  conversationId: string,
  requirements: ExtractedRequirements,
  completenessScore: number
) {
  if (!isFirebaseConfigured()) return;
  await updateDoc(doc(db(), "conversations", conversationId), {
    extractedRequirements: requirements,
    completenessScore,
    updatedAt: serverTimestamp(),
  });
}

export async function completeConversation(conversationId: string) {
  if (!isFirebaseConfigured()) return;
  await updateDoc(doc(db(), "conversations", conversationId), {
    status: "completed",
    updatedAt: serverTimestamp(),
  });
}

// --- Venues ---

export async function getVenueBySlug(slug: string) {
  if (!isFirebaseConfigured()) return null;
  const q = query(collection(db(), "venues"), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Venue;
}

export async function getVenues(filters?: {
  location?: string;
  capacity?: number;
  type?: string;
}) {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(db(), "venues"), where("isActive", "==", true), limit(50));
  const snap = await getDocs(q);
  let venues = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Venue);

  if (filters?.location) {
    venues = venues.filter(
      (v) =>
        v.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        v.location.area.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  if (filters?.capacity) {
    venues = venues.filter((v) => v.capacity.max >= filters.capacity!);
  }
  if (filters?.type) {
    venues = venues.filter((v) => v.venueType === filters.type);
  }

  return venues;
}

// --- Vendors ---

export async function getVendorsForVenue(venueArea: string) {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(db(), "vendors"), where("isActive", "==", true), limit(30));
  const snap = await getDocs(q);
  const vendors = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Vendor);
  return vendors.filter((v) => v.location.area === venueArea || v.location.city === venueArea);
}

// --- Recommendations ---

export async function createRecommendation(data: {
  userId: string;
  conversationId: string;
  requirements: ExtractedRequirements;
  recommendedVenues: Array<{ venueId: string; score: number; rank: number; reason: string }>;
  recommendedVendors: Array<{ venueId: string; category: string; vendorIds: string[] }>;
}) {
  if (!isFirebaseConfigured()) return "offline-rec-" + Date.now();
  const docRef = await addDoc(collection(db(), "recommendations"), {
    ...data,
    generatedSummary: "",
    userFeedback: null,
    iteration: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getRecommendation(id: string) {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(db(), "recommendations", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Recommendation;
}

export async function updateRecommendationFeedback(id: string, feedback: string) {
  if (!isFirebaseConfigured()) return;
  const snap = await getDoc(doc(db(), "recommendations", id));
  const current = snap.data();
  await updateDoc(doc(db(), "recommendations", id), {
    userFeedback: feedback,
    iteration: (current?.iteration || 0) + 1,
  });
}

// --- Leads ---

export async function createLead(data: {
  userId: string;
  recommendationId: string;
  contactInfo: { name: string; phone: string; email?: string };
  summary: string;
}) {
  if (!isFirebaseConfigured()) return "offline-lead-" + Date.now();
  const docRef = await addDoc(collection(db(), "leads"), {
    ...data,
    partnerId: null,
    status: "pending",
    notes: null,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// --- Users ---

export async function createUserDocument(
  userId: string,
  data: { name?: string; email?: string; authProvider: string }
) {
  if (!isFirebaseConfigured()) return;
  await setDoc(
    doc(db(), "users", userId),
    {
      ...data,
      phone: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
