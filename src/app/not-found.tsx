import Link from "next/link";
import { Home } from "lucide-react";

const btnClass =
  "inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-[#C9A84C] hover:bg-[#A8892F] text-white text-sm font-medium whitespace-nowrap transition-all h-10 gap-1.5 px-6";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCF5]">
      <div className="text-center px-4">
        <h1 className="font-heading text-6xl font-bold text-[#C9A84C] mb-4">404</h1>
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Sepertinya halaman yang kamu cari sudah tidak tersedia atau alamatnya salah.
        </p>
        <Link href="/" className={btnClass}>
          <Home className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
