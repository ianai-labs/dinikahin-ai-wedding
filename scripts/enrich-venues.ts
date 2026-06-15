/**
 * Read venue_database.csv, clean data errors, infer venue types/settings/styles,
 * and output enriched JSON ready for Firestore upload.
 *
 * Usage: npx tsx scripts/enrich-venues.ts
 */

import * as fs from "fs";
import * as path from "path";

// --- Types ---

interface RawVenue {
  area: string;
  nama_venue: string;
  price_per_pax: string;
  charge: string;
  paket_30: string;
  paket_50: string;
  paket_akad_50: string;
  paket_akad_100: string;
  paket_intimate_100: string;
  paket_semi_royal_300: string;
  paket_royal_500: string;
}

interface EnrichedVenue {
  id: string;
  venueName: string;
  slug: string;
  location: {
    city: string;
    area: string;
    address: string;
  };
  capacity: { min: number; max: number };
  pricing: {
    type: "per_pax" | "fixed" | "both";
    pricePerPax: number | null;
    fixedCharge: number | null;
    packages: Record<string, number | null>;
  };
  venueType: "Hotel Ballroom" | "Gedung" | "Outdoor" | "Restaurant" | "Aula" | "Tenda";
  setting: "Indoor" | "Outdoor" | "Semi-Outdoor";
  style: string[];
  includesCatering: boolean;
  priceRange: { min: number; max: number; currency: string };
  images: string[];
  pros: string[];
  cons: string[];
  specialFeatures: string[];
  partnerId: string | null;
  isActive: boolean;
}

// --- Helper Functions ---

function parseNumber(val: string): number | null {
  const cleaned = val.replace(/[^0-9.]/g, "").trim();
  const n = parseFloat(cleaned);
  if (isNaN(n) || n <= 0) return null;
  return Math.round(n);
}

