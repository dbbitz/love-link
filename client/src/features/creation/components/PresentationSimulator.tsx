import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Eye, Gift, Pause, Play, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPresentationThemeById } from "@/features/creation/constants/presentationThemes";
import type {
  GiftItem,
  PresentationAudio,
  PresentationThemeId,
  SelectedGiftCard,
} from "@/features/creation/types";
import { cn } from "@/lib/utils";

interface PresentationSimulatorProps {
  items: GiftItem[];
  selectedGiftCard: SelectedGiftCard | null;
  selectedAudio: PresentationAudio | null;
  selectedThemeId: PresentationThemeId;
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

export function PresentationSimulator({
  items,
  selectedGiftCard,
  selectedAudio,
  selectedThemeId,
}: PresentationSimulatorProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const activeIndex =
    slides.length === 0 ? 0 : Math.min(currentIndex, slides.length - 1);
  const currentSlide = slides[activeIndex] ?? null;
  const selectedTheme = useMemo(
    () => getPresentationThemeById(selectedThemeId),
    [selectedThemeId]
  );
  const isDarkTheme = selectedTheme.id === "sparkle-night";

  useEffect(() => {
    const audioElement = audioRef.current;
    return () => {
      audioElement?.pause();
    };
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setIsOpen(open);
  };

  const handleToggleAudio = async () => {
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
  };

  const handleNextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <section className="space-y-2">
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left transition-colors hover:bg-zinc-100"
      >
        <div className="min-w-0 space-y-0.5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <Eye className="size-4 text-rose-500" />
            Simular apresentacao
          </p>
          <p className="truncate text-xs text-zinc-600">
            {slides.length > 0
              ? `${slides.length} slide(s) configurado(s)`
              : "Adicione fotos para visualizar a experiencia"}
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-zinc-500" />
      </button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="top-auto bottom-0 w-[calc(100%-1rem)] max-h-[88vh] max-w-md -translate-x-1/2 translate-y-0 overflow-y-auto rounded-b-none rounded-t-2xl p-5 sm:max-w-md">
          <DialogHeader className="pr-7">
            <DialogTitle>Simulacao do homenageado</DialogTitle>
            <DialogDescription>
              Navegue pelas fotos e textos para validar a experiencia final.
            </DialogDescription>
          </DialogHeader>

          <audio
            key={selectedAudio?.url ?? "no-audio"}
            ref={audioRef}
            src={selectedAudio?.url}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />

          {!currentSlide ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-5 text-sm text-zinc-500">
              Adicione pelo menos uma foto para iniciar a simulacao.
            </div>
          ) : (
            <div
              className={cn(
                "overflow-hidden rounded-xl border border-zinc-200",
                selectedTheme.stageGradientClass
              )}
            >
              {currentSlide.kind === "photo" ? (
                <article className="relative aspect-[9/12] overflow-hidden">
                  {selectedTheme.decorations.map((decoration, index) => {
                    const positions = [
                      "top-3 left-3",
                      "top-4 right-3",
                      "right-4 bottom-16",
                    ];
                    return (
                      <span
                        key={`${selectedTheme.id}-${decoration}-${index}`}
                        aria-hidden
                        className={cn(
                          "absolute z-10 text-lg",
                          positions[index % positions.length],
                          isDarkTheme ? "opacity-95" : "opacity-90"
                        )}
                      >
                        {decoration}
                      </span>
                    );
                  })}

                  <div
                    className={cn(
                      "absolute inset-2 rounded-[1.3rem] border-2 p-2 ring-2 backdrop-blur-[1px]",
                      selectedTheme.frameClass
                    )}
                  >
                    <div className="relative size-full overflow-hidden rounded-[1rem]">
                      <img
                        src={currentSlide.image}
                        alt="Foto da apresentacao"
                        className="size-full object-cover"
                      />

                      <div
                        className={cn(
                          "absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent p-3",
                          selectedTheme.captionClass
                        )}
                      >
                        <p className="text-sm leading-relaxed text-white">
                          {currentSlide.text.trim() || "Sem mensagem para esta foto."}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ) : (
                <article
                  className={cn(
                    "relative flex aspect-[9/12] flex-col items-center justify-center gap-3 p-4 text-center",
                    selectedTheme.stageGradientClass
                  )}
                >
                  {selectedTheme.decorations.map((decoration, index) => {
                    const positions = [
                      "top-4 left-4",
                      "top-5 right-4",
                      "right-5 bottom-8",
                    ];
                    return (
                      <span
                        key={`gift-${selectedTheme.id}-${decoration}-${index}`}
                        aria-hidden
                        className={cn(
                          "absolute z-10 text-xl",
                          positions[index % positions.length],
                          isDarkTheme ? "opacity-95" : "opacity-90"
                        )}
                      >
                        {decoration}
                      </span>
                    );
                  })}
                  <Gift
                    className={cn(
                      "size-9",
                      isDarkTheme ? "text-amber-300" : "text-rose-500"
                    )}
                  />
                  <p
                    className={cn(
                      "text-sm",
                      isDarkTheme ? "text-slate-200" : "text-zinc-600"
                    )}
                  >
                    Seu presente final
                  </p>
                  <h3
                    className={cn(
                      "text-xl font-semibold",
                      isDarkTheme ? "text-white" : "text-zinc-900"
                    )}
                  >
                    {currentSlide.companyName}
                  </h3>
                  <p
                    className={cn(
                      "text-3xl font-bold",
                      isDarkTheme ? "text-amber-300" : "text-rose-600"
                    )}
                  >
                    R$ {currentSlide.amount}
                  </p>
                  <Button className="mt-2 bg-rose-500 text-white hover:bg-rose-600">
                    Resgatar presente
                  </Button>
                </article>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2"
              disabled={!selectedAudio}
              onClick={handleToggleAudio}
            >
              {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
              {selectedAudio
                ? isPlaying
                  ? "Pausar musica"
                  : "Tocar musica"
                : "Sem musica selecionada"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 gap-2"
              disabled={slides.length <= 1}
              onClick={handleNextSlide}
            >
              <SkipForward className="size-4" />
              Passar foto/texto
            </Button>
          </div>

          {slides.length > 0 && (
            <p className="text-right text-xs text-zinc-500">
              Slide {activeIndex + 1} de {slides.length}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
