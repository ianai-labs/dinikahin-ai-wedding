"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useChatStore, type ChatPhase } from "@/store/chatStore";
import { useRecommendationStore } from "@/store/recommendationStore";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { createConversation } from "@/lib/firebase/firestore";
import type { ChatFeedback, Message } from "@/types";
import { mapVenueFromApi } from "@/lib/venue-mapper";
import { toast } from "sonner";

// ── Shared SSE reader (with line buffering) ─────────────────
async function readSSEStream(
  response: Response,
  onContent: (text: string) => void,
  onDone: (data: Record<string, unknown>) => void
) {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const r = await reader.read();
    if (r.done) break;
    buffer += decoder.decode(r.value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // keep incomplete last line for next chunk
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const d = line.slice(6);
      if (d === "[DONE]") continue;
      try {
        const p = JSON.parse(d);
        if (p.content) onContent(p.content);
        if (p.done) onDone(p);
      } catch {}
    }
  }
}

export default function ChatPage() {
  const router = useRouter();
  const { user, signUpAsGuest } = useAuth();
  const {
    conversationId, messages, isStreaming, phase,
    setConversationId, addMessage, updateLastAssistantMessage,
    setIsStreaming, setCompletenessScore, setExtractedRequirements,
    setPhase, setGeneratedSummary, setError, reset: resetChat,
  } = useChatStore();
  const { setRecommendedVenues, reset: resetRecs } = useRecommendationStore();

  const [initialized, setInitialized] = useState(false);

  // Initialize conversation
  useEffect(() => {
    const init = async () => {
      if (initialized) return;
      try {
        if (!user) { await signUpAsGuest(); return; }
        if (!conversationId) {
          const convId = await createConversation(user.id);
          setConversationId(convId);
        }
        setInitialized(true);
      } catch { setInitialized(true); }
    };
    init();
  }, [user, conversationId, initialized, signUpAsGuest, setConversationId]);

  // Send welcome message on first load
  useEffect(() => {
    if (initialized && messages.length === 0) {
      addMessage({
        id: crypto.randomUUID(), role: "assistant",
        content: `✨ **Halo! Selamat datang di dinikahin.com!** ✨

Aku Dini, AI Wedding Consultant yang bekerja sama dengan **MayWedding** — wedding planner profesional. Kak May dan tim udah bantu ratusan pasangan nemuin venue impian mereka! 🎉

Sebelum mulai, aku mau kenalan dulu:

💍 **Siapa nama Kakak dan pasangan?**
📅 **Kapan kira-kira rencana pernikahannya?**

Cerita aja, santai ya. Aku siap bantu!`,
        timestamp: new Date(),
      });
    }
  }, [initialized, messages.length, addMessage]);

  // ── Core: Send message + handle SSE ────────────────────────

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    // Add user message
    addMessage({ id: crypto.randomUUID(), role: "user", content: text, timestamp: new Date() });
    setIsStreaming(true);
    setError(null);

    try {
      // Try DeepSeek API
      let usedAPI = false;
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            message: text,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (response.ok) {
          const ct = response.headers.get("content-type") || "";
          if (ct.includes("text/event-stream")) {
            usedAPI = true;
            addMessage({ id: crypto.randomUUID(), role: "assistant", content: "", timestamp: new Date() });

            await readSSEStream(response,
              (text) => updateLastAssistantMessage(text),
              (data) => {
                if (data.extraction) {
                  setExtractedRequirements(data.extraction as any);
                  setCompletenessScore((data.completenessScore as number) || 0);
                  setPhase(((data.phase as string) || "gathering") as ChatPhase);
                }
                if (data.generatedSummary) {
                  setGeneratedSummary(data.generatedSummary as string);
                }
                if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
                  setRecommendedVenues(data.recommendations.map(mapVenueFromApi));
                }
              }
            );
          } else {
            // Non-streaming response (shouldn't happen with DeepSeek)
            const data = await response.json();
            if (data.response) {
              usedAPI = true;
              addMessage({ id: crypto.randomUUID(), role: "assistant", content: data.response, timestamp: new Date() });
            }
          }
        }
      } catch { /* API unavailable — use simulation */ }

      // Simulation fallback (DeepSeek not configured)
      if (!usedAPI) {
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 1000));
        const simResult = generateResponse(text, messages.length);
        addMessage({
          id: crypto.randomUUID(), role: "assistant",
          content: simResult.text, timestamp: new Date(),
        });
        setPhase((simResult.phase as ChatPhase) || "gathering");
        setCompletenessScore(simResult.completenessScore || 0);
        if (simResult.venues && simResult.venues.length > 0) {
          setRecommendedVenues(
            simResult.venues.map((v, i) => ({
              venue: {
                id: v.id || "", venueName: v.name || "", slug: v.slug || "",
                location: { city: v.city || "", area: v.city || "", address: "" },
                capacity: { min: 100, max: 500 },
                priceRange: { min: 0, max: 0, currency: "IDR" },
                venueType: "Gedung" as any, setting: "Indoor" as any,
                style: [], images: v.images || [],
                packageInfo: { description: "", includes: [], excludes: [] },
                pros: [], cons: [], specialFeatures: [],
                partnerId: null, isActive: true,
              },
              score: v.score || 80,
              rank: i + 1,
              reason: v.reason || "",
              vendors: [],
            }))
          );
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      toast.error("Gagal mengirim pesan.");
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, conversationId, addMessage, updateLastAssistantMessage,
      setIsStreaming, setError, setExtractedRequirements, setCompletenessScore,
      setPhase, setRecommendedVenues, router]);

  // ── Handlers ───────────────────────────────────────────────

  const handleLanjut = useCallback(() => {
    router.push("/compare");
  }, [router]);

  const handleReset = useCallback(() => {
    resetChat();
    resetRecs();
    window.location.reload();
  }, [resetChat, resetRecs]);

  const handleFeedback = useCallback(async (feedback: ChatFeedback) => {
    toast.success(`Feedback diterima: ${feedback.label}`);
    setPhase("feedback");
    useRecommendationStore.getState().setIteration(
      useRecommendationStore.getState().iteration + 1
    );
    // Let the next AI response handle re-recommendations
    // Just send the feedback as a normal chat message
    const msg: Message = { id: crypto.randomUUID(), role: "user", content: feedback.label, timestamp: new Date() };
    addMessage(msg);
    setIsStreaming(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: feedback.label,
          messages: [...useChatStore.getState().messages, msg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (response.ok && response.headers.get("content-type")?.includes("text/event-stream")) {
        addMessage({ id: crypto.randomUUID(), role: "assistant", content: "", timestamp: new Date() });
        await readSSEStream(response,
          (text) => updateLastAssistantMessage(text),
          (data) => {
            if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
              setRecommendedVenues(data.recommendations.map(mapVenueFromApi));
            }
          }
        );
      }
    } catch {}
    setIsStreaming(false);
  }, [conversationId, addMessage, updateLastAssistantMessage, setPhase, setIsStreaming, setRecommendedVenues]);

  return (
    <ChatWindow
      onSendMessage={handleSendMessage}
      onFeedback={handleFeedback}
      onLanjut={handleLanjut}
      onReset={handleReset}
    />
  );
}

