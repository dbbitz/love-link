import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Gift, Pause, Play, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getPresentationThemeById } from "@/features/creation/constants/presentationThemes";
import type { PresentationRecord } from "@/features/creation/types";
import { cn } from "@/lib/utils";

interface PresentationViewerProps {
  presentation: PresentationRecord;
}

type PresentationSlide =
  | {
      id: string;
      kind: "photo";
      image: string;
      text: string;
    }
  | {
      id: string;
      kind: "gift-card";
      companyName: string;
      amount: number;
    };

export function PresentationViewer({ presentation }: PresentationViewerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const { items, selectedGiftCard, selectedAudio, selectedThemeId } = presentation;

  const slides = useMemo<PresentationSlide[]>(() => {
    const photoSlides: PresentationSlide[] = items.map((item) => ({
      id: item.id,
      kind: "photo",
      image: item.image,
      text: item.text,
    }));

    if (!selectedGiftCard) {
      return photoSlides;
    }

    return [
      ...photoSlides,
      {
        id: "gift-card-final",
        kind: "gift-card",
        companyName: selectedGiftCard.companyName,
        amount: selectedGiftCard.amount,
      },
    ];
  }, [items, selectedGiftCard]);

  const activeIndex = slides.length === 0 ? 0 : Math.min(currentIndex, slides.length - 1);
  const currentSlide = slides[activeIndex] ?? null;
  const selectedTheme = useMemo(
    () => getPresentationThemeById(selectedThemeId),
    [selectedThemeId]
  );
  const isDarkTheme = selectedTheme.id === "sparkle-night";

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning]);

  const handleNextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    goToSlide((currentIndex + 1) % slides.length);
  }, [slides.length, currentIndex, goToSlide]);

  const handlePrevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    goToSlide(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  }, [slides.length, currentIndex, goToSlide]);

  const handleToggleAudio = useCallback(async () => {
    if (!audioRef.current || !selectedAudio) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [isPlaying, selectedAudio]);

  const handleFirstInteraction = useCallback(async () => {
    if (hasInteracted) return;
    setHasInteracted(true);

    if (audioRef.current && selectedAudio) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  }, [hasInteracted, selectedAudio]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleNextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextSlide, handlePrevSlide]);

  useEffect(() => {
    const audioElement = audioRef.current;
    return () => {
      audioElement?.pause();
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }

    setTouchStart(null);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 flex flex-col items-center justify-center overflow-hidden",
        selectedTheme.stageGradientClass
      )}
      onClick={handleFirstInteraction}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <audio
        key={selectedAudio?.url ?? "no-audio"}
        ref={audioRef}
        src={selectedAudio?.url}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {selectedTheme.decorations.map((decoration, index) => {
        const positions = [
          "top-8 left-6 text-3xl",
          "top-12 right-8 text-2xl",
          "bottom-32 right-6 text-3xl",
          "bottom-24 left-8 text-2xl",
          "top-1/3 left-4 text-xl",
          "top-1/2 right-4 text-xl",
        ];
        return (
          <span
            key={`deco-${selectedTheme.id}-${index}`}
            aria-hidden
            className={cn(
              "pointer-events-none fixed z-10 animate-pulse",
              positions[index % positions.length],
              isDarkTheme ? "opacity-80" : "opacity-70"
            )}
            style={{ animationDelay: `${index * 0.5}s`, animationDuration: "3s" }}
          >
            {decoration}
          </span>
        );
      })}

      {!hasInteracted && selectedAudio && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className={cn(
                "flex size-20 items-center justify-center rounded-full",
                isDarkTheme ? "bg-amber-400/20" : "bg-rose-500/20"
              )}
            >
              <Play
                className={cn(
                  "size-10",
                  isDarkTheme ? "text-amber-300" : "text-rose-500"
                )}
              />
            </div>
            <p className="text-lg font-medium text-white">Toque para iniciar</p>
            <p className="text-sm text-white/70">Uma surpresa especial espera por voce</p>
          </div>
        </div>
      )}

      <div className="relative flex h-full w-full max-w-lg flex-col items-center justify-center px-4 py-8">
        {currentSlide && (
          <div
            className={cn(
              "relative w-full transition-all duration-500 ease-out",
              isTransitioning ? "scale-95 opacity-0" : "scale-100 opacity-100"
            )}
          >
            {currentSlide.kind === "photo" ? (
              <article className="relative aspect-[9/14] w-full overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-0 rounded-3xl border-4 p-3 shadow-2xl ring-4",
                    selectedTheme.frameClass
                  )}
                >
                  <div className="relative size-full overflow-hidden rounded-2xl">
                    <img
                      src={currentSlide.image}
                      alt="Foto da apresentacao"
                      className="size-full object-cover"
                    />

                    <div
                      className={cn(
                        "absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent px-5 pb-6 pt-16",
                        selectedTheme.captionClass
                      )}
                    >
                      <p className="text-base leading-relaxed text-white drop-shadow-lg md:text-lg">
                        {currentSlide.text.trim() || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <article
                className={cn(
                  "relative flex aspect-[9/14] w-full flex-col items-center justify-center gap-5 rounded-3xl border-4 p-6 text-center shadow-2xl ring-4",
                  selectedTheme.frameClass,
                  selectedTheme.stageGradientClass
                )}
              >
                <div
                  className={cn(
                    "flex size-20 items-center justify-center rounded-full",
                    isDarkTheme ? "bg-amber-400/20" : "bg-rose-500/20"
                  )}
                >
                  <Gift
                    className={cn(
                      "size-10",
                      isDarkTheme ? "text-amber-300" : "text-rose-500"
                    )}
                  />
                </div>
                <p
                  className={cn(
                    "text-base",
                    isDarkTheme ? "text-slate-200" : "text-zinc-600"
                  )}
                >
                  Seu presente especial
                </p>
                <h3
                  className={cn(
                    "text-2xl font-bold",
                    isDarkTheme ? "text-white" : "text-zinc-900"
                  )}
                >
                  {currentSlide.companyName}
                </h3>
                <p
                  className={cn(
                    "text-5xl font-bold",
                    isDarkTheme ? "text-amber-300" : "text-rose-600"
                  )}
                >
                  R$ {currentSlide.amount}
                </p>
                <Button
                  size="lg"
                  className={cn(
                    "mt-4 text-base",
                    isDarkTheme
                      ? "bg-amber-400 text-slate-900 hover:bg-amber-300"
                      : "bg-rose-500 text-white hover:bg-rose-600"
                  )}
                >
                  Resgatar presente
                </Button>
              </article>
            )}
          </div>
        )}

        {slides.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? cn(
                        "w-8",
                        isDarkTheme ? "bg-amber-400" : "bg-rose-500"
                      )
                    : cn(
                        "w-2",
                        isDarkTheme ? "bg-white/40" : "bg-zinc-400/60"
                      )
                )}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrevSlide}
            className={cn(
              "fixed left-4 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-sm transition-all hover:scale-110",
              isDarkTheme
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-black/10 text-zinc-700 hover:bg-black/20"
            )}
            aria-label="Slide anterior"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={handleNextSlide}
            className={cn(
              "fixed right-4 top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-sm transition-all hover:scale-110",
              isDarkTheme
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-black/10 text-zinc-700 hover:bg-black/20"
            )}
            aria-label="Proximo slide"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {selectedAudio && hasInteracted && (
        <button
          type="button"
          onClick={handleToggleAudio}
          className={cn(
            "fixed bottom-6 right-6 z-20 flex size-14 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110",
            isDarkTheme
              ? "bg-amber-400/90 text-slate-900"
              : "bg-rose-500/90 text-white"
          )}
          aria-label={isPlaying ? "Pausar musica" : "Tocar musica"}
        >
          {isPlaying ? (
            <Volume2 className="size-6" />
          ) : (
            <VolumeX className="size-6" />
          )}
        </button>
      )}

      <div
        className={cn(
          "fixed bottom-6 left-6 z-20 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm",
          isDarkTheme
            ? "bg-white/10 text-white/80"
            : "bg-black/10 text-zinc-700"
        )}
      >
        {activeIndex + 1} / {slides.length}
      </div>
    </div>
  );
}
