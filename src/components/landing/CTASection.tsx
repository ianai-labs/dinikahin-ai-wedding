import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-[#0A1E3D] relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, #C9A84C 1px, transparent 1px), radial-gradient(circle at 80% 50%, #D43F6F 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#C9A84C]/20 mb-6">
          <Sparkles className="h-8 w-8 text-[#C9A84C]" />
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
          Siap Wujudkan Pernikahan Impianmu?
        </h2>
        <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Mulai konsultasi gratis dengan Dini sekarang juga. Dapatkan pendampingan perencanaan pernikahan dari AI — tanpa biaya, tanpa komitmen.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/chat" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#C9A84C] hover:bg-[#A8892F] text-white font-semibold transition-all shadow-lg shadow-[#C9A84C]/30 text-base h-14 px-8 gap-2">
            Mulai Konsultasi Gratis <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <p className="mt-6 text-white/40 text-sm">
          Gratis selamanya. Tidak perlu kartu kredit.
        </p>
      </div>
    </section>
  );
}
