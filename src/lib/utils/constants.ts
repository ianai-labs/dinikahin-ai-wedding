// App-wide constants for dinikahin.com

export const APP_NAME = "dinikahin.com";
export const APP_TAGLINE = "Wujudkan pernikahan impian dengan bantuan AI";
export const APP_DESCRIPTION =
  "Konsultasi pernikahan berbasis AI untuk calon pengantin di Indonesia. Chat dengan Dini, AI Wedding Consultant kami, dan dapatkan rekomendasi terpersonalisasi — dari venue hingga persiapan pernikahan impianmu.";

export const AI_NAME = "Dini";
export const AI_GREETING = "Halo! Aku Dini, AI Wedding Consultant yang siap bantu wujudkan pernikahan impianmu. Sebelum mulai, boleh kenalan dulu? Kamu bisa cerita sedikit tentang rencana pernikahanmu 🎉💍";

export const MANDATORY_FIELDS = ["budget", "location", "guest_count"] as const;
export const TOTAL_FIELDS = 9;
export const MAX_FOLLOW_UPS = 2;
export const MAX_FEEDBACK_ITERATIONS = 3;

export const SCORE_WEIGHTS = {
  budget: 0.35,
  capacity: 0.30,
  location: 0.20,
  style: 0.10,
  specialRequirements: 0.05,
} as const;

export const VENUE_TYPES = [
  "Hotel Ballroom",
  "Gedung",
  "Outdoor",
  "Tenda",
  "Aula",
  "Restaurant",
] as const;

export const VENUE_SETTINGS = ["Indoor", "Outdoor", "Semi-Outdoor"] as const;

export const VENDOR_CATEGORIES = [
  "Decoration",
  "Makeup Artist",
  "Entertainment",
  "Photography",
  "Catering",
] as const;

export const LEAD_STATUSES = ["pending", "contacted", "converted", "lost"] as const;

export const FEEDBACK_OPTIONS = [
  { type: "terlalu_mahal" as const, label: "Terlalu mahal", emoji: "💰" },
  { type: "cari_outdoor" as const, label: "Cari yang outdoor", emoji: "🌿" },
  { type: "cari_indoor" as const, label: "Cari yang indoor", emoji: "🏢" },
  { type: "bukan_area_itu" as const, label: "Bukan di area itu", emoji: "📍" },
  { type: "suka" as const, label: "Saya suka!", emoji: "❤️" },
] as const;

export const WHATSAPP_TEMPLATE = (name: string, venueName: string, guests: number, area: string, budget: string) =>
  `Halo, saya ${name} dari dinikahin.com. Saya sedang mencari venue untuk ${guests} tamu di ${area}, budget ${budget}. Saya tertarik dengan ${venueName}. Bisa dibantu info selengkapnya?`;

export const RATE_LIMITS = {
  public: 20, // requests per minute per IP
  chat: 30,   // requests per minute per user
} as const;

export const SCORE_THRESHOLDS = {
  high: 80,
  mid: 50,
} as const;
