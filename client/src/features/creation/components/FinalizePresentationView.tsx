import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createPresentation } from "@/features/creation/services/presentationRepository";
import type { CreationDraft } from "@/features/creation/types";
import { useAuth } from "@/shared/auth/AuthContext";

interface FinalizePresentationViewProps {
  draft: CreationDraft;
  onBack: () => void;
}

export function FinalizePresentationView({
  draft,
  onBack,
}: FinalizePresentationViewProps) {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [persistError, setPersistError] = useState<string | null>(null);

  const canGenerate = draft.items.length > 0;

  const projectSummary = useMemo(
    () => ({
      photos: draft.items.length,
      hasAudio: Boolean(draft.selectedAudio),
      hasGiftCard: Boolean(draft.selectedGiftCard),
      theme: draft.selectedThemeId,
    }),
    [draft]
  );

  const handleGenerateLink = async () => {
    if (!canGenerate || !user) return;

    setIsGenerating(true);
    setCopied(false);
    setPersistError(null);
    setGeneratedLink(null);

    try {
      console.log(user.uid, draft);
      const { shareLink } = await createPresentation(user.uid, draft);
      setGeneratedLink(shareLink);
    } catch (error) {
      console.error(error);
      setPersistError("Nao foi possivel salvar a apresentacao. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="animate-in fade-in duration-300 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Finalizar apresentacao
        </h1>
        <p className="text-sm text-zinc-600">
          Gere um link para compartilhar com a pessoa homenageada.
        </p>
      </header>

      <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-xs font-medium uppercase text-zinc-500">Resumo</p>
        <p className="text-sm text-zinc-700">Fotos: {projectSummary.photos}</p>
        <p className="text-sm text-zinc-700">
          Musica: {projectSummary.hasAudio ? "Configurada" : "Nao configurada"}
        </p>
        <p className="text-sm text-zinc-700">
          Gift card: {projectSummary.hasGiftCard ? "Selecionado" : "Nao selecionado"}
        </p>
        <p className="text-sm text-zinc-700">Tema: {projectSummary.theme}</p>
      </div>

      <Button
        type="button"
        size="lg"
        className="h-12 w-full bg-emerald-600 text-white hover:bg-emerald-700"
        disabled={!canGenerate || isGenerating || !user}
        onClick={handleGenerateLink}
      >
        <Link2 className="size-4" />
        {isGenerating ? "Salvando e gerando link..." : "Gerar link da apresentacao"}
      </Button>

      {!canGenerate && (
        <p className="text-sm text-amber-600">
          Adicione pelo menos uma foto antes de finalizar.
        </p>
      )}
      {persistError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {persistError}
        </p>
      )}

      {generatedLink && (
        <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800">
            Link gerado com sucesso
          </p>
          <div className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-zinc-700">
            {generatedLink}
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleCopy}
          >
            {copied ? <CheckCircle2 className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Link copiado" : "Copiar link"}
          </Button>
        </div>
      )}

      <Button type="button" variant="outline" className="w-full" onClick={onBack}>
        Voltar para edicao
      </Button>
    </section>
  );
}
