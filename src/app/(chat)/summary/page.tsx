"use client";

import Link from "next/link";
import { ArrowLeft, FileText, MessageCircle } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

export default function SummaryPage() {
  const generatedSummary = useChatStore((s) => s.generatedSummary);
  const hasSummary = !!generatedSummary;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link href="/compare" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Bandingkan
        </Link>

        <h1 className="font-heading text-2xl font-bold mb-2">Ringkasan Preferensi</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Ringkasan ini akan dikirim ke Wedding Organizer partner untuk membantu mereka memahami kebutuhanmu.
        </p>

        {hasSummary ? (
          <>
            <div className="bg-white border border-border rounded-2xl p-6 mb-6">
              <pre className="font-sans text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                {generatedSummary}
              </pre>
            </div>
            <div className="flex justify-center">
              <Link
                href="/lead"
                className="inline-flex items-center rounded-xl bg-[#C9A84C] hover:bg-[#A8892F] text-white font-medium transition-all h-11 px-8 text-sm"
              >
                Lanjut ke Hubungi WO Partner →
              </Link>
            </div>
          </>
        ) : (
          <div className="max-w-md mx-auto py-12 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#E8D5B7]/20 mb-6">
              <FileText className="h-8 w-8 text-[#C9A84C]" />
            </div>
            <h2 className="font-heading text-lg font-bold mb-2">Belum Ada Ringkasan</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Ringkasan preferensi akan dibuat otomatis setelah kamu berkonsultasi dengan Dini.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] hover:bg-[#A8892F] text-white font-medium transition-all h-10 px-6 text-sm"
            >
              <MessageCircle className="h-4 w-4" /> Mulai Konsultasi
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
