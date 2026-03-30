import { useMemo, useState } from "react";
import { ChevronRight, Palette } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPresentationThemeById, presentationThemes } from "@/features/creation/constants/presentationThemes";
import type { PresentationThemeId } from "@/features/creation/types";

interface ThemeSelectorProps {
  selectedThemeId: PresentationThemeId;
  onSelectTheme: (themeId: PresentationThemeId) => void;
}

export function ThemeSelector({
  selectedThemeId,
  onSelectTheme,
}: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedTheme = useMemo(
    () => getPresentationThemeById(selectedThemeId),
    [selectedThemeId]
  );

  return (
    <section className="space-y-2">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left transition-colors hover:bg-zinc-100"
      >
        <div className="min-w-0 space-y-0.5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <Palette className="size-4 text-rose-500" />
            Tematica da apresentacao
          </p>
          <p className="truncate text-xs text-zinc-600">{selectedTheme.name}</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-zinc-500" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="top-auto bottom-0 w-[calc(100%-1rem)] max-h-[86vh] max-w-md -translate-x-1/2 translate-y-0 overflow-y-auto rounded-b-none rounded-t-2xl p-5 sm:max-w-md">
          <DialogHeader className="pr-7">
            <DialogTitle>Escolha a tematica</DialogTitle>
            <DialogDescription>
              Defina o estilo visual com fundos, bordas e elementos decorativos.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-2">
            {presentationThemes.map((theme) => {
              const isSelected = selectedThemeId === theme.id;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    isSelected
                      ? "border-rose-300 bg-rose-50"
                      : "border-zinc-200 bg-white hover:bg-zinc-50"
                  }`}
                >
                  <div
                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-md border ${theme.previewGradientClass}`}
                  >
                    <span className="absolute top-1 left-1 text-xs">
                      {theme.decorations[0]}
                    </span>
                    <span className="absolute right-1 bottom-1 text-xs">
                      {theme.decorations[1]}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900">
                      {theme.name}
                    </p>
                    <p className="truncate text-xs text-zinc-600">
                      {theme.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
