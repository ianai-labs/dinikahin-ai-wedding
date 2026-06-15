// POST /api/chat — DeepSeek streaming chat + auto venue recommendations
import { NextRequest } from "next/server";
import { streamDeepSeekChat, deepSeekComplete } from "@/lib/ai/deepseek-client";
import { getSystemPrompt, EXTRACTION_PROMPT } from "@/lib/ai/prompts";
import { parseRequirements, calculateCompleteness } from "@/lib/ai/requirement-parser";
import { rankVenues } from "@/lib/scoring/scoring-engine";
import type { Venue, ExtractedRequirements } from "@/types";

// ── Helpers ─────────────────────────────────────────────────
let _venueNames: string[] = [];
let _venueMap: Map<string, Venue> = new Map();

async function loadVenueData(): Promise<{ names: string[]; map: Map<string, Venue> }> {
  if (_venueNames.length > 0) return { names: _venueNames, map: _venueMap };
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const dataPath = path.join(process.cwd(), "data", "venues-enriched.json");
    const raw = await fs.readFile(dataPath, "utf-8");
    const venues: Venue[] = JSON.parse(raw);
    const active = venues.filter((v) => v.isActive !== false);
    _venueNames = active.map((v) => v.venueName);
    _venueMap = new Map(active.map((v) => [v.venueName.toLowerCase(), v]));
  } catch {}
  return { names: _venueNames, map: _venueMap };
}

/** Extract venue names mentioned in AI response text */
function extractVenueNames(text: string, venueNames: string[]): string[] {
  const found = new Set<string>();
  const lower = text.toLowerCase();
  for (const name of venueNames) {
    if (lower.includes(name.toLowerCase())) {
      found.add(name);
    }
  }
  return Array.from(found);
}

/** Parse 3 venue recommendations from AI text → match database → score */
async function getRecommendationsFromText(
  aiResponse: string,
  extraction: ExtractedRequirements | null
) {
  const { names, map } = await loadVenueData();
  const mentioned = extractVenueNames(aiResponse, names);
  if (mentioned.length === 0) return [];

  // Get full venue objects for mentioned names (max 5)
  const matchedVenues: Venue[] = [];
  for (const name of mentioned.slice(0, 5)) {
    const venue = map.get(name.toLowerCase());
    if (venue) matchedVenues.push(venue);
  }
  if (matchedVenues.length === 0) return [];

  // Run scoring engine if we have requirements
  const reqs = extraction || ({} as ExtractedRequirements);
  const ranked = rankVenues(matchedVenues, reqs, Math.min(3, matchedVenues.length));

  return ranked.map((r, i) => ({
    venueId: r.venue.id,
    venueName: r.venue.venueName,
    slug: r.venue.slug,
    location: {
      city: r.venue.location.city,
      area: r.venue.location.area,
      address: r.venue.location.address || "",
    },
    capacity: { min: r.venue.capacity.min, max: r.venue.capacity.max },
    priceRange: r.venue.priceRange || { min: 0, max: 0, currency: "IDR" },
    venueType: r.venue.venueType,
    setting: r.venue.setting,
    style: r.venue.style || [],
    images: r.venue.images || [],
    score: r.score,
    rank: i + 1,
    reason: r.reason,
    breakdown: r.breakdown,
  }));
}

// ── Main Handler ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { conversationId, message, messages: history } = await req.json();
    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }
    if (process.env.DEEPSEEK_API_KEY) {
      return handleDeepSeekStream(history || [], message);
    }
    return handleSimulation(history || [], message);
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}

