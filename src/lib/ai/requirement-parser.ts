// Parse and validate extracted requirements from AI output

import type { ExtractedRequirements } from "@/types";

/**
 * Parse raw JSON from AI extraction into typed ExtractedRequirements.
 */
export function parseRequirements(raw: string | object): ExtractedRequirements | null {
  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!data || typeof data !== "object") return null;

    return {
      budget: data.budget?.min !== null && data.budget?.min !== undefined && data.budget.min > 0
        ? {
            min: Number(data.budget.min),
            max: Number(data.budget.max || data.budget.min),
            currency: data.budget.currency || "IDR",
          }
        : null,
      location: data.location?.city
        ? {
            city: String(data.location.city),
            area: String(data.location.area || data.location.city),
            specificAreas: Array.isArray(data.location.specific_areas) ? data.location.specific_areas : [],
          }
        : null,
      guestCount: data.guest_count?.exact !== null && data.guest_count?.exact !== undefined && data.guest_count.exact > 0
        ? {
            exact: Number(data.guest_count.exact),
            rangeMin: Number(data.guest_count.range_min || data.guest_count.exact * 0.9),
            rangeMax: Number(data.guest_count.range_max || data.guest_count.exact * 1.1),
          }
        : null,
      venueType: data.venue_type || null,
      venueSetting: ["Indoor", "Outdoor", "Semi-Outdoor"].includes(data.venue_setting)
        ? data.venue_setting
        : null,
      style: data.style || null,
      culturalPreference: data.cultural_preference || null,
      preferredDate: data.preferred_date?.month
        ? {
            month: Number(data.preferred_date.month),
            year: Number(data.preferred_date.year || new Date().getFullYear()),
            flexibility: data.preferred_date.flexibility || "±2 bulan",
          }
        : null,
      specialRequirements: Array.isArray(data.special_requirements) ? data.special_requirements : [],
      completenessScore: Number(data.completeness_score) || 0,
      missingFields: Array.isArray(data.missing_fields) ? data.missing_fields : [],
    };
  } catch {
    return null;
  }
}

/**
 * Calculate completeness score based on PRD weights.
 * Mandatory fields: budget 25% + location 25% + guest_count 25% = 75%
 * Optional fields: 6 fields sharing 25% = ~4.17% each
 */
export function calculateCompleteness(req: ExtractedRequirements): number {
  let score = 0;

  // Mandatory: 25% each = 75% total
  if (req.budget) score += 25;
  if (req.location) score += 25;
  if (req.guestCount) score += 25;

  // Optional: ~4.17% each = 25% total (capped)
  const optionalWeight = 25 / 6;
  if (req.venueType) score += optionalWeight;
  if (req.venueSetting) score += optionalWeight;
  if (req.style) score += optionalWeight;
  if (req.preferredDate) score += optionalWeight;
  if (req.culturalPreference) score += optionalWeight;
  if (req.specialRequirements.length > 0) score += optionalWeight;

  return Math.round(Math.min(score, 100));
}

/**
 * Try to extract budget information from user text using regex.
 */
export function extractBudgetFromText(text: string): { min: number; max: number } | null {
  // "Rp 200-300 juta", "200jt-300jt", "200-300 juta", "200-300 jt"
  const rangeMatch = text.match(
    /(?:Rp\s*)?(\d+)\s*-\s*(?:Rp\s*)?(\d+)\s*(?:jt|juta|M)(?:an)?/i
  );
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1]);
    const max = parseInt(rangeMatch[2]);
    const multiplier = text.match(/M\b|milyar|miliar/i) ? 1_000_000_000 : 1_000_000;
    return { min: min * multiplier, max: max * multiplier };
  }

  // "300 juta", "300jt", "Rp 300 juta"
  const singleMatch = text.match(/(?:Rp\s*)?(\d+)\s*(?:jt|juta|M)(?:an)?/i);
  if (singleMatch) {
    const val = parseInt(singleMatch[1]);
    const multiplier = text.match(/M\b|milyar|miliar/i) ? 1_000_000_000 : 1_000_000;
    const mid = val * multiplier;
    return { min: Math.round(mid * 0.9), max: Math.round(mid * 1.1) };
  }

  // Numeric only: "200000000", "200000000-300000000"
  const numRange = text.match(/(\d{7,})\s*-\s*(\d{7,})/);
  if (numRange) {
    return { min: parseInt(numRange[1]), max: parseInt(numRange[2]) };
  }

  return null;
}

/**
 * Extract location from user text.
 */
