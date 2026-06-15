"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCF5]">
      <div className="text-center px-4 max-w-md">
        <h1 className="font-heading text-4xl font-bold text-[#D43F6F] mb-4">
          Ups! Ada Kesalahan
        </h1>
        <p className="text-muted-foreground mb-8">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi dalam beberapa saat.
        </p>
        <Button onClick={reset} className="bg-[#C9A84C] hover:bg-[#A8892F] text-white rounded-xl">
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
