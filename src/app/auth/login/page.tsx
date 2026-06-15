"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail } from "lucide-react";
import { signInWithGoogle, signInWithEmail, registerWithEmail } from "@/lib/firebase/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      router.push("/chat");
    } catch {
      toast.error("Gagal login dengan Google. Pastikan Firebase sudah dikonfigurasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast.error("Email dan password harus diisi");
      return;
    }
    try {
      setLoading(true);
      if (isRegister) {
        await registerWithEmail(email, password);
        toast.success("Akun berhasil dibuat!");
      } else {
        await signInWithEmail(email, password);
      }
      router.push("/chat");
    } catch {
      toast.error(isRegister ? "Gagal mendaftar. Coba lagi." : "Gagal login. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCF5] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="h-7 w-7 text-[#C9A84C]" />
          <span className="font-heading text-xl font-bold">
            dinikahin<span className="text-[#C9A84C]">.com</span>
          </span>
        </Link>

        <div className="bg-white border border-border rounded-2xl p-6">
          <h1 className="font-heading text-xl font-bold text-center mb-6">
            {isRegister ? "Buat Akun" : "Masuk"}
          </h1>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-border hover:border-[#C9A84C] bg-white font-medium transition-all h-11 text-sm mb-4"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Lanjutkan dengan Google
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-muted-foreground">atau</span></div>
          </div>

          {/* Email Login */}
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-[#C9A84C]"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:border-[#C9A84C]"
            />
            <button
              onClick={handleEmailAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] hover:bg-[#A8892F] text-white font-medium transition-all h-11 text-sm"
            >
              <Mail className="h-4 w-4" />
              {isRegister ? "Daftar dengan Email" : "Masuk dengan Email"}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
            <button onClick={() => setIsRegister(!isRegister)} className="text-[#C9A84C] hover:underline font-medium">
              {isRegister ? "Masuk" : "Daftar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
