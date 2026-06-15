import Link from "next/link";
import { Sparkles, Globe, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0A1E3D] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-[#C9A84C]" />
              <span className="font-heading text-xl font-bold text-white">
                dinikahin<span className="text-[#C9A84C]">.com</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Platform konsultasi pernikahan berbasis AI pertama di Indonesia. Chat dengan Dini, AI Wedding Consultant kami, dan wujudkan pernikahan impianmu dengan mudah.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-white/60 hover:text-[#C9A84C] transition-colors" aria-label="Website">
                <Globe className="h-5 w-5" />
              </a>
              <a href="mailto:halo@dinikahin.com" className="text-white/60 hover:text-[#C9A84C] transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Layanan</h4>
            <ul className="space-y-2">
              <li><Link href="/chat" className="text-white/60 hover:text-white text-sm transition-colors">Konsultasi AI</Link></li>
              <li><Link href="/#fitur" className="text-white/60 hover:text-white text-sm transition-colors">Fitur</Link></li>
              <li><Link href="/#cara-kerja" className="text-white/60 hover:text-white text-sm transition-colors">Cara Kerja</Link></li>
              <li><Link href="/faq" className="text-white/60 hover:text-white text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Tentang</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white/60 hover:text-white text-sm transition-colors">Tentang Kami</Link></li>
              <li><Link href="/kebijakan-privasi" className="text-white/60 hover:text-white text-sm transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/syarat-ketentuan" className="text-white/60 hover:text-white text-sm transition-colors">Syarat & Ketentuan</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} dinikahin.com. All rights reserved.</p>
          <p className="text-white/40 text-xs">Made with ❤️ for Indonesian couples</p>
        </div>
      </div>
    </footer>
  );
}
