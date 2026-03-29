import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { CreationEditor } from "@/features/creation/components/CreationEditor";
import { CreationOverview } from "@/features/creation/components/CreationOverview";
import type { GiftItem, SelectedGiftCard } from "@/features/creation/types";

export function CreationPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<GiftItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedGiftCard, setSelectedGiftCard] =
    useState<SelectedGiftCard | null>(null);
  const [draftText, setDraftText] = useState("");
  const objectUrlsRef = useRef<string[]>([]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId]
  );

  useEffect(() => {
    const objectUrls = objectUrlsRef;
    return () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleAddImages = useCallback((files: File[]) => {
    const mappedItems: GiftItem[] = files.map((file) => {
      const imageUrl = URL.createObjectURL(file);
      objectUrlsRef.current.push(imageUrl);

      return {
        id: crypto.randomUUID(),
        image: imageUrl,
        text: "",
      };
    });

    setItems((prevItems) => [...prevItems, ...mappedItems]);
  }, []);

  const handleSelectItem = useCallback(
    (itemId: string) => {
      const currentItem = items.find((item) => item.id === itemId);
      setDraftText(currentItem?.text ?? "");
      setSelectedItemId(itemId);
    },
    [items]
  );

  const handleSaveAndBack = useCallback(() => {
    if (!selectedItemId) return;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === selectedItemId ? { ...item, text: draftText } : item
      )
    );
    setDraftText("");
    setSelectedItemId(null);
  }, [draftText, selectedItemId]);

  const handleCancelEditing = useCallback(() => {
    setDraftText("");
    setSelectedItemId(null);
  }, []);

  const handleSaveGiftCard = useCallback((giftCardSelection: SelectedGiftCard) => {
    setSelectedGiftCard(giftCardSelection);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md p-4">
        <div className="mb-4">
          <Button
            type="button"
            variant="ghost"
            className="gap-2 px-2 text-zinc-700"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="size-4" />
            Voltar para inicio
          </Button>
        </div>

        {selectedItem ? (
          <CreationEditor
            item={selectedItem}
            draftText={draftText}
            onDraftTextChange={setDraftText}
            onSave={handleSaveAndBack}
            onCancel={handleCancelEditing}
          />
        ) : (
          <CreationOverview
            items={items}
            onAddImages={handleAddImages}
            onSelectItem={handleSelectItem}
            selectedGiftCard={selectedGiftCard}
            onSaveGiftCard={handleSaveGiftCard}
          />
        )}
      </div>
    </main>
  );
}
