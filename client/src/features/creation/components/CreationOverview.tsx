import type { ChangeEvent } from "react";
import { Plus } from "lucide-react";

import { GiftCardSelector } from "@/features/creation/components/GiftCardSelector";
import type { GiftItem, SelectedGiftCard } from "@/features/creation/types";

interface CreationOverviewProps {
  items: GiftItem[];
  onAddImages: (files: File[]) => void;
  onSelectItem: (itemId: string) => void;
  selectedGiftCard: SelectedGiftCard | null;
  onSaveGiftCard: (giftCard: SelectedGiftCard) => void;
}

export function CreationOverview({
  items,
  onAddImages,
  onSelectItem,
  selectedGiftCard,
  onSaveGiftCard,
}: CreationOverviewProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length > 0) {
      onAddImages(files);
    }

    event.target.value = "";
  };

  return (
    <section className="animate-in fade-in duration-300 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Escolha suas fotos
        </h1>
        <p className="text-sm text-zinc-600">
          Toque em uma foto para adicionar uma dedicatoria.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectItem(item.id)}
            className="group relative aspect-square overflow-hidden rounded-md border border-zinc-200 transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
          >
            <img
              src={item.image}
              alt="Foto do presente"
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-1.5 pb-1 pt-4">
              <p className="truncate text-[10px] font-medium text-white">
                {item.text.trim() || "Sem dedicatoria"}
              </p>
            </div>
          </button>
        ))}

        <label className="aspect-square cursor-pointer rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-zinc-500 transition-colors hover:bg-zinc-100">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleInputChange}
          />
          <span className="flex size-full items-center justify-center">
            <Plus className="size-6" />
          </span>
        </label>
      </div>

      <GiftCardSelector
        selectedGiftCard={selectedGiftCard}
        onSaveGiftCard={onSaveGiftCard}
      />
    </section>
  );
}
