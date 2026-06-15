"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const btnLinkClass =
  "inline-flex shrink-0 items-center justify-center rounded-xl bg-[#C9A84C] hover:bg-[#A8892F] text-white text-sm font-medium transition-all h-9 px-4";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Sparkles className="h-6 w-6 text-[#C9A84C]" />
          <span className="font-heading text-xl font-bold text-foreground">
            dinikahin<span className="text-[#C9A84C]">.com</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Konsultasi
          </Link>
          <Link href="/#fitur" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Fitur
          </Link>
          <Link href="/#cara-kerja" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cara Kerja
          </Link>
          <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/chat" className={btnLinkClass}>
            {user ? "Lanjut Konsultasi" : "Mulai Konsultasi"}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-b border-border">
          <nav className="flex flex-col px-4 py-4 gap-3">
            <Link href="/chat" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
              Konsultasi
            </Link>
            <Link href="/#fitur" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
              Fitur
            </Link>
            <Link href="/#cara-kerja" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
              Cara Kerja
            </Link>
            <Link href="/faq" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
              FAQ
            </Link>
            <Link href="/chat" className={cn(btnLinkClass, "w-full mt-2 justify-center")} onClick={() => setMobileOpen(false)}>
              Mulai Konsultasi
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