// ── Simulation (when DeepSeek not available) ─────────────────

interface SimVenue {
  id?: string; name?: string; slug?: string; city?: string;
  score?: number; reason?: string; images?: string[];
}

interface SimResult {
  text: string;
  phase?: string;
  completenessScore?: number;
  venues?: SimVenue[];
}

function generateResponse(text: string, msgCount: number): SimResult {
  const t = text.toLowerCase();
  const exchangeCount = Math.floor(msgCount / 2);

  // Early conversation — ask for info
  if (exchangeCount <= 1) {
    return {
      text: `Halo Kakak! Senang banget bisa kenalan. 🎉\n\nBiar aku bisa bantu dengan maksimal, boleh cerita sedikit:\n💰 Budget yang sudah disiapkan?\n📍 Di kota/area mana?\n👥 Perkiraan berapa tamu?\n\nCerita aja sekaligus gak apa-apa kok! 😊`,
      phase: "gathering", completenessScore: 10,
    };
  }

  if (exchangeCount === 2) {
    return {
      text: `Data Kakak udah mulai lengkap nih! 🎉\n\nOh iya, sebagai info, aku punya akses ke 186+ venue di Jabodetabek lho. Cerita aja lebih detail tentang preferensi Kakak — nanti aku carikan yang paling cocok!`,
      phase: "gathering", completenessScore: 50,
    };
  }

  // Ask for recommendations trigger
  if (t.match(/rekomendasi|lihat|venue|cari|kasih|tampilkan|tolong|boleh/) || exchangeCount >= 3) {
    const city = t.includes("jakarta selatan") ? "Jakarta Selatan" :
                 t.includes("jakarta pusat") ? "Jakarta Pusat" :
                 t.includes("jakarta barat") ? "Jakarta Barat" :
                 t.includes("jakarta timur") ? "Jakarta Timur" :
                 t.includes("bogor") ? "Bogor" :
                 t.includes("depok") ? "Depok" :
                 t.includes("bekasi") ? "Bekasi" :
                 t.includes("tangerang") ? "Tangerang" : "Jakarta Selatan";

    const venues: SimVenue[] = [
      { id: "v1", name: "Aston Imperial", slug: "aston-imperial", city, score: 92, reason: "Sangat cocok dengan preferensi", images: [] },
      { id: "v2", name: "Horison Ultima", slug: "horison-ultima-bekasi", city, score: 85, reason: "Alternatif terbaik", images: [] },
      { id: "v3", name: "Grand Savero", slug: "grand-savero", city, score: 78, reason: "Budget friendly", images: [] },
    ];

    return {
      text: `Ini dia rekomendasi venue yang cocok buat Kakak di ${city}! 🎉✨\n\n🥇 **${venues[0].name}** — ⭐ ${venues[0].score}%\n   Pilihan terbaik untuk kebutuhan Kakak\n\n🥈 **${venues[1].name}** — ⭐ ${venues[1].score}%\n   Alternatif yang gak kalah oke\n\n🥉 **${venues[2].name}** — ⭐ ${venues[2].score}%\n   Opsi budget-friendly\n\nGimana Kakak? Ada yang kurang pas atau udah cocok? Kasih tau aja ya! 😊`,
      phase: "recommending", completenessScore: 85, venues,
    };
  }

  return {
    text: `Ada yang bisa aku bantu lagi, Kakak? Cerita aja tentang rencana pernikahannya. Aku siap bantu! ✨`,
    phase: "gathering", completenessScore: 60,
  };
}
