"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Phone, Mail, User, ClipboardList, MessageCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useChatStore } from "@/store/chatStore";
import { useRecommendationStore } from "@/store/recommendationStore";
import { validateLeadForm } from "@/lib/utils/validators";
import { toast } from "sonner";

export default function LeadPage() {
  const { user, isGuest } = useAuth();
  const extractedRequirements = useChatStore((s) => s.extractedRequirements);
  const recommendedVenues = useRecommendationStore((s) => s.recommendedVenues);
  const topVenue = recommendedVenues[0];
  const hasRecommendations = recommendedVenues.length > 0;

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  // Empty state — no recommendations yet
  if (!hasRecommendations && !submitted) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#E8D5B7]/20 mb-6">
            <ClipboardList className="h-8 w-8 text-[#C9A84C]" />
          </div>
          <h1 className="font-heading text-xl font-bold mb-3">Belum Siap Submit</h1>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Isi data dirimu setelah kamu mendapatkan rekomendasi venue yang cocok dari Dini. Partner kami akan menghubungi kamu setelah kamu submit.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] hover:bg-[#A8892F] text-white font-medium transition-all h-10 px-6 text-sm"
          >
            <MessageCircle className="h-4 w-4" /> Mulai Konsultasi
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLeadForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          conversationId: useChatStore.getState().conversationId,
          recommendationId: useRecommendationStore.getState().recommendationId,
          summary: useRecommendationStore.getState().generatedSummary,
          venueInterest: topVenue?.venue?.venueName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWhatsappUrl(data.whatsappUrl || `https://wa.me/6281210611833`);
        setSubmitted(true);
        toast.success("Data berhasil dikirim!");
      } else {
        toast.error("Gagal mengirim data.");
      }
    } catch {
      toast.error("Gagal mengirim data. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-heading text-2xl font-bold mb-3">Terima Kasih! 🎉</h1>
          <p className="text-muted-foreground mb-6">Partner kami akan menghubungi kamu segera.</p>

          {topVenue && (
            <div className="bg-white border border-border rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-muted-foreground mb-1">Venue pilihan:</p>
              <p className="font-semibold text-sm">{topVenue.venue.venueName}</p>
              <p className="text-xs text-muted-foreground">📍 {topVenue.venue.location.area} | ⭐ {topVenue.score}%</p>
            </div>
          )}

          <div className="space-y-3 mb-8">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium h-12 px-6 text-sm w-full">
              💬 Chat WhatsApp Partner
            </a>
            <Link href="/summary" className="flex items-center justify-center gap-2 rounded-xl border-2 border-border hover:border-[#C9A84C] font-medium h-12 px-6 text-sm w-full">
              📋 Lihat Ringkasan
            </Link>
            <Link href="/chat" className="flex items-center justify-center gap-2 rounded-xl border-2 border-border hover:border-[#C9A84C] font-medium h-12 px-6 text-sm w-full">
              Kembali ke Konsultasi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 py-6">
        <Link href="/compare" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Bandingkan
        </Link>

        <h1 className="font-heading text-2xl font-bold mb-2">Hubungi WO Partner</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Isi data di bawah agar Wedding Organizer partner kami bisa menghubungi kamu.
        </p>

        {isGuest && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800">
              💡 <strong>Tips:</strong> Login terlebih dahulu agar data konsultasi kamu tersimpan.
            </p>
            <Link href="/auth/login" className="text-sm text-[#C9A84C] font-medium hover:underline mt-1 inline-block">
              Login sekarang →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nama Lengkap *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({}); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                placeholder="Nama lengkap kamu" />
            </div>
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nomor HP / WhatsApp *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="tel" value={form.phone}
                onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({}); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                placeholder="081234567890" />
            </div>
            {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email <span className="text-muted-foreground">(opsional)</span></label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="email" value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({}); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30"
                placeholder="email@example.com" />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
          <button type="submit" disabled={submitting}
            className="w-full rounded-xl bg-[#C9A84C] hover:bg-[#A8892F] text-white font-medium transition-all h-12 text-sm disabled:opacity-50">
            {submitting ? "Mengirim..." : "Kirim & Hubungi Partner"}
          </button>
        </form>
      </div>
    </div>
  );
}
