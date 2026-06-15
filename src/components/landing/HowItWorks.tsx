import { MessageSquareText, Search, HeartHandshake, Phone } from "lucide-react";

const steps = [
  {
    icon: MessageSquareText,
    number: "1",
    title: "Chat dengan Dini",
    description: "Ceritakan rencana pernikahan impianmu — Dini, AI Wedding Consultant kami, akan memahami kebutuhanmu dengan pertanyaan yang hangat dan relevan.",
  },
  {
    icon: Search,
    number: "2",
    title: "Dapatkan Rekomendasi",
    description: "AI kami akan mencocokkan kebutuhanmu dan memberikan rekomendasi terbaik lengkap dengan skor kecocokan — dari venue hingga pertimbangan penting lainnya.",
  },
  {
    icon: HeartHandshake,
    number: "3",
    title: "Pilih yang Terbaik",
    description: "Bandingkan pilihanmu, lihat detail lengkap, dan tentukan yang paling cocok dengan selera dan visi pernikahanmu.",
  },
  {
    icon: Phone,
    number: "4",
    title: "Hubungi Partner",
    description: "Langsung terhubung dengan wedding planner profesional via WhatsApp. Ringkasan kebutuhanmu otomatis terkirim — tinggal eksekusi!",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-20 bg-[#FFFCF5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Gimana <span className="text-[#C9A84C]">Caranya?</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Cukup 4 langkah mudah menuju pernikahan impianmu. Didampingi AI, tanpa ribet, tanpa biaya.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              {/* Connector line (desktop) */}
              {parseInt(step.number) < 4 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-[#E8D5B7]" />
              )}

              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white border-2 border-[#E8D5B7] mb-5 relative z-10">
                <step.icon className="h-7 w-7 text-[#C9A84C]" />
              </div>
              <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#C9A84C] text-white text-xs font-bold mb-3">
                {step.number}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
