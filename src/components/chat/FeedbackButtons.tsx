"use client";

import { cn } from "@/lib/utils";
import { FEEDBACK_OPTIONS } from "@/lib/utils/constants";
import type { ChatFeedback } from "@/types";

interface FeedbackButtonsProps {
  onFeedback: (feedback: ChatFeedback) => void;
  disabled?: boolean;
}

export function FeedbackButtons({ onFeedback, disabled }: FeedbackButtonsProps) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs text-muted-foreground mb-2">
        Ada yang kurang pas? Kasih tau Dini:
      </p>
      <div className="flex flex-wrap gap-2">
        {FEEDBACK_OPTIONS.map((option) => (
          <button
            key={option.type}
            onClick={() => onFeedback(option)}
            disabled={disabled}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium hover:border-[#C9A84C] hover:bg-[#FFFCF5] transition-colors",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span>{option.emoji}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
