// GET /api/venues/[slug] — Venue detail + supporting vendors

import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

interface VenueData {
  id: string;
  venueName: string;
  slug: string;
  location: { city: string; area: string; address: string };
  capacity: { min: number; max: number };
  pricing: {
    type: "per_pax" | "fixed" | "both";
    pricePerPax: number | null;
    fixedCharge: number | null;
    packages: Record<string, number | null>;
  };
  venueType: string;
  setting: string;
  style: string[];
  includesCatering: boolean;
  images: string[];
  pros: string[];
  cons: string[];
  specialFeatures: string[];
  partnerId: string | null;
  isActive: boolean;
}

function loadVenues(): VenueData[] {
  try {
    const dataPath = path.join(process.cwd(), "data", "venues-enriched.json");
    const raw = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const venues = loadVenues();

  const venue = venues.find((v) => v.slug === slug);
  if (!venue) {
    // Try fuzzy match
    const fuzzy = venues.find(
      (v) =>
        v.venueName.toLowerCase().replace(/[^a-z0-9]/g, "-") === slug ||
        v.slug.includes(slug) ||
        slug.includes(v.slug)
    );
    if (!fuzzy) {
      return Response.json({ error: "Venue not found" }, { status: 404 });
    }
    return Response.json({ venue: fuzzy, vendors: [] });
  }

  // Get vendors for this venue's area
  const vendors = getVendorsForArea(venue.location.area);

  return Response.json({ venue, vendors });
}

function getVendorsForArea(area: string) {
  try {
    const dataPath = path.join(process.cwd(), "data", "vendors-seed.json");
    if (!fs.existsSync(dataPath)) return [];
    const raw = fs.readFileSync(dataPath, "utf-8");
    const vendors = JSON.parse(raw);
    return vendors.filter(
      (v: { location: { area: string } }) =>
        v.location.area === area || v.location.area === "Jabodetabek"
    );
  } catch {
    return [];
  }
}
