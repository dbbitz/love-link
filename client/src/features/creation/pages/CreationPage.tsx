import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { CreationEditor } from "@/features/creation/components/CreationEditor";
import { CreationOverview } from "@/features/creation/components/CreationOverview";
import type {
  CreationDraft,
  GiftItem,
  PresentationAudio,
  PresentationThemeId,
  SelectedGiftCard,
} from "@/features/creation/types";
interface CreationLocationState {
  draft?: CreationDraft;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Falha ao ler arquivo."));
      }
    };
    reader.onerror = () => reject(new Error("Falha ao ler arquivo."));
    reader.readAsDataURL(file);
  });
}

export function CreationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as CreationLocationState | null;
  const initialDraft = locationState?.draft;

  const [items, setItems] = useState<GiftItem[]>(initialDraft?.items ?? []);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedGiftCard, setSelectedGiftCard] =
    useState<SelectedGiftCard | null>(initialDraft?.selectedGiftCard ?? null);
  const [selectedAudio, setSelectedAudio] = useState<PresentationAudio | null>(
    initialDraft?.selectedAudio ?? null
  );
  const [selectedThemeId, setSelectedThemeId] =
    useState<PresentationThemeId>(initialDraft?.selectedThemeId ?? "romantic-hearts");
  const [draftText, setDraftText] = useState("");

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId]
  );

  const handleAddImages = useCallback(async (files: File[]) => {
    const mappedItems: GiftItem[] = await Promise.all(
      files.map(async (file) => ({
        id: crypto.randomUUID(),
        image: await fileToDataUrl(file),
        text: "",
      }))
    );

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

  const handleSelectAudio = useCallback(async (file: File) => {
    setSelectedAudio({
      name: file.name,
      type: file.type,
      url: await fileToDataUrl(file),
    });
  }, []);

  const handleStartFinalize = useCallback(() => {
    const draft: CreationDraft = {
      items,
      selectedGiftCard,
      selectedAudio,
      selectedThemeId,
    };

    navigate("/create/finalize", { state: { draft } });
  }, [items, navigate, selectedAudio, selectedGiftCard, selectedThemeId]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md p-4">
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
            selectedAudio={selectedAudio}
            onSelectAudio={handleSelectAudio}
            selectedThemeId={selectedThemeId}
            onSelectTheme={setSelectedThemeId}
            canFinalize={items.length > 0}
            onFinalize={handleStartFinalize}
          />
        )}
      </div>
    </main>
  );
}
