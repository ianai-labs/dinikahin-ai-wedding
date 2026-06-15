"use client";

import { useCallback } from "react";
import { useChatStore } from "@/store/chatStore";
import { ChatWelcomeScreen } from "./ChatWelcomeScreen";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { FeedbackButtons } from "./FeedbackButtons";
import type { ChatFeedback, Message } from "@/types";

interface ChatWindowProps {
  onSendMessage: (message: string) => void;
  onFeedback?: (feedback: ChatFeedback) => void;
  onLanjut?: () => void;
  onReset?: () => void;
}

export function ChatWindow({ onSendMessage, onFeedback, onLanjut, onReset }: ChatWindowProps) {
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const completenessScore = useChatStore((s) => s.completenessScore);
  const hasMessages = messages.length > 0;

  const handleSend = useCallback(
    (text: string) => {
      onSendMessage(text);
    },
    [onSendMessage]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {!hasMessages && <ChatWelcomeScreen />}
        {hasMessages && <MessageList />}
      </div>

      {/* Feedback Buttons — shown after recommendations */}
      {completenessScore >= 60 && onFeedback && (
        <FeedbackButtons onFeedback={onFeedback} disabled={isStreaming} />
      )}

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        onLanjut={onLanjut}
        disabled={isStreaming}
      />

      {/* Reset link */}
      {onReset && (
        <div className="flex justify-center pb-2">
          <button
            onClick={onReset}
            className="text-[10px] text-muted-foreground/40 hover:text-muted-foreground underline transition-colors"
          >
            Simulasi Ulang
          </button>
        </div>
      )}
    </div>
  );
}
