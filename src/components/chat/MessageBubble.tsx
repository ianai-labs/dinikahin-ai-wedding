import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";
import type { Message } from "@/types";

/** Strip markdown formatting from text for clean chat display */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")   // bold → plain
    .replace(/\*(.+?)\*/g, "$1")        // italic → plain
    .replace(/__(.+?)__/g, "$1")        // underline → plain
    .replace(/`(.+?)`/g, "$1");         // code → plain
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 animate-in fade-in slide-in-from-bottom-2",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-[#C9A84C] text-white"
            : "bg-[#D43F6F]/10 text-[#D43F6F]"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-[#C9A84C] text-white rounded-tr-md"
            : "bg-[#F5F5F4] text-foreground rounded-tl-md"
        )}
      >
        <p className="whitespace-pre-wrap">{stripMarkdown(message.content)}</p>

        {/* Venue cards embedded in AI messages */}
        {message.venues && message.venues.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.venues.map((v) => (
              <div
                key={v.venueId}
                className="bg-white rounded-xl p-3 border border-border cursor-pointer hover:border-[#C9A84C] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-lg bg-[#E8D5B7] shrink-0 flex items-center justify-center text-xs text-[#A8892F]">
                    {v.venueName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{v.venueName}</p>
                    <p className="text-xs text-muted-foreground">{v.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={cn(
                          "text-xs font-medium px-1.5 py-0.5 rounded-full",
                          v.score >= 80
                            ? "bg-green-100 text-green-700"
                            : v.score >= 50
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        )}
                      >
                        ⭐ {v.score}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {v.capacity} pax
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