function parseBool(val: string): boolean {
  return val.toLowerCase() === "true" || val === "1";
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function inferVenueType(name: string): { type: EnrichedVenue["venueType"]; setting: EnrichedVenue["setting"] } {
  const n = name.toLowerCase();

  // Masjid excluded
  if (n.includes("masjid")) {
    return { type: "Gedung", setting: "Indoor" };
  }

  // Hotels
  const hotelKeywords = [
    "hotel", "resort", "pullman", "santika", "ibis", "fave", "horison",
    "sotis", "sofyan", "amaris", "neo", "kimaya", "grand", "azana",
    "cordela", "maple", "amaroossa", "whiz", "dafam", "savero",
  ];
  if (hotelKeywords.some((kw) => n.includes(kw))) {
    return { type: "Hotel Ballroom", setting: "Indoor" };
  }

  // Restaurants/Cafes
  const restoKeywords = [
    "kampung kecil", "resto", "cafe", "coffee", "dining",
    "new batavia", "la paris", "araneo", "dstinasi",
  ];
  if (restoKeywords.some((kw) => n.includes(kw))) {
    return { type: "Restaurant", setting: "Semi-Outdoor" };
  }

  // GOR / Sports
  if (n.includes("gor ") || n.includes("sport center")) {
    return { type: "Aula", setting: "Indoor" };
  }

  // Ballrooms
  if (n.includes("ballroom")) {
    return { type: "Hotel Ballroom", setting: "Indoor" };
  }

  // Buildings/Halls
  const gedungKeywords = [
    "gedung", "auditorium", "pendopo", "function hall",
    "sienna", "balairung", "aula",
  ];
  if (gedungKeywords.some((kw) => n.includes(kw))) {
    return { type: "Gedung", setting: "Indoor" };
  }

  // Outdoor
  const outdoorKeywords = [
    "villa", "leuweung", "ecolodge", "taman", "garden",
    "hutan", "mangrove", "alam", "condet park", "lembah",
    "marina", "ancol", "pik", "love garden", "safari",
    "dinoasih",
  ];
  if (outdoorKeywords.some((kw) => n.includes(kw))) {
    return { type: "Outdoor", setting: "Outdoor" };
  }

  // Default: Gedung Indoor
  return { type: "Gedung", setting: "Indoor" };
}

function inferStyle(name: string, type: string): string[] {
  const styles: string[] = [];
  const n = name.toLowerCase();

  if (type === "Hotel Ballroom") {
    styles.push("Modern");
    if (n.includes("grand") || n.includes("pullman") || n.includes("santika")) styles.push("Elegant");
  } else if (type === "Outdoor") {
    styles.push("Natural");
    styles.push("Garden");
  } else if (type === "Restaurant") {
    styles.push("Modern");
    if (n.includes("kampung kecil")) styles.push("Traditional");
  } else {
    styles.push("Modern");
  }

  return styles;
}

function getCapacity(pricing: EnrichedVenue["pricing"]): { min: number; max: number } {
  const pkgSizes: Record<string, number> = {
    "30": 30,
    "50": 50,
    "akad_50": 50,
    "akad_100": 100,
    "intimate_100": 100,
    "semi_royal_300": 300,
    "royal_500": 500,
  };

  let min = 500;
  let max = 30;

  for (const [key, guests] of Object.entries(pkgSizes)) {
    if (pricing.packages[key] !== null) {
      min = Math.min(min, guests);
      max = Math.max(max, guests);
    }
  }

  // If no packages, estimate from pricing type
  if (min === 500 && max === 30) {
    return pricing.type === "per_pax" ? { min: 100, max: 1000 } : { min: 50, max: 500 };
  }

  return { min, max };
}

// --- Main Processing ---

function processVenues(): EnrichedVenue[] {
  const csvPath = path.join(__dirname, "..", "doc", "venue_database.csv");
  const raw = fs.readFileSync(csvPath, "utf-8");

  // Handle BOM
  const content = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;

  const lines = content.split("\n").filter((l) => l.trim());
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const dataLines = lines.slice(1);

  const venues: EnrichedVenue[] = [];
  const seenNames = new Set<string>();

  for (const line of dataLines) {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < headers.length) continue;

    const rawVenue: RawVenue = headers.reduce((obj, h, i) => {
      obj[h as keyof RawVenue] = cols[i] || "";
      return obj;
    }, {} as RawVenue);

    const name = rawVenue.nama_venue;
    if (!name) continue;

    // Skip duplicate Kimaya Slipi (keep Jakarta Selatan)
    if (name === "Kimaya Slipi" && rawVenue.area === "Jakarta Barat") continue;

    // Skip duplicate venue names
    const key = `${name}|${rawVenue.area}`;
    if (seenNames.has(key)) continue;
    seenNames.add(key);

    const pricePerPax = parseNumber(rawVenue.price_per_pax);
    const fixedCharge = parseNumber(rawVenue.charge);

    // Determine pricing type
    let pricingType: "per_pax" | "fixed" | "both" = "fixed";
    if (pricePerPax && fixedCharge) pricingType = "both";
    else if (pricePerPax) pricingType = "per_pax";
    else pricingType = "fixed";

    const packages: Record<string, number | null> = {
      "30": parseNumber(rawVenue.paket_30),
      "50": parseNumber(rawVenue.paket_50),
      "akad_50": parseNumber(rawVenue.paket_akad_50),
      "akad_100": parseNumber(rawVenue.paket_akad_100),
      "intimate_100": parseNumber(rawVenue.paket_intimate_100),
      "semi_royal_300": parseNumber(rawVenue.paket_semi_royal_300),
      "royal_500": parseNumber(rawVenue.paket_royal_500),
    };

    // Filter out absurd prices (> 1 milyar for packages)
    for (const [k, v] of Object.entries(packages)) {
      if (v && v > 1_000_000_000) packages[k] = null;
    }

    // Fix price_per_pax = 100 → mark as charge-only
    const adjustedPricePerPax = pricePerPax && pricePerPax < 1000 ? null : pricePerPax;
    if (pricePerPax && pricePerPax < 1000) {
      pricingType = pricingType === "both" ? "fixed" : pricingType;
    }

    const pricing = {
      type: pricingType,
      pricePerPax: adjustedPricePerPax,
      fixedCharge,
      packages,
    };

    const { type, setting } = inferVenueType(name);
    const isCateringIncluded = type === "Hotel Ballroom";
    const capacity = getCapacity(pricing);

    // Compute priceRange from pricing data
    const priceMin = pricing.pricePerPax
      ? pricing.pricePerPax * capacity.min + (pricing.fixedCharge || 0)
      : 0;
    const priceMax = pricing.pricePerPax
      ? pricing.pricePerPax * capacity.max + (pricing.fixedCharge || 0)
      : 0;
    const priceRange = {
      min: priceMin || 30_000_000,
      max: priceMax || 500_000_000,
      currency: "IDR" as const,
    };

    const venue: EnrichedVenue = {
      id: generateSlug(name) + "-" + rawVenue.area.toLowerCase().replace(/\s+/g, "-"),
      venueName: name,
      slug: generateSlug(name),
      location: {
        city: rawVenue.area,
        area: rawVenue.area,
        address: "",
      },
      capacity,
      pricing,
      priceRange,
      venueType: type,
      setting,
      style: inferStyle(name, type),
      includesCatering: isCateringIncluded,
      images: [],
      pros: [],
      cons: [],
      specialFeatures: [],
      partnerId: null,
      isActive: type !== "Gedung" || !name.toLowerCase().includes("masjid"),
    };

    venues.push(venue);
  }

  return venues;
}

// --- Run ---
const venues = processVenues();

// Output stats
const typeCounts = venues.reduce((acc, v) => {
  acc[v.venueType] = (acc[v.venueType] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const areaCounts = venues.reduce((acc, v) => {
  acc[v.location.area] = (acc[v.location.area] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log(`\nTotal venues processed: ${venues.length}`);
console.log(`\nBy type:`, typeCounts);
console.log(`\nBy area:`, areaCounts);
console.log(`\nActive: ${venues.filter((v) => v.isActive).length}`);
console.log(`Inactive (masjid): ${venues.filter((v) => !v.isActive).length}`);

// Write output
const outDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, "venues-enriched.json"),
  JSON.stringify(venues, null, 2),
  "utf-8"
);

console.log(`\nEnriched data written to data/venues-enriched.json`);
