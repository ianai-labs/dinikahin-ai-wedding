// GET /api/venues — List venues with filters

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  const capacity = searchParams.get("capacity");
  const budgetMin = searchParams.get("budget_min");
  const budgetMax = searchParams.get("budget_max");
  const type = searchParams.get("type");

  // Placeholder: Fetch from Firestore in production
  return Response.json({
    venues: [],
    filters: { location, capacity, budgetMin, budgetMax, type },
  });
}
