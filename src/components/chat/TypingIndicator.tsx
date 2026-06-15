import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-3">
      {/* Avatar */}
      <div className="shrink-0 h-8 w-8 rounded-full bg-[#D43F6F]/10 flex items-center justify-center">
        <Sparkles className="h-4 w-4 text-[#D43F6F]" />
      </div>

      {/* Dots */}
      <div className="bg-[#F5F5F4] rounded-2xl rounded-tl-md px-5 py-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#C9A84C] animate-bounce [animation-delay:0ms]" />
          <span className="h-2 w-2 rounded-full bg-[#C9A84C] animate-bounce [animation-delay:150ms]" />
          <span className="h-2 w-2 rounded-full bg-[#C9A84C] animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