async function handleDeepSeekStream(
  history: Array<{ role: string; content: string }>,
  message: string
) {
  try {
    const systemPrompt = getSystemPrompt();
    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((m) => ({
        role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: message },
    ];

    const stream = await streamDeepSeekChat(chatMessages);
    const reader = stream.getReader();
    const textDecoder = new TextDecoder();
    let fullResponse = "";

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = textDecoder.decode(value, { stream: true });
            fullResponse += text;
            controller.enqueue(
              new TextEncoder().encode(`data: ${JSON.stringify({ content: text })}\n\n`)
            );
          }

          // Post-stream: extraction + venue recommendations
          let extraction = null;
          let completenessScore = 0;
          let phase: string = "gathering";
          let recommendations: any[] = [];

          // 1. Extract requirements
          try {
            const extractionMessages = [
              { role: "system" as const, content: EXTRACTION_PROMPT },
              ...chatMessages.filter((m) => m.role !== "system"),
              { role: "user" as const, content: "Extract the requirements from this conversation." },
            ];
            const extractionRaw = await deepSeekComplete(extractionMessages, { temperature: 0.1, maxTokens: 500 });
            extraction = parseRequirements(extractionRaw);
            if (extraction) {
              completenessScore = calculateCompleteness(extraction);
              phase = completenessScore >= 75 ? "recommending" : "gathering";
            }
          } catch (err) {
            console.error("Extraction error:", err);
          }

          // 2. Get venue recommendations from AI text (or fallback to full scoring)
          try {
            recommendations = await getRecommendationsFromText(fullResponse, extraction);
            // Fallback: if AI didn't mention any known venue, use scoring engine on all venues
            if (recommendations.length === 0) {
              const { map } = await loadVenueData();
              const allVenues = Array.from(map.values());
              if (allVenues.length > 0) {
                const reqs = extraction || ({} as ExtractedRequirements);
                const ranked = rankVenues(allVenues, reqs, 3);
                recommendations = ranked.map((r, i) => ({
                  venueId: r.venue.id, venueName: r.venue.venueName, slug: r.venue.slug,
                  location: { city: r.venue.location.city, area: r.venue.location.area, address: r.venue.location.address || "" },
                  capacity: { min: r.venue.capacity.min, max: r.venue.capacity.max },
                  priceRange: r.venue.priceRange || { min: 0, max: 0, currency: "IDR" },
                  venueType: r.venue.venueType, setting: r.venue.setting, style: r.venue.style || [],
                  images: r.venue.images || [], score: r.score, rank: i + 1,
                  reason: r.reason, breakdown: r.breakdown,
                }));
              }
            }
          } catch (err) {
            console.error("Recommendation extraction error:", err);
          }

          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({
                done: true,
                extraction,
                completenessScore,
                phase,
                recommendations,
              })}\n\n`
            )
          );
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("DeepSeek stream error:", error);
    return Response.json({ error: "AI service unavailable" }, { status: 503 });
  }
}

function handleSimulation(
  history: Array<{ role: string; content: string }>,
  message: string
) {
  const exchangeCount = Math.floor(history.length / 2);
  const phase = exchangeCount >= 3 ? "recommending" : "gathering";
  let response = "";
  if (phase === "gathering") {
    if (exchangeCount === 0) response = `Baik, budget sudah dicatat! 💰\n\nSelanjutnya, di area atau kota mana kira-kira pernikahannya akan diadakan?\n\nContoh: "Jakarta Selatan, daerah Kuningan atau Senayan". 📍`;
    else if (exchangeCount === 1) response = `Lokasi sudah dicatat! 📍\n\nTerakhir nih, perkiraan jumlah tamunya berapa ya?\n\nMisalnya: "sekitar 500 orang". 👥`;
    else response = `Data kamu sudah lengkap nih! 🎉\n\nKetik "rekomendasi" atau "lihat venue" ya, nanti aku kasih rekomendasi venue terbaik buat kamu!`;
  } else {
    response = `✨ **Rekomendasi Venue Terbaik:**\n\n1. ⭐ **Palma One Grand Ballroom** (92%)\n   📍 Kuningan, Jaksel | 👥 1200 pax | 💰 Rp280-350jt\n2. ⭐ **Balai Sudirman** (85%)\n   📍 Jaksel | 👥 1000 pax | 💰 Rp200-300jt\n3. ⭐ **Hotel Mulia** (72%)\n   📍 Senayan | 👥 1000 pax | 💰 Rp400-600jt`;
  }
  return Response.json({ conversationId: null, response, extraction: null, completenessScore: 0, phase });
}
