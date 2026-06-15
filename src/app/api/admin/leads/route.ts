// GET /api/admin/leads — List leads for admin panel
// PATCH /api/admin/leads — Update lead status

import { NextRequest } from "next/server";

// In-memory lead store (replaces Firestore when not configured)
const memoryLeads: Array<Record<string, unknown>> = [];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const partnerId = searchParams.get("partner_id");
    const status = searchParams.get("status");

    // Try Firestore first
    try {
      const { isFirebaseConfigured } = await import("@/lib/firebase/config");
      if (isFirebaseConfigured()) {
        return Response.json({
          leads: [],
          message: "Firestore query will be implemented when configured",
        });
      }
    } catch {}

    // Fallback: memory store
    let leads = [...memoryLeads];
    if (status && status !== "all") {
      leads = leads.filter((l) => l.status === status);
    }

    return Response.json({
      leads,
      stats: {
        total: leads.length,
        pending: leads.filter((l) => l.status === "pending").length,
        contacted: leads.filter((l) => l.status === "contacted").length,
        converted: leads.filter((l) => l.status === "converted").length,
        lost: leads.filter((l) => l.status === "lost").length,
      },
    });
  } catch (error) {
    console.error("Admin leads API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { leadId, status } = await req.json();

    const idx = memoryLeads.findIndex((l) => l.id === leadId);
    if (idx >= 0) {
      memoryLeads[idx].status = status;
    }

    return Response.json({ success: true, leadId, status });
  } catch (error) {
    console.error("Admin leads PATCH error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Export memory store for POST /api/leads to push to
export { memoryLeads };
