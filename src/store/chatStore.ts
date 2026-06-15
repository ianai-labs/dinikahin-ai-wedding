"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Message, ExtractedRequirements } from "@/types";

export type ChatPhase = "gathering" | "recommending" | "feedback" | "summary" | "lead";

interface ChatState {
  conversationId: string | null;
  messages: Message[];
  isStreaming: boolean;
  completenessScore: number;
  extractedRequirements: ExtractedRequirements | null;
  phase: ChatPhase;
  generatedSummary: string | null;
  error: string | null;

  setConversationId: (id: string) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateLastAssistantMessage: (content: string) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setCompletenessScore: (score: number) => void;
  setExtractedRequirements: (req: ExtractedRequirements | null) => void;
  setPhase: (phase: ChatPhase) => void;
  setGeneratedSummary: (summary: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversationId: null,
      messages: [],
      isStreaming: false,
      completenessScore: 0,
      extractedRequirements: null,
      phase: "gathering",
      generatedSummary: null,
      error: null,

      setConversationId: (id) => set({ conversationId: id }),

      setMessages: (messages) => set({ messages }),

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      updateLastAssistantMessage: (content) =>
        set((state) => {
          const messages = [...state.messages];
          const lastIdx = messages.length - 1;
          if (lastIdx >= 0 && messages[lastIdx].role === "assistant") {
            messages[lastIdx] = {
              ...messages[lastIdx],
              content: messages[lastIdx].content + content,
            };
          }
          return { messages };
        }),

      setIsStreaming: (isStreaming) => set({ isStreaming }),

      setCompletenessScore: (score) => set({ completenessScore: score }),

      setExtractedRequirements: (req) => set({ extractedRequirements: req }),

      setPhase: (phase) => set({ phase }),

      setGeneratedSummary: (summary) => set({ generatedSummary: summary }),

      setError: (error) => set({ error }),

      reset: () =>
        set({
          conversationId: null,
          messages: [],
          isStreaming: false,
          completenessScore: 0,
          extractedRequirements: null,
          phase: "gathering",
          generatedSummary: null,
          error: null,
        }),
    }),
    {
      name: "dinikahin-chat",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => {
        const { isStreaming, error, ...rest } = state;
        return rest;
      },
    }
  )
);
