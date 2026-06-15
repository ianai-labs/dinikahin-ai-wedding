import Link from "next/link";
import { ArrowLeft, MapPin, Users, Wallet, Star, Check, X as XIcon } from "lucide-react";
import { ScoreBadge } from "@/components/venue/ScoreBadge";
import { VendorCard } from "@/components/venue/VendorCard";
import { formatCurrency, formatNumber } from "@/lib/utils/formatters";

// Mock data for development — will be replaced with Firestore fetch
const mockVenue = {
  id: "v1",
  venueName: "Palma One Grand Ballroom",
  slug: "palma-one-grand-ballroom",
  location: {
    city: "Jakarta",
    area: "Kuningan, Jakarta Selatan",
    address: "Jl. HR Rasuna Said, Kuningan, Jakarta Selatan",
  },
  capacity: { min: 200, max: 1200 },
  priceRange: { min: 280000000, max: 350000000, currency: "IDR" },
  venueType: "Hotel Ballroom" as const,
  setting: "Indoor" as const,
  style: ["Modern Classic", "Elegant"],
  images: [],
  packageInfo: {
    description: "Paket lengkap termasuk dekorasi, catering, sound system, dan wedding organizer basic.",
    includes: ["Dekorasi pelaminan & meja tamu", "Catering 500 pax", "Sound system 5000W", "AC central", "Parkir 200+ mobil", "Ruang VIP pengantin", "WO basic (1 koordinator)"],
    excludes: ["Entertainment (band/DJ)", "MUA & busana pengantin", "Dokumentasi (foto/video)", "Wedding cake"],
  },
  pros: ["Kapasitas besar (1200 pax)", "Lokasi strategis di Kuningan", "Fasilitas lengkap", "AC central & parkir luas"],
  cons: ["Harga di atas rata-rata gedung", "Terlalu besar untuk tamu <300", "Booking minimal 6 bulan sebelumnya"],
  specialFeatures: ["Musholla", "Akses kursi roda", "Ruang makeup", "Loading dock"],
  partnerId: null,
  isActive: true,
};

const mockVendors = [
  { id: "d1", vendorName: "Dekorasi Mewah By Rina", category: "Decoration" as const, location: { city: "Jakarta", area: "Jakarta Selatan" }, priceRange: { min: 15000000, max: 25000000, currency: "IDR" }, isActive: true },
  { id: "m1", vendorName: "Rias Pengantin Dinda", category: "Makeup Artist" as const, location: { city: "Jakarta", area: "Jakarta Selatan" }, priceRange: { min: 8000000, max: 15000000, currency: "IDR" }, isActive: true },
  { id: "e1", vendorName: "Akustik Band Jakarta", category: "Entertainment" as const, location: { city: "Jakarta", area: "Jakarta Selatan" }, priceRange: { min: 10000000, max: 20000000, currency: "IDR" }, isActive: true },
];

export default function VenueDetailPage() {
  const venue = mockVenue;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back */}
        <Link href="/chat" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Chat
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold mb-2">{venue.venueName}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {venue.location.area}</span>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {formatNumber(venue.capacity.max)} pax</span>
              <span className="flex items-center gap-1"><Wallet className="h-4 w-4" /> {formatCurrency(venue.priceRange.min, venue.priceRange.currency)}</span>
            </div>
          </div>
          <ScoreBadge score={92} size="lg" />
        </div>

        {/* Type & Style Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="bg-[#C9A84C]/10 text-[#A8892F] text-xs font-medium px-2.5 py-1 rounded-full">{venue.venueType}</span>
          <span className="bg-[#D43F6F]/10 text-[#D43F6F] text-xs font-medium px-2.5 py-1 rounded-full">{venue.setting}</span>
          {venue.style.map((s) => (
            <span key={s} className="bg-[#0A1E3D]/10 text-[#0A1E3D] text-xs font-medium px-2.5 py-1 rounded-full">{s}</span>
          ))}
        </div>

        {/* Package Info */}
        <section className="mb-8">
          <h2 className="font-heading text-lg font-semibold mb-3">Paket & Harga</h2>
          <div className="bg-white border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground mb-3">{venue.packageInfo.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1"><Check className="h-4 w-4" /> Termasuk</h4>
                <ul className="space-y-1">
                  {venue.packageInfo.includes.map((item) => (
                    <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1"><XIcon className="h-4 w-4" /> Tidak Termasuk</h4>
                <ul className="space-y-1">
                  {venue.packageInfo.excludes.map((item) => (
                    <li key={item} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <XIcon className="h-3.5 w-3.5 text-red-600 mt-0.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="mb-8">
          <h2 className="font-heading text-lg font-semibold mb-3">Kelebihan & Kekurangan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-border rounded-xl p-5">
              <h4 className="text-sm font-semibold text-green-700 mb-2">✅ Kelebihan</h4>
              <ul className="space-y-1.5">
                {venue.pros.map((p) => (
                  <li key={p} className="text-xs text-muted-foreground">{p}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-border rounded-xl p-5">
              <h4 className="text-sm font-semibold text-red-700 mb-2">⚠️ Kekurangan</h4>
              <ul className="space-y-1.5">
                {venue.cons.map((c) => (
                  <li key={c} className="text-xs text-muted-foreground">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Special Features */}
        {venue.specialFeatures.length > 0 && (
          <section className="mb-8">
            <h2 className="font-heading text-lg font-semibold mb-3">Fasilitas Khusus</h2>
            <div className="flex flex-wrap gap-2">
              {venue.specialFeatures.map((f) => (
                <span key={f} className="bg-[#E8D5B7]/20 text-[#A8892F] text-xs font-medium px-3 py-1.5 rounded-full">{f}</span>
              ))}
            </div>
          </section>
        )}

        {/* Supporting Vendors */}
        <section className="mb-8">
          <h2 className="font-heading text-lg font-semibold mb-3">Vendor Pendukung</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mockVendors.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-border rounded-xl p-5">
          <Link
            href="/lead"
            className="inline-flex items-center justify-center rounded-xl bg-[#C9A84C] hover:bg-[#A8892F] text-white font-medium transition-all h-10 px-6 text-sm w-full sm:w-auto"
          >
            Hubungi Partner Venue
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center justify-center rounded-xl border-2 border-border hover:border-[#C9A84C] font-medium transition-all h-10 px-6 text-sm w-full sm:w-auto"
          >
            Bandingkan Venue
          </Link>
        </div>
      </div>
    </div>
  );
}