export function extractLocationFromText(text: string): {
  primary: string | null;
  all: string[];
} {
  const areas = [
    "Jakarta Selatan", "Jakarta Pusat", "Jakarta Barat", "Jakarta Timur",
    "Jakarta Utara", "Jaksel", "Jakpus", "Jakbar", "Jaktim", "Jakut",
    "Bogor", "Depok", "Tangerang", "Bekasi", "BSD", "Bintaro",
    "Kuningan", "Senayan", "Pondok Indah", "Kemang", "Cilandak",
    "Kelapa Gading", "Sunter", "PIK", "Ancol", "Cibubur", "Cibinong",
    "Ciputat", "Serpong", "Alam Sutera", "Karawaci",
  ];
  const t = text.toLowerCase();

  // Find all matches with their positions in the text
  const matches = areas
    .filter((a) => t.includes(a.toLowerCase()))
    .map((a) => ({ area: a, pos: t.indexOf(a.toLowerCase()) }))
    .sort((a, b) => a.pos - b.pos);

  if (matches.length === 0) return { primary: null, all: [] };
  if (matches.length === 1) return { primary: matches[0].area, all: [matches[0].area] };

  // Preference signals: "tapi", "mending", "kasih opsi...aja deh", "pinginnya", "prefer", "ganti ke"
  const prefSignals = /(?:tapi|mending|kasih\s*opsi|aja\s*deh|pinginnya|prefer|pilih|ganti\s*(?:ke)?)\s*(?:di\s+)?(\w+(?:\s+\w+)*)/gi;
  let prefMatch;
  while ((prefMatch = prefSignals.exec(text)) !== null) {
    const afterPref = text.slice(prefMatch.index + prefMatch[0].length).toLowerCase();
    // Check if any known area appears after the preference signal
    for (const area of areas) {
      if (afterPref.includes(area.toLowerCase()) || prefMatch[0].toLowerCase().includes(area.toLowerCase())) {
        return { primary: area, all: matches.map((m) => m.area) };
      }
    }
  }

  // No preference signal → use LAST mentioned (recency)
  const last = matches[matches.length - 1].area;
  return { primary: last, all: matches.map((m) => m.area) };
}

/**
 * Extract guest count from user text.
 */
export function extractGuestCountFromText(text: string): number | null {
  // "500 orang", "500 pax", "500 tamu", "sekitar 500"
  const match = text.match(/(\d+)\s*(?:orang|pax|tamu|undangan)/i);
  if (match) return parseInt(match[1]);

  const sekitar = text.match(/(?:sekitar|kira-kira|kurang lebih)\s*(\d+)/i);
  if (sekitar) return parseInt(sekitar[1]);

  return null;
}

/**
 * Detect if the user is retracting/cancelling a previously provided field.
 * Only returns a field if it's currently filled (prevents false positives).
 */
export function detectRetraction(
  text: string,
  currentReq?: Partial<{ budget: unknown; location: unknown; guestCount: unknown }> | null
): string | null {
  const t = text.toLowerCase();

  // Budget-specific retraction — requires word boundaries
  const budgetPatterns = [
    /\b(?:jangan|ga\s*usah)\b.*\b(?:dimasukin|dimasukkan|dicatat)\b.*\b(?:budget|harga|biayanya|biaya)\b/i,
    /\bga\s*jadi\b.*\b(?:budget|harga|biaya)\b/i,
    /\bskip\b.*\b(?:budget|harga)\b/i,
    /\blewat(?:in|kan)?\b.*\b(?:budget|harga)\b/i,
    /\b(?:masih|lagi)\s+(?:mikir|pikir|bingung)\b.*\b(?:budget|harga|dulu)\b/i,
    /\b(?:lupakan|hapus|hilangkan|abaikan)\b.*\b(?:budget|harga)\b/i,
    /\bgak\s+(?:jadi|usah|perlu)\b.*\b(?:masukin|catat)\b.*\b(?:budget|harga)\b/i,
  ];
  for (const p of budgetPatterns) {
    if (p.test(t)) {
      // Only return "budget" if budget is currently filled
      if (currentReq?.budget) return "budget";
      return null;
    }
  }

  // Location retraction — only if location is filled
  if (/\b(?:jangan|skip|lewat|ga\s*jadi)\b.*\b(?:lokasi|area|tempat)\b/i.test(t)) {
    if (currentReq?.location) return "location";
    return null;
  }

  // Guest count retraction — only if guest count is filled
  if (/\b(?:jangan|skip|lewat|ga\s*jadi)\b.*\b(?:tamu|orang|pax|undangan)\b/i.test(t)) {
    if (currentReq?.guestCount) return "guest_count";
    return null;
  }

  // Generic: "skip aja", "lewat dulu kak", "ga jadi deh" — only if ANY field is filled
  if (/\b(?:skip|lewat|ga\s*jadi|jangan\s*(?:dicatat|dimasukin))\b.*\b(?:dulu|aja|ya|deh|kak)\b/i.test(t)) {
    if (currentReq?.budget || currentReq?.location || currentReq?.guestCount) return "last_field";
    return null;
  }

  return null;
}
