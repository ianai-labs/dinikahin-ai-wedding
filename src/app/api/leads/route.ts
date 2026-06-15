// POST /api/leads — Submit lead to Firestore

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, conversationId, recommendationId, summary, venueInterest } =
      await req.json();

    if (!name || !phone) {
      return Response.json({ error: "Name and phone are required" }, { status: 400 });
    }

    // Try saving to Firestore
    let leadId = `lead-${Date.now()}`;
    try {
      const { createLead } = await import("@/lib/firebase/firestore");
      const { isFirebaseConfigured } = await import("@/lib/firebase/config");
      if (isFirebaseConfigured()) {
        leadId = await createLead({
          userId: "guest",
          recommendationId: recommendationId || "",
          contactInfo: { name, phone, email },
          summary: summary || "",
        });
      }
    } catch {
      // Offline mode — return generated ID
    }

    // Build WhatsApp template with actual data
    const waMessage = encodeURIComponent(
      `Halo, saya ${name} dari dinikahin.com.\n` +
        `Saya sedang mencari venue untuk pernikahan.\n` +
        (venueInterest ? `Tertarik dengan: ${venueInterest}\n` : "") +
        `Bisa dibantu info selengkapnya?`
    );

    const waNumber = process.env.WHATSAPP_PARTNER_NUMBER || "6281210611833";

    return Response.json({
      leadId,
      status: "pending",
      whatsappUrl: `https://wa.me/${waNumber}?text=${waMessage}`,
    });
  } catch (error) {
    console.error("Lead API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
