"use client";

import Link from "next/link";
import { ArrowLeft, Search, MessageCircle } from "lucide-react";
import { ScoreBadge } from "@/components/venue/ScoreBadge";
import { useRecommendationStore } from "@/store/recommendationStore";
import { formatCurrency, formatNumber } from "@/lib/utils/formatters";

export default function ComparePage() {
  const recommendedVenues = useRecommendationStore((s) => s.recommendedVenues);
  const hasVenues = recommendedVenues.length > 0;

  // Empty state
  if (!hasVenues) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#E8D5B7]/20 mb-6">
            <Search className="h-8 w-8 text-[#C9A84C]" />
          </div>
          <h1 className="font-heading text-xl font-bold mb-3">
            Belum Ada Venue untuk Dibandingkan
          </h1>
          <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Mulai konsultasi dengan Dini dulu ya! Setelah dapat rekomendasi venue, kamu bisa membandingkan venue-venue pilihanmu di halaman ini — side by side.
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

  const venues = recommendedVenues.map((rv) => ({
    venueName: rv.venue.venueName,
    slug: rv.venue.slug,
    location: rv.venue.location.area,
    capacity: rv.venue.capacity.max,
    price: {
      min: rv.venue.priceRange?.min || 0,
      max: rv.venue.priceRange?.max || 0,
    },
    type: rv.venue.venueType,
    setting: rv.venue.setting,
    style: rv.venue.style?.join(", ") || "-",
    score: rv.score,
    reason: rv.reason,
  }));

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 py-6">
        <Link href="/chat" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Chat
        </Link>

        <h1 className="font-heading text-2xl font-bold mb-2">Bandingkan Venue</h1>
        <p className="text-muted-foreground text-sm mb-6">
          {venues.length} venue direkomendasikan untukmu. Bandingkan side-by-side.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-36">Kriteria</th>
                {venues.map((v) => (
                  <th key={v.venueName} className="text-center py-3 px-4">
                    <Link href={`/venues/${v.slug}`} className="font-semibold text-sm hover:text-[#C9A84C] transition-colors">
                      {v.venueName}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4 text-sm font-medium">Skor</td>
                {venues.map((v) => (
                  <td key={v.venueName} className="text-center py-3 px-4"><ScoreBadge score={v.score} /></td>
                ))}
              </tr>
              <tr className="bg-[#FFFCF5]">
                <td className="py-3 px-4 text-sm font-medium">Harga</td>
                {venues.map((v) => (
                  <td key={v.venueName} className="text-center py-3 px-4 text-sm">{formatCurrency(v.price.min)} – {formatCurrency(v.price.max)}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium">Kapasitas</td>
                {venues.map((v) => (
                  <td key={v.venueName} className="text-center py-3 px-4 text-sm">{formatNumber(v.capacity)} pax</td>
                ))}
              </tr>
              <tr className="bg-[#FFFCF5]">
                <td className="py-3 px-4 text-sm font-medium">Lokasi</td>
                {venues.map((v) => (
                  <td key={v.venueName} className="text-center py-3 px-4 text-sm">{v.location}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium">Tipe</td>
                {venues.map((v) => (
                  <td key={v.venueName} className="text-center py-3 px-4 text-sm">{v.type}</td>
                ))}
              </tr>
              <tr className="bg-[#FFFCF5]">
                <td className="py-3 px-4 text-sm font-medium">Setting</td>
                {venues.map((v) => (
                  <td key={v.venueName} className="text-center py-3 px-4 text-sm">{v.setting}</td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium">Gaya</td>
                {venues.map((v) => (
                  <td key={v.venueName} className="text-center py-3 px-4 text-sm">{v.style}</td>
                ))}
              </tr>
              <tr className="bg-[#FFFCF5]">
                <td className="py-3 px-4 text-sm font-medium">Alasan</td>
                {venues.map((v) => (
                  <td key={v.venueName} className="text-center py-3 px-4 text-xs text-muted-foreground">{v.reason}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <Link
            href="/summary"
            className="inline-flex items-center rounded-xl bg-[#C9A84C] hover:bg-[#A8892F] text-white font-medium transition-all h-10 px-6 text-sm"
          >
            Lanjut ke Ringkasan →
          </Link>
        </div>
      </div>
    </div>
  );
}
