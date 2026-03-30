import { useRef, useState, type ChangeEvent } from "react";
import { ChevronRight, Music2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PresentationAudio } from "@/features/creation/types";

interface MusicSelectorProps {
  selectedAudio: PresentationAudio | null;
  onSelectAudio: (file: File) => void;
}

export function MusicSelector({
  selectedAudio,
  onSelectAudio,
}: MusicSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenPicker = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onSelectAudio(file);
    }

    event.target.value = "";
  };

  return (
    <section className="space-y-2">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left transition-colors hover:bg-zinc-100"
      >
        <div className="min-w-0 space-y-0.5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <Music2 className="size-4 text-rose-500" />
            Musica da apresentacao
          </p>
          <p className="truncate text-xs text-zinc-600">
            {selectedAudio
              ? selectedAudio.name
              : "Sem musica na apresentacao"}
          </p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-zinc-500" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="top-auto bottom-0 w-[calc(100%-1rem)] max-h-[86vh] max-w-md -translate-x-1/2 translate-y-0 overflow-y-auto rounded-b-none rounded-t-2xl p-5 sm:max-w-md">
          <DialogHeader className="pr-7">
            <DialogTitle>Configurar musica</DialogTitle>
            <DialogDescription>
              Escolha um audio para tocar durante a apresentacao.
            </DialogDescription>
          </DialogHeader>

          {selectedAudio ? (
            <div className="space-y-2 rounded-lg border border-rose-200 bg-rose-50 p-3">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {selectedAudio.name}
              </p>
              <audio controls src={selectedAudio.url} className="h-10 w-full" />
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-3 text-sm text-zinc-500">
              A apresentacao nao possui musica selecionada.
            </p>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleInputChange}
          />

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-center gap-2"
            onClick={handleOpenPicker}
          >
            <Upload className="size-4" />
            {selectedAudio ? "Trocar musica" : "Adicionar musica"}
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
