// Master scoring engine for venue recommendations
// Aligned with PRD Section 10 formulas

import type { Venue, ExtractedRequirements, ScoreBreakdown } from "@/types";
import { SCORE_WEIGHTS } from "@/lib/utils/constants";

interface ScoredVenue {
  venue: Venue;
  score: number;
  breakdown: ScoreBreakdown;
  reason: string;
}

/**
 * Calculate the effective total price for a venue given guest count.
 * Package tiers take priority; fallback to per-pax + fixed charge.
 */
export function getEffectivePrice(venue: Venue, guestCount: number): number {
  const pkg = venue.pricing?.packages;
  if (pkg) {
    // Find the best-fitting package
    if (guestCount <= 30 && pkg["30"]) return pkg["30"]!;
    if (guestCount <= 50 && pkg["50"]) return pkg["50"]!;
    if (guestCount <= 50 && pkg["akad_50"]) return pkg["akad_50"]!;
    if (guestCount <= 100 && pkg["akad_100"]) return pkg["akad_100"]!;
    if (guestCount <= 100 && pkg["intimate_100"]) return pkg["intimate_100"]!;
    if (guestCount <= 300 && pkg["semi_royal_300"]) return pkg["semi_royal_300"]!;
    if (guestCount <= 500 && pkg["royal_500"]) return pkg["royal_500"]!;
  }

  // Fallback: per-pax + fixed charge
  let total = 0;
  if (venue.pricing?.pricePerPax) total += venue.pricing.pricePerPax * guestCount;
  if (venue.pricing?.fixedCharge) total += venue.pricing.fixedCharge;
  return total || 0;
}

/**
 * Score a single venue against user requirements.
 */
export function scoreVenue(venue: Venue, req: ExtractedRequirements): ScoredVenue {
  const budget = scoreBudget(venue, req);
  const capacity = scoreCapacity(venue, req);
  const location = scoreLocation(venue, req);
  const style = scoreStyle(venue, req);
  const specialRequirements = scoreSpecialRequirements(venue, req);

  const total = Math.round(
    budget * SCORE_WEIGHTS.budget +
    capacity * SCORE_WEIGHTS.capacity +
    location * SCORE_WEIGHTS.location +
    style * SCORE_WEIGHTS.style +
    specialRequirements * SCORE_WEIGHTS.specialRequirements
  );

  const breakdown: ScoreBreakdown = { budget, capacity, location, style, specialRequirements, total };
  const reason = buildReasons(breakdown, venue, req);

  return { venue, score: total, breakdown, reason };
}

/**
 * Rank all venues and return top N.
 */
