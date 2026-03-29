import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { GiftItem } from "@/features/creation/types";

interface CreationEditorProps {
  item: GiftItem;
  draftText: string;
  onDraftTextChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function CreationEditor({
  item,
  draftText,
  onDraftTextChange,
  onSave,
  onCancel,
}: CreationEditorProps) {
  return (
    <section className="animate-in fade-in duration-300 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Edite sua mensagem
        </h1>
        <p className="text-sm text-zinc-600">
          Escreva uma dedicatoria para acompanhar esta foto.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
        <img
          src={item.image}
          alt="Foto selecionada"
          className="h-auto w-full max-h-[420px] object-cover"
        />
      </div>

      <Textarea
        value={draftText}
        onChange={(event) => onDraftTextChange(event.target.value)}
        placeholder="Digite aqui sua historia, recado ou dedicatoria..."
        className="min-h-32 text-base"
      />

      <div className="grid grid-cols-1 gap-2">
        <Button
          type="button"
          size="lg"
          className="h-12 bg-rose-500 text-white hover:bg-rose-600"
          onClick={onSave}
        >
          Salvar e Voltar
        </Button>
        <Button type="button" size="lg" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </section>
  );
}
