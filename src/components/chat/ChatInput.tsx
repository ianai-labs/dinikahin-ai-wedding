"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useRecommendationStore } from "@/store/recommendationStore";
import { MAX_FEEDBACK_ITERATIONS } from "@/lib/utils/constants";

interface ChatInputProps {
  onSend: (message: string) => void;
  onLanjut?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onLanjut,
  disabled,
  placeholder = "Ketik pesanmu di sini...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const phase = useChatStore((s) => s.phase);
  const completenessScore = useChatStore((s) => s.completenessScore);
  const messagesCount = useChatStore((s) => s.messages.length);
  const iteration = useRecommendationStore((s) => s.iteration);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Context-aware suggestion chips — 3 phases
  const suggestions: string[] = (() => {
    const exchangeCount = Math.floor(messagesCount / 2);

    // Early: guide first-time users
    if (exchangeCount <= 1 && completenessScore < 25) {
      return ["Budget sekitar Rp50-100 juta", "Di Jakarta Selatan"];
    }
    // Recommending: feedback or close
    if (phase === "recommending" || phase === "feedback") {
      if (iteration >= MAX_FEEDBACK_ITERATIONS - 1) {
        return ["Lanjut bandingkan ✅"];
      }
      return ["Saya suka! ❤️", "Cari yang lain"];
    }
    // Middle: prompt for recs
    if (completenessScore >= 75) {
      return ["Lihat Rekomendasi ✨"];
    }
    return [];
  })();

  return (
    <div className="border-t border-border bg-white px-4 py-3">
      <div className="max-w-3xl mx-auto">
        {/* CTA "Lanjut" button — when in recommending/feedback phase */}
        {(phase === "recommending" || phase === "feedback") && onLanjut && (
          <div className="flex justify-center mb-3">
            <button
              onClick={onLanjut}
              disabled={disabled}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C9A84C] hover:bg-[#A8892F] text-white font-semibold transition-all shadow-md shadow-[#C9A84C]/20 text-sm h-11 px-6 disabled:opacity-50"
            >
              Lanjut ke Bandingkan <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSend(s)}
                disabled={disabled}
                className={cn(
                  "text-xs bg-[#FFFCF5] border border-[#E8D5B7] hover:border-[#C9A84C] hover:bg-[#C9A84C]/5 rounded-full px-3 py-1.5 transition-all",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "flex-1 resize-none rounded-xl border border-border bg-[#F5F5F4] px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 transition-colors",
              disabled && "opacity-50"
            )}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className={cn(
              "shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-all",
              value.trim() && !disabled
                ? "bg-[#C9A84C] text-white hover:bg-[#A8892F]"
                : "bg-[#F5F5F4] text-muted-foreground cursor-not-allowed"
            )}
          >
            {disabled ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
