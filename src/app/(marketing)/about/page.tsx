import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFCF5] pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-bold text-center mb-8">
          Tentang <span className="text-[#C9A84C]">dinikahin.com</span>
        </h1>
        <div className="prose prose-stone mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            <strong>dinikahin.com</strong> adalah platform konsultasi pernikahan berbasis AI pertama di Indonesia.
            Kami hadir untuk mendampingi calon pengantin mewujudkan pernikahan impian mereka — dari konsultasi awal hingga siap melangkah ke tahap berikutnya, gratis.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Misi kami adalah menyederhanakan proses perencanaan pernikahan yang biasanya memakan waktu berminggu-minggu
            menjadi hitungan menit — dengan bantuan teknologi AI dan data terlengkap di Jabodetabek.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Kami percaya bahwa setiap pasangan berhak mendapatkan pengalaman merencanakan pernikahan yang menyenangkan dan bebas stres — dimulai dari langkah pertama bersama Dini, AI Wedding Consultant kami.
          </p>
        </div>
      </div>
    </div>
  );
}
