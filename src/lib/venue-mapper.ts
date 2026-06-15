/** Shared venue mapping — used by chat page & feedback handler */

export function mapVenueFromApi(v: Record<string, unknown>, i: number) {
  return {
    venue: {
      id: (v.venueId as string) || "",
      venueName: (v.venueName as string) || "",
      slug: (v.slug as string) || "",
      location: {
        city: ((v.location as Record<string, string>)?.city) || "",
        area: ((v.location as Record<string, string>)?.area) || (v.location as string) || "",
        address: ((v.location as Record<string, string>)?.address) || "",
      },
      capacity: {
        min: ((v.capacity as Record<string, number>)?.min) || 100,
        max: ((v.capacity as Record<string, number>)?.max) || (v.capacity as number) || 500,
      },
      priceRange: (v.priceRange as { min: number; max: number; currency: string }) || { min: 0, max: 0, currency: "IDR" },
      venueType: ((v.venueType as string) || "Gedung") as any,
      setting: ((v.setting as string) || "Indoor") as any,
      style: (v.style as string[]) || [],
      images: (v.images as string[]) || [],
      packageInfo: { description: "", includes: [], excludes: [] },
      pros: [],
      cons: [],
      specialFeatures: [],
      partnerId: null,
      isActive: true,
    },
    score: (v.score as number) || 0,
    rank: (v.rank as number) || i + 1,
    reason: (v.reason as string) || "",
    vendors: [],
  };
}
