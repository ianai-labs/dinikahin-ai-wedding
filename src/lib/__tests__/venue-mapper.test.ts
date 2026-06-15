import { describe, it, expect } from "vitest";
import { mapVenueFromApi } from "@/lib/venue-mapper";

describe("mapVenueFromApi", () => {
  it("maps full API response correctly", () => {
    const apiVenue = {
      venueId: "v1",
      venueName: "Test Venue",
      slug: "test-venue",
      location: { city: "Jakarta Selatan", area: "Kuningan", address: "Jl. Test" },
      capacity: { min: 100, max: 500 },
      priceRange: { min: 50_000_000, max: 150_000_000, currency: "IDR" },
      venueType: "Hotel Ballroom",
      setting: "Indoor",
      style: ["Modern"],
      images: ["/venue-images/test-venue/1.webp"],
      score: 92,
      rank: 1,
      reason: "Sangat cocok",
    };
    const result = mapVenueFromApi(apiVenue, 0);
    expect(result.venue.venueName).toBe("Test Venue");
    expect(result.venue.slug).toBe("test-venue");
    expect(result.venue.location.city).toBe("Jakarta Selatan");
    expect(result.venue.location.area).toBe("Kuningan");
    expect(result.venue.capacity.min).toBe(100);
    expect(result.venue.capacity.max).toBe(500);
    expect(result.venue.priceRange?.min).toBe(50_000_000);
    expect(result.venue.images).toEqual(["/venue-images/test-venue/1.webp"]);
    expect(result.score).toBe(92);
    expect(result.rank).toBe(1);
    expect(result.reason).toBe("Sangat cocok");
  });

  it("handles missing fields gracefully", () => {
    const result = mapVenueFromApi({}, 0);
    expect(result.venue.venueName).toBe("");
    expect(result.venue.slug).toBe("");
    expect(result.venue.location.city).toBe("");
    expect(result.venue.capacity.min).toBe(100);
    expect(result.venue.capacity.max).toBe(500);
    expect(result.venue.priceRange).toEqual({ min: 0, max: 0, currency: "IDR" });
    expect(result.venue.venueType).toBe("Gedung");
    expect(result.venue.images).toEqual([]);
    expect(result.score).toBe(0);
    expect(result.rank).toBe(1);
  });

  it("handles string location (simulation fallback)", () => {
    const result = mapVenueFromApi({ location: "Jakarta Selatan" }, 0);
    expect(result.venue.location.area).toBe("Jakarta Selatan");
    expect(result.venue.location.city).toBe("");
  });

  it("handles single number capacity", () => {
    const result = mapVenueFromApi({ capacity: 300 }, 0);
    expect(result.venue.capacity.max).toBe(300);
    expect(result.venue.capacity.min).toBe(100);
  });

  it("uses fallback rank when not provided", () => {
    const result = mapVenueFromApi({}, 5);
    expect(result.rank).toBe(6); // i + 1
  });
});
