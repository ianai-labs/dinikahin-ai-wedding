"use client";

import { useState, useCallback } from "react";
import { useRecommendationStore } from "@/store/recommendationStore";
import { X, Image, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  onClose?: () => void;
}

interface LightboxState {
  slug: string;
  venueName: string;
  images: string[];
  activeIdx: number;
}

const MAX_IMAGES = 3;

/** Generate predictable image paths for a venue */
function getVenueImagePaths(slug: string): string[] {
  return Array.from({ length: MAX_IMAGES }, (_, i) => `/venue-images/${slug}/${i + 1}.webp`);
}

export function ChatSidebar({ onClose }: ChatSidebarProps) {
  const recommendedVenues = useRecommendationStore((s) => s.recommendedVenues);

  const [activeIndices, setActiveIndices] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  // Track broken images: slug -> Set of failed indices
  const [brokenImages, setBrokenImages] = useState<Record<string, Set<number>>>({});

  const getActiveIndex = (slug: string) => activeIndices[slug] || 0;

  const handleImageError = useCallback((slug: string, idx: number) => {
    setBrokenImages((prev) => {
      const current = prev[slug] || new Set<number>();
      if (current.has(idx)) return prev; // already marked
      const next = new Set(current);
      next.add(idx);
      return { ...prev, [slug]: next };
    });
  }, []);

  /** Get valid (non-broken) images for a venue */
  const getValidImages = useCallback((slug: string): string[] => {
    const paths = getVenueImagePaths(slug);
    const broken = brokenImages[slug];
    if (!broken) return paths; // haven't tried loading yet, assume all valid
    return paths.filter((_, i) => !broken.has(i));
  }, [brokenImages]);

  const openLightbox = (slug: string, venueName: string, idx: number) => {
    const valid = getValidImages(slug);
    if (valid.length === 0) return;
    const actualIdx = Math.min(idx, valid.length - 1);
    setLightbox({ slug, venueName, images: valid, activeIdx: actualIdx });
  };

  const closeLightbox = () => setLightbox(null);

  // Build items (always 3 slots)
  const items = recommendedVenues.length > 0
    ? recommendedVenues.slice(0, 3).map((rv) => ({
        key: rv.venue.id || rv.venue.slug,
        slug: rv.venue.slug,
        name: rv.venue.venueName,
        score: rv.score,
        isReal: true,
      }))
    : Array.from({ length: 3 }).map((_, i) => ({
        key: `placeholder-${i}`,
        slug: "",
        name: `Venue Rekomendasi ${i + 1}`,
        score: 0,
        isReal: false,
      }));

  return (
    <>
      <div className="h-full flex flex-col bg-[#FFFCF5]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h3 className="font-semibold text-sm">Preview Venue</h3>
          {onClose && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col p-3 gap-3 min-h-0">
          {items.map((item) => {
            const imagePaths = item.isReal ? getVenueImagePaths(item.slug) : [];
            const broken = brokenImages[item.slug];
            // Count valid: paths that haven't failed yet
            const validCount = item.isReal
              ? imagePaths.filter((_, i) => !broken?.has(i)).length
              : 0;
            const activeIdx = item.isReal ? getActiveIndex(item.slug) : 0;
            // Ensure activeIdx points to a valid image
            const validIdx = item.isReal
              ? (() => {
                  if (!broken?.has(activeIdx)) return activeIdx;
                  // Find first non-broken
                  const firstValid = imagePaths.findIndex((_, i) => !broken?.has(i));
                  return firstValid >= 0 ? firstValid : 0;
                })()
              : 0;
            const hasMultiple = item.isReal && validCount > 1;

            const setActive = (idx: number) => {
              setActiveIndices((prev) => ({ ...prev, [item.slug]: idx }));
            };

            const goPrev = () => {
              // Find previous valid index
              let prev = validIdx - 1;
              while (prev >= 0 && broken?.has(prev)) prev--;
              if (prev < 0) {
                // Wrap to last valid
                prev = MAX_IMAGES - 1;
                while (prev >= 0 && broken?.has(prev)) prev--;
              }
              if (prev >= 0) setActive(prev);
            };

            const goNext = () => {
              let next = validIdx + 1;
              while (next < MAX_IMAGES && broken?.has(next)) next++;
              if (next >= MAX_IMAGES) {
                next = 0;
                while (next < MAX_IMAGES && broken?.has(next)) next++;
              }
              if (next < MAX_IMAGES) setActive(next);
            };

            return (
              <div key={item.key} className="flex-1 flex flex-col min-h-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1.5 shrink-0">
                  {item.isReal ? (
                    <>
                      <span className={cn(
                        "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                        item.score >= 80 ? "bg-green-100 text-green-700"
                          : item.score >= 50 ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      )}>
                        ⭐ {item.score}%
                      </span>
                      <a href={`/venues/${item.slug}`} className="text-xs font-semibold truncate hover:text-[#C9A84C] transition-colors">
                        {item.name}
                      </a>
                      <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{validCount} foto</span>
                    </>
                  ) : (
                    <>
                      <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400">⭐ —</span>
                      <span className="text-xs font-semibold text-muted-foreground/40 truncate">{item.name}</span>
                    </>
                  )}
                </div>

                {/* Image */}
                <div className="relative group flex-1 min-h-0">
                  {item.isReal && validCount > 0 ? (
                    <div
                      className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100 border border-[#E8D5B7] cursor-pointer"
                      onClick={() => openLightbox(item.slug, item.name, validIdx)}
                    >
                      {/* Render all 3 image slots, hide broken ones */}
                      {imagePaths.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`${item.name} ${i + 1}`}
                          className={cn(
                            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                            i === validIdx ? "opacity-100" : "opacity-0 pointer-events-none"
                          )}
                          loading="lazy"
                          onError={() => handleImageError(item.slug, i)}
                        />
                      ))}

                      {hasMultiple && (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            className="absolute left-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); goNext(); }}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-xl border-2 border-dashed border-[#E8D5B7] bg-white flex flex-col items-center justify-center gap-1 text-muted-foreground/30">
                      <Image className="h-6 w-6" />
                      <span className="text-[10px] font-medium">Preview</span>
                    </div>
                  )}

                  {/* Dots */}
                  {hasMultiple && item.isReal && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                      {imagePaths.map((_, i) =>
                        broken?.has(i) ? null : (
                          <button key={i} onClick={(e) => { e.stopPropagation(); setActive(i); }}
                            className={cn("h-1.5 rounded-full transition-all",
                              i === validIdx ? "w-3.5 bg-white shadow" : "w-1.5 bg-white/60 hover:bg-white/80"
                            )} />
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center" onClick={closeLightbox}>
          <button onClick={closeLightbox}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10">
            <X className="h-5 w-5" />
          </button>
          <p className="absolute top-4 left-4 text-white/80 text-sm font-medium z-10">
            {lightbox.venueName} — {lightbox.activeIdx + 1}/{lightbox.images.length}
          </p>
          <img src={lightbox.images[lightbox.activeIdx]} alt={lightbox.venueName}
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg select-none"
            onClick={(e) => e.stopPropagation()} />
          {lightbox.images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, activeIdx: lightbox.activeIdx === 0 ? lightbox.images.length - 1 : lightbox.activeIdx - 1 }); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, activeIdx: lightbox.activeIdx === lightbox.images.length - 1 ? 0 : lightbox.activeIdx + 1 }); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors">
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          {lightbox.images.length > 1 && (
            <div className="absolute bottom-6 flex items-center gap-2">
              {lightbox.images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, activeIdx: i }); }}
                  className={cn("h-2 rounded-full transition-all", i === lightbox.activeIdx ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60")} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
