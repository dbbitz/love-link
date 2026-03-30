import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, HeartCrack } from "lucide-react";

import { getPresentationById } from "@/features/creation/services/presentationRepository";
import type { PresentationRecord } from "@/features/creation/types";
import { PresentationViewer } from "@/features/presentation/components/PresentationViewer";
import { cn } from "@/lib/utils";

type PageState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; presentation: PresentationRecord };

export function PresentationViewPage() {
  const { userId, presentationId } = useParams<{
    userId: string;
    presentationId: string;
  }>();
  const [pageState, setPageState] = useState<PageState>({ status: "loading" });

  useEffect(() => {
    if (!userId || !presentationId) {
      setPageState({ status: "error", message: "Link invalido" });
      return;
    }

    let cancelled = false;

    async function loadPresentation() {
      try {
        const presentation = await getPresentationById(userId!, presentationId!);

        if (cancelled) return;

        if (!presentation) {
          setPageState({
            status: "error",
            message: "Apresentacao nao encontrada",
          });
          return;
        }

        setPageState({ status: "success", presentation });
      } catch (err) {
        if (cancelled) return;
        console.error("Erro ao carregar apresentacao:", err);
        setPageState({
          status: "error",
          message: "Erro ao carregar a apresentacao",
        });
      }
    }

    void loadPresentation();

    return () => {
      cancelled = true;
    };
  }, [userId, presentationId]);

  if (pageState.status === "loading") {
    return <LoadingState />;
  }

  if (pageState.status === "error") {
    return <ErrorState message={pageState.message} />;
  }

  return <PresentationViewer presentation={pageState.presentation} />;
}

function LoadingState() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-rose-200 via-pink-100 to-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Heart className="size-16 animate-pulse text-rose-500" />
          <div className="absolute inset-0 animate-ping">
            <Heart className="size-16 text-rose-400 opacity-50" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <p className="text-lg font-medium text-rose-700">
            Preparando sua surpresa...
          </p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "inline-block size-2 rounded-full bg-rose-400",
                  "animate-bounce"
                )}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 px-6">
      <div className="flex max-w-sm flex-col items-center gap-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-zinc-300/50">
          <HeartCrack className="size-10 text-zinc-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-zinc-800">{message}</h1>
          <p className="text-sm text-zinc-600">
            O link pode estar incorreto ou a apresentacao foi removida.
          </p>
        </div>
        <a
          href="/"
          className="mt-4 rounded-full bg-rose-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-600"
        >
          Voltar para o inicio
        </a>
      </div>
    </div>
  );
}
