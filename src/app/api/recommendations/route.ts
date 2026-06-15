// POST /api/recommendations — Generate venue recommendations using scoring engine

import { NextRequest } from "next/server";
import { rankVenues, getEffectivePrice } from "@/lib/scoring/scoring-engine";
import type { Venue, ExtractedRequirements, Vendor } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { conversationId, requirements } = await req.json();

    if (!requirements) {
      return Response.json({ error: "Requirements are required" }, { status: 400 });
    }

    // Load venues — from Firestore in production, from enriched JSON in dev
    let venues: Venue[] = [];

    try {
      // Try Firestore first
      const { getVenues } = await import("@/lib/firebase/firestore");
      venues = await getVenues();
    } catch {
      // Fallback: load from local enriched JSON (dev mode)
      try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const dataPath = path.join(process.cwd(), "data", "venues-enriched.json");
        const raw = await fs.readFile(dataPath, "utf-8");
        venues = JSON.parse(raw);
      } catch {
        console.warn("No venue data available — returning empty recommendations");
      }
    }

    // Filter active only
    const activeVenues = venues.filter((v) => v.isActive !== false);

    if (!activeVenues.length) {
      return Response.json({
        venues: [],
        message: "Database venue belum tersedia. Silakan jalankan seed data terlebih dahulu.",
      });
    }

    // Run scoring engine
    const reqs = requirements as ExtractedRequirements;
    const ranked = rankVenues(activeVenues, reqs, 5);

    // Build response with proper field mapping
    const recommendations = ranked.map((r, i) => {
      // Compute priceRange fallback from pricing if missing
      const pr = r.venue.priceRange || {
        min: (r.venue as any).pricing?.pricePerPax
          ? (r.venue as any).pricing.pricePerPax * (r.venue.capacity.min || 100) + ((r.venue as any).pricing.fixedCharge || 0)
          : 30_000_000,
        max: (r.venue as any).pricing?.pricePerPax
          ? (r.venue as any).pricing.pricePerPax * (r.venue.capacity.max || 500) + ((r.venue as any).pricing.fixedCharge || 0)
          : 500_000_000,
        currency: "IDR",
      };

      return {
        venueId: r.venue.id,
        venueName: r.venue.venueName,
        slug: r.venue.slug,
        location: {
          city: r.venue.location.city,
          area: r.venue.location.area,
          address: r.venue.location.address || "",
        },
        capacity: {
          min: r.venue.capacity.min,
          max: r.venue.capacity.max,
        },
        priceRange: {
          min: pr.min,
          max: pr.max,
          currency: pr.currency || "IDR",
        },
        effectivePrice: getEffectivePrice(r.venue, reqs.guestCount?.exact || 300),
        venueType: r.venue.venueType,
        setting: r.venue.setting,
        style: r.venue.style || [],
        includesCatering: r.venue.includesCatering || false,
        images: r.venue.images || [],
        score: r.score,
        rank: i + 1,
        reason: r.reason,
        breakdown: r.breakdown,
      };
    });

    return Response.json({
      recommendationId: `rec-${Date.now()}`,
      venues: recommendations,
      total: ranked.length,
    });
  } catch (error) {
    console.error("Recommendation API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
