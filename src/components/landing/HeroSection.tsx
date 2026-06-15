"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, MessageCircle, Star, ArrowRight } from "lucide-react";

const btnPrimaryClass =
  "inline-flex shrink-0 items-center justify-center rounded-xl bg-[#C9A84C] hover:bg-[#A8892F] text-white font-semibold transition-all shadow-lg shadow-[#C9A84C]/20 text-base h-14 px-8 gap-2";

const btnOutlineClass =
  "inline-flex shrink-0 items-center justify-center rounded-xl border-2 border-white/30 hover:border-white/60 bg-white/10 hover:bg-white/20 text-white font-semibold transition-all text-base h-14 px-8 backdrop-blur-sm";

const HEADER_IMAGES = [
  "/landpage-heager-images/landpage-header-1.jpg",
  "/landpage-heager-images/landpage-header-2.jpg",
  "/landpage-heager-images/landpage-header-3.jpg",
];

export function HeroSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);

  // Slideshow every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIdx(currentIdx);
      setCurrentIdx((prev) => (prev + 1) % HEADER_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIdx]);

  return (
    <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16">
      {/* Background slideshow with crossfade */}
      <div className="absolute inset-0 bg-black">
        {HEADER_IMAGES.map((img, i) => (
          <div
            key={img}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${img})`,
              opacity: i === currentIdx ? 1 : i === prevIdx ? 0 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Wujudkan Pernikahan Impian dengan{" "}
              <span className="text-[#C9A84C]">Bantuan AI</span>
            </h1>

            <p className="mt-6 text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Chat dengan <strong className="text-white">Dini</strong>, AI Wedding Consultant yang siap mendampingi perjalanan pernikahanmu — dari konsultasi kebutuhan, rekomendasi venue, sampai terhubung dengan wedding planner profesional. Gratis!
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-8">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#C9A84C]" />
                <span className="text-sm text-white/70">Konsultasi <strong className="text-white">AI</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-[#C9A84C]" />
                <span className="text-sm text-white/70">Rekomendasi <strong className="text-white">Terpersonalisasi</strong></span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/chat" className={btnPrimaryClass}>
                Mulai Konsultasi Gratis <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="#cara-kerja" className={btnOutlineClass}>
                Lihat Cara Kerja
              </Link>
            </div>

            {/* Collaboration — below CTA */}
            <div className="mt-8 inline-flex items-center gap-3">
              <div className="h-8 w-8 rounded-full border border-white/30 overflow-hidden bg-white shrink-0">
                <Image src="/logo-images/logo-dinikahin.png" alt="dinikahin.com" width={32} height={32} className="object-contain p-0.5" />
              </div>
              <span className="text-white/40 text-xs">×</span>
              <div className="h-8 w-8 rounded-full border border-white/30 overflow-hidden bg-white shrink-0">
                <Image src="/logo-images/logo-may-wedding.jpg" alt="MayWedding" width={32} height={32} className="object-cover" />
              </div>
              <span className="text-white/50 text-xs">
                berkolaborasi dengan <strong className="text-white/70">MayWedding</strong>
              </span>
            </div>
          </div>

          {/* Right Visual — chat preview card (more transparent) */}
          <div className="flex-1 max-w-md lg:max-w-none">
            <div className="relative">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6 rotate-[-2deg]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">Dini — AI Wedding Consultant</p>
                    <p className="text-xs text-white/60">Online</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/80 rounded-xl p-3 text-sm text-foreground">
                    Halo! Aku Dini. Cerita tentang rencana pernikahanmu yuk — budget, lokasi, dan gaya yang kamu impikan 🎉
                  </div>
                  <div className="bg-[#C9A84C]/20 rounded-xl p-3 text-sm ml-8 text-white">
                    Budget kami sekitar Rp 200-300 juta
                  </div>
                  <div className="bg-white/80 rounded-xl p-3 text-sm text-foreground">
                    Baik! Di area kota mana kira-kira pernikahannya? 📍
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-[#D43F6F] text-white rounded-xl px-4 py-2 shadow-lg rotate-[3deg]">
                <p className="font-semibold text-sm">⭐ 4.9 / 5.0</p>
                <p className="text-xs text-white/80">Rekomendasi Terpercaya</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