export function rankVenues(
  venues: Venue[],
  req: ExtractedRequirements,
  topN: number = 5
): ScoredVenue[] {
  return venues
    .map((v) => scoreVenue(v, req))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

// ── Individual Scorers ──────────────────────────────────────────

/**
 * PRD Formula: 100% if within range; drops 10% per Rp50jt difference.
 */
function scoreBudget(venue: Venue, req: ExtractedRequirements): number {
  if (!req.budget) return 50;
  const guestCount = req.guestCount?.exact || 300;
  const venuePrice = getEffectivePrice(venue, guestCount);

  if (venuePrice <= 0) return 30; // No valid price data

  const userMin = req.budget.min;
  const userMax = req.budget.max;

  // Perfect match: within budget range
  if (venuePrice >= userMin && venuePrice <= userMax) return 100;

  // Calculate distance from range
  const diff = venuePrice < userMin
    ? userMin - venuePrice
    : venuePrice - userMax;

  // PRD: turun 10% per Rp50jt selisih, minimum 10%
  const penalty = Math.floor(diff / 50_000_000) * 10;
  return Math.max(100 - penalty, 10);
}

/**
 * PRD: 100% if capacity >= guest_count + 10% buffer; drops if less or >2x.
 */
function scoreCapacity(venue: Venue, req: ExtractedRequirements): number {
  if (!req.guestCount) return 50;

  const guestCount = req.guestCount.exact;
  const venueMax = venue.capacity.max;

  // Venue too small
  if (venueMax < guestCount) {
    const diff = ((guestCount - venueMax) / guestCount) * 100;
    return diff <= 10 ? 50 : 10;
  }

  // Perfect: fits with 10-50% buffer
  if (venueMax >= guestCount * 1.1 && venueMax <= guestCount * 1.5) return 100;

  // Tight fit (<10% buffer)
  if (venueMax >= guestCount && venueMax < guestCount * 1.1) return 80;

  // Larger than ideal (50-100% larger)
  if (venueMax > guestCount * 1.5 && venueMax <= guestCount * 2) return 85;

  // Much larger (>2x)
  if (venueMax > guestCount * 2) return 60;

  return 50;
}

/**
 * PRD: 100% same area; 70% same city; 30% Jabodetabek; 0% outside.
 */
function scoreLocation(venue: Venue, req: ExtractedRequirements): number {
  if (!req.location) return 50;

  const venueArea = venue.location.area.toLowerCase();
  const venueCity = venue.location.city.toLowerCase();
  const userArea = req.location.area.toLowerCase();
  const userCity = req.location.city.toLowerCase();

  // Exact area match
  if (venueArea.includes(userArea) || userArea.includes(venueArea)) return 100;

  // Same city
  if (venueCity === userCity) return 70;

  // Jabodetabek proximity
  const jabodetabek = ["jakarta", "bogor", "depok", "tangerang", "bekasi"];
  if (
    jabodetabek.some((c) => venueCity.includes(c)) &&
    jabodetabek.some((c) => userCity.includes(c))
  ) {
    return 30;
  }

  return 0;
}

/**
 * PRD: 100% cocok; 50% mirip; 0% berbeda.
 */
function scoreStyle(venue: Venue, req: ExtractedRequirements): number {
  if (!req.style && !req.venueType && !req.venueSetting) return 50;

  let matchCount = 0;
  let checkCount = 0;

  if (req.venueType) {
    checkCount++;
    const vt = venue.venueType.toLowerCase();
    const rt = req.venueType.toLowerCase();
    if (vt.includes(rt) || rt.includes(vt)) matchCount++;
  }

  if (req.style) {
    checkCount++;
    if (venue.style.some((s) => req.style!.toLowerCase().includes(s.toLowerCase()))) {
      matchCount++;
    }
  }

  if (req.venueSetting) {
    checkCount++;
    if (venue.setting === req.venueSetting) matchCount++;
  }

  if (checkCount === 0) return 50;
  const ratio = matchCount / checkCount;

  // 100% match, 50% partial, 0% different
  if (ratio >= 0.8) return 100;
  if (ratio >= 0.4) return 50;
  return 0;
}

/**
 * PRD: 1% per item yang terpenuhi (dikalikan bobot 5% di total).
 * Ej: 3 dari 5 item = 60, lalu di total: 60 * 0.05 = 3 poin kontribusi.
 */
function scoreSpecialRequirements(venue: Venue, req: ExtractedRequirements): number {
  if (!req.specialRequirements.length) return 50;

  const searchSpace = [
    venue.packageInfo?.description || "",
    ...(venue.packageInfo?.includes || []),
    ...(venue.specialFeatures || []),
    ...(venue.pros || []),
  ].join(" ").toLowerCase();

  const met = req.specialRequirements.filter((r) =>
    searchSpace.includes(r.toLowerCase())
  ).length;

  if (req.specialRequirements.length === 0) return 50;
  // Return percentage of met requirements (1% per item → each item = 1/len * 100)
  // But PRD says 1% per item → 5 items met = 5%. This scales 0-100% based on met/total
  return Math.round((met / req.specialRequirements.length) * 100);
}

function buildReasons(
  breakdown: ScoreBreakdown,
  venue: Venue,
  req: ExtractedRequirements
): string {
  const parts: string[] = [];

  if (breakdown.budget >= 90) parts.push("💰 Budget sangat cocok.");
  else if (breakdown.budget >= 70) parts.push("💰 Budget cukup sesuai.");
  else if (breakdown.budget < 50) parts.push("💰 Budget kurang cocok.");

  if (breakdown.capacity >= 90) parts.push("👥 Kapasitas ideal.");
  else if (breakdown.capacity >= 70) parts.push("👥 Kapasitas memadai.");
  else if (breakdown.capacity < 50) parts.push("👥 Kapasitas kurang sesuai.");

  if (breakdown.location >= 90) parts.push("📍 Lokasi sangat strategis.");
  else if (breakdown.location >= 70) parts.push("📍 Masih dalam kota yang sama.");
  else if (breakdown.location < 30) parts.push("📍 Lokasi di luar area preferensi.");

  if (breakdown.style >= 80) parts.push("✨ Gaya & tipe venue cocok.");
  if (breakdown.specialRequirements >= 80) parts.push("✅ Kebutuhan khusus terpenuhi.");

  return parts.join(" ") || "Skor berdasarkan kecocokan data.";
}
