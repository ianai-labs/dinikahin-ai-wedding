import { describe, it, expect } from "vitest";
import { rankVenues, scoreVenue, getEffectivePrice } from "@/lib/scoring/scoring-engine";
import type { Venue, ExtractedRequirements } from "@/types";

const makeVenue = (overrides: Partial<Venue> = {}): Venue => ({
  id: "test-1",
  venueName: "Test Venue",
  slug: "test-venue",
  location: { city: "Jakarta Selatan", area: "Kuningan", address: "Jl. Test 123" },
  capacity: { min: 100, max: 500 },
  priceRange: { min: 50_000_000, max: 150_000_000, currency: "IDR" },
  venueType: "Hotel Ballroom",
  setting: "Indoor",
  style: ["Modern", "Elegant"],
  includesCatering: true,
  images: [],
  pros: ["AC", "Parking"],
  cons: [],
  specialFeatures: ["Garden view"],
  partnerId: null,
  isActive: true,
  pricing: { type: "per_pax", pricePerPax: 300_000, fixedCharge: 10_000_000, packages: {} },
  ...overrides,
});

const makeReq = (overrides: Partial<ExtractedRequirements> = {}): ExtractedRequirements => ({
  budget: { min: 100_000_000, max: 200_000_000, currency: "IDR" },
  location: { city: "Jakarta Selatan", area: "Kuningan", specificAreas: ["Kuningan"] },
  guestCount: { exact: 300, rangeMin: 270, rangeMax: 330 },
  venueType: "Hotel Ballroom",
  venueSetting: "Indoor",
  style: "Modern",
  culturalPreference: null,
  preferredDate: null,
  specialRequirements: ["Garden view"],
  completenessScore: 80,
  missingFields: [],
  ...overrides,
});

describe("scoreVenue", () => {
  it("returns max score for perfect match", () => {
    const venue = makeVenue();
    const req = makeReq();
    const result = scoreVenue(venue, req);
    expect(result.score).toBeGreaterThanOrEqual(90);
  });

  it("penalizes large budget mismatch", () => {
    // Venue effective price = 300 * 1_500_000 + 50_000_000 = 500_000_000 (500jt)
    const venue = makeVenue({ pricing: { type: "per_pax", pricePerPax: 1_500_000, fixedCharge: 50_000_000, packages: {} } });
    const req = makeReq({ budget: { min: 50_000_000, max: 100_000_000, currency: "IDR" } });
    const result = scoreVenue(venue, req);
    expect(result.breakdown.budget).toBeLessThan(80);
  });

  it("handles missing guest count gracefully", () => {
    const venue = makeVenue();
    const req = makeReq({ guestCount: null as any });
    const result = scoreVenue(venue, req);
    expect(result.score).toBeGreaterThan(0);
    expect(result.breakdown.capacity).toBe(50); // neutral
  });

  it("handles missing budget gracefully", () => {
    const venue = makeVenue();
    const req = makeReq({ budget: null as any });
    const result = scoreVenue(venue, req);
    expect(result.score).toBeGreaterThan(0);
  });

  it("penalizes location mismatch (different city far away)", () => {
    const venue = makeVenue({ location: { city: "Bandung", area: "Bandung", address: "" } });
    const req = makeReq({ location: { city: "Jakarta Selatan", area: "Kuningan", specificAreas: [] } });
    const result = scoreVenue(venue, req);
    expect(result.breakdown.location).toBe(0); // Bandung not Jabodetabek
  });

  it("gives partial score for same-city different-area", () => {
    const venue = makeVenue({ location: { city: "Jakarta Selatan", area: "Tebet", address: "" } });
    const req = makeReq();
    const result = scoreVenue(venue, req);
    expect(result.breakdown.location).toBe(70);
  });
});

describe("rankVenues", () => {
  it("returns top N venues sorted by score", () => {
    const venues = [
      makeVenue({ id: "v1", venueName: "Best", priceRange: { min: 80_000_000, max: 180_000_000, currency: "IDR" } }),
      makeVenue({ id: "v2", venueName: "Mid", priceRange: { min: 120_000_000, max: 250_000_000, currency: "IDR" } }),
      makeVenue({ id: "v3", venueName: "Worst", priceRange: { min: 400_000_000, max: 700_000_000, currency: "IDR" } }),
    ];
    const req = makeReq();
    const ranked = rankVenues(venues, req, 2);
    expect(ranked).toHaveLength(2);
    expect(ranked[0].venue.venueName).toBe("Best");
    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
  });

  it("handles empty venue list", () => {
    const ranked = rankVenues([], makeReq(), 5);
    expect(ranked).toHaveLength(0);
  });
});

describe("getEffectivePrice", () => {
  it("calculates from perPax + fixedCharge", () => {
    const venue = makeVenue();
    const price = getEffectivePrice(venue, 300);
    expect(price).toBe(300 * 300_000 + 10_000_000); // 100_000_000
  });

  it("falls back to 0 when no pricing data", () => {
    const venue = makeVenue({ pricing: { type: "per_pax", pricePerPax: null, fixedCharge: null, packages: {} } });
    const price = getEffectivePrice(venue, 300);
    expect(price).toBe(0);
  });
});
