import { Sparkles, Heart } from "lucide-react";

export function ChatWelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center">
      {/* Large decorative element */}
      <div className="relative mb-6">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-[#C9A84C]/10 to-[#D43F6F]/10">
          <Sparkles className="h-12 w-12 text-[#C9A84C]" />
        </div>
        <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[#D43F6F]/10 flex items-center justify-center">
          <Heart className="h-4 w-4 text-[#D43F6F]" />
        </div>
      </div>

      <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
        Wujudkan Pernikahan Impianmu
      </h2>
      <p className="text-muted-foreground text-base max-w-md leading-relaxed">
        Ceritakan rencana pernikahanmu ke <strong>Dini</strong>, AI Wedding Consultant kami. Dini akan mendampingi perjalanan pernikahanmu — dari konsultasi hingga kamu siap melangkah. Gratis, personal, dan selalu siap 24/7.
      </p>

      {/* Feature pills */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
        {[
          { emoji: "💰", title: "Budget", desc: "Sesuai kantong" },
          { emoji: "📍", title: "Lokasi", desc: "Area pilihanmu" },
          { emoji: "👥", title: "Tamu", desc: "Kapasitas pas" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white border border-border hover:border-[#E8D5B7] rounded-xl p-4 text-center transition-colors"
          >
            <span className="text-2xl">{item.emoji}</span>
            <p className="font-semibold text-sm mt-2">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-10">
        Ketik di bawah untuk mulai konsultasi 👇
      </p>
    </div>
  );
}
