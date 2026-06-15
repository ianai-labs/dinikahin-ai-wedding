"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FFFCF5]">
        <div className="animate-spin h-8 w-8 border-2 border-[#C9A84C] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <aside className="hidden md:flex w-56 flex-col bg-[#0A1E3D] text-white shrink-0">
        <Link href="/" className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
          <Sparkles className="h-5 w-5 text-[#C9A84C]" />
          <span className="font-heading text-base font-bold">
            dinikahin<span className="text-[#C9A84C]">.com</span>
          </span>
        </Link>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-white/10 text-white">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link href="/admin/leads" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white">
            <Users className="h-4 w-4" /> Leads
          </Link>
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" /> Keluar
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
