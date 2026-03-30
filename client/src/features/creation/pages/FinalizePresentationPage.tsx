import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { FinalizePresentationView } from "@/features/creation/components/FinalizePresentationView";
import type { CreationDraft } from "@/features/creation/types";

interface FinalizeLocationState {
  draft?: CreationDraft;
}

export function FinalizePresentationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as FinalizeLocationState | null;
  const draft = useMemo(() => locationState?.draft ?? null, [locationState]);

  useEffect(() => {
    if (!draft) {
      navigate("/create", { replace: true });
    }
  }, [draft, navigate]);

  if (!draft) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md p-4">
        <FinalizePresentationView
          draft={draft}
          onBack={() => navigate("/create", { state: { draft } })}
        />
      </div>
    </main>
  );
}
