import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#FFFCF5] pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-bold text-center mb-12">
          Pertanyaan yang Sering <span className="text-[#C9A84C]">Ditanyakan</span>
        </h1>
        <div className="space-y-4">
          {[
            { q: "Apakah dinikahin.com gratis?", a: "Ya! Konsultasi dengan Dini dan rekomendasi pernikahan sepenuhnya gratis. Tidak ada biaya tersembunyi." },
            { q: "Bagaimana cara kerja rekomendasinya?", a: "Dini akan bertanya tentang budget, lokasi, jumlah tamu, dan preferensi gayamu. AI kami kemudian mencocokkan dengan database dan memberikan rekomendasi terbaik lengkap dengan skor kecocokan." },
            { q: "Apakah data saya aman?", a: "Keamanan data adalah prioritas kami. Semua data disimpan di Firebase dengan enkripsi, dan hanya kamu serta partner yang kamu pilih yang bisa mengaksesnya." },
            { q: "Berapa banyak pilihan yang tersedia?", a: "Kami memiliki database 186+ venue di area Jabodetabek, dan akan terus bertambah. Setiap venue dilengkapi informasi lengkap: harga, kapasitas, foto, dan fasilitas." },
            { q: "Bagaimana cara menghubungi partner?", a: "Setelah mendapat rekomendasi, kamu bisa langsung terhubung dengan wedding planner profesional via tombol WhatsApp yang sudah disediakan, lengkap dengan template pesan berisi ringkasan kebutuhanmu." },
          ].map((faq, i) => (
            <details key={i} className="bg-white border border-border rounded-xl p-5 group">
              <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                {faq.q}
                <span className="text-[#C9A84C] text-xl ml-4 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
