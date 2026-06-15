"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Venue, Vendor } from "@/types";

interface RecommendationState {
  recommendationId: string | null;
  recommendedVenues: Array<{ venue: Venue; score: number; rank: number; reason: string; vendors: Vendor[] }>;
  generatedSummary: string | null;
  iteration: number;
  error: string | null;

  setRecommendationId: (id: string) => void;
  setRecommendedVenues: (venues: RecommendationState["recommendedVenues"]) => void;
  setGeneratedSummary: (summary: string) => void;
  setIteration: (n: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useRecommendationStore = create<RecommendationState>()(
  persist(
    (set) => ({
      recommendationId: null,
      recommendedVenues: [],
      generatedSummary: null,
      iteration: 0,
      error: null,

      setRecommendationId: (id) => set({ recommendationId: id }),
      setRecommendedVenues: (venues) => set({ recommendedVenues: venues }),
      setGeneratedSummary: (summary) => set({ generatedSummary: summary }),
      setIteration: (n) => set({ iteration: n }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          recommendationId: null,
          recommendedVenues: [],
          generatedSummary: null,
          iteration: 0,
          error: null,
        }),
    }),
    {
      name: "dinikahin-recommendations",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") return localStorage;
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
      }),
      partialize: (state) => {
        const { error, ...rest } = state;
        return rest;
      },
    }
  )
);
