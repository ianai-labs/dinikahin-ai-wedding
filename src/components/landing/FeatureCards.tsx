import { MessageCircle, Target, LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: MessageCircle,
    title: "Konsultasi AI",
    description: "Ngobrol santai dengan Dini, AI Wedding Consultant yang siap mendampingi perencanaan pernikahanmu. Seperti curhat ke wedding planner — tapi gratis dan 24/7.",
    color: "bg-[#C9A84C]/10 text-[#C9A84C]",
  },
  {
    icon: Target,
    title: "Rekomendasi Cerdas",
    description: "Dapatkan rekomendasi yang dipersonalisasi berdasarkan budget, lokasi, jumlah tamu, dan gaya pernikahan impianmu — lengkap dengan skor kecocokan.",
    color: "bg-[#D43F6F]/10 text-[#D43F6F]",
  },
  {
    icon: LayoutGrid,
    title: "Bandingkan Pilihan",
    description: "Lihat perbandingan side-by-side: harga, kapasitas, fasilitas, dan skor — semua dalam satu tabel yang mudah dipahami. Pilih yang paling pas untuk hari spesialmu.",
    color: "bg-[#0A1E3D]/10 text-[#0A1E3D]",
  },
];

export function FeatureCards() {
  return (
    <section id="fitur" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Kenapa Pilih <span className="text-[#C9A84C]">dinikahin.com</span>?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Kami gabungkan kecerdasan AI dengan database terlengkap untuk memberikan pendampingan terbaik dalam mewujudkan pernikahan impianmu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="p-8 border-2 border-border hover:border-[#E8D5B7] transition-all duration-300 hover:shadow-lg rounded-2xl">
              <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${feature.color} mb-5`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
