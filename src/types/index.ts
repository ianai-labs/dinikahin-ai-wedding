// Types for the dinikahin.com AI Wedding Consultant

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  authProvider: "google" | "email" | "guest";
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isGuest: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  venues?: VenueCardData[]; // Venue cards embedded in AI messages
}

export interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  extractedRequirements: ExtractedRequirements | null;
  completenessScore: number;
  status: "active" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtractedRequirements {
  budget: {
    min: number;
    max: number;
    currency: string;
  } | null;
  location: {
    city: string;
    area: string;
    specificAreas: string[];
  } | null;
  guestCount: {
    exact: number;
    rangeMin: number;
    rangeMax: number;
  } | null;
  venueType: string | null;
  venueSetting: "Indoor" | "Outdoor" | "Semi-Outdoor" | null;
  style: string | null;
  culturalPreference: string | null;
  preferredDate: {
    month: number;
    year: number;
    flexibility: string;
  } | null;
  specialRequirements: string[];
  completenessScore: number;
  missingFields: string[];
}

export interface Venue {
  id: string;
  venueName: string;
  slug: string;
  location: {
    city: string;
    area: string;
    address: string;
    geolocation?: { lat: number; lng: number };
  };
  capacity: { min: number; max: number };
  priceRange: { min: number; max: number; currency: string };
  pricing?: {
    type: "per_pax" | "fixed" | "both";
    pricePerPax: number | null;
    fixedCharge: number | null;
    packages: Record<string, number | null>;
  };
  venueType: "Hotel Ballroom" | "Gedung" | "Outdoor" | "Tenda" | "Aula" | "Restaurant";
  setting: "Indoor" | "Outdoor" | "Semi-Outdoor";
  style: string[];
  images: string[];
  packageInfo: {
    description: string;
    includes: string[];
    excludes: string[];
  };
  includesCatering?: boolean;
  pros: string[];
  cons: string[];
  specialFeatures: string[];
  partnerId: string | null;
  isActive: boolean;
}

export interface VenueCardData {
  venueId: string;
  venueName: string;
  slug: string;
  location: string;
  capacity: number;
  priceRange: { min: number; max: number };
  imageUrl: string;
  score: number;
  reason: string;
}

export interface Vendor {
  id: string;
  vendorName: string;
  category: "Decoration" | "Makeup Artist" | "Entertainment" | "Photography" | "Catering";
  location: { city: string; area: string };
  priceRange: { min: number; max: number; currency: string };
  isActive: boolean;
}

export interface Recommendation {
  id: string;
  userId: string;
  conversationId: string;
  requirements: ExtractedRequirements;
  recommendedVenues: Array<{
    venueId: string;
    score: number;
    rank: number;
    reason: string;
  }>;
  recommendedVendors: Array<{
    venueId: string;
    category: string;
    vendorIds: string[];
  }>;
  generatedSummary: string;
  userFeedback: string | null;
  iteration: number;
}

export interface Lead {
  id: string;
  userId: string;
  recommendationId: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string | null;
  };
  summary: string;
  partnerId: string | null;
  status: "pending" | "contacted" | "converted" | "lost";
  notes: string | null;
  createdAt: Date;
}

export interface ScoreBreakdown {
  budget: number;
  capacity: number;
  location: number;
  style: number;
  specialRequirements: number;
  total: number;
}

export interface ChatFeedback {
  type: "terlalu_mahal" | "cari_outdoor" | "cari_indoor" | "bukan_area_itu" | "suka";
  label: string;
  emoji: string;
}
