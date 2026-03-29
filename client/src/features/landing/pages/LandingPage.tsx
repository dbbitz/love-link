import { Gift, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { LandingHero } from "@/features/landing/components/LandingHero";
import { MobileContainer } from "@/shared/layout/MobileContainer";

export function LandingPage() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/create");
  };

  return (
    <main className="min-h-screen bg-background">
      <MobileContainer>
        <section className="mb-8 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-800">
            <Gift className="size-4 text-rose-500" />
            Love Link
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600">
            <Sparkles className="size-3.5 text-rose-500" />
            Presente digital
          </div>
        </section>

        <section className="space-y-4">
          <LandingHero onStart={handleStart} />
          <p className="px-1 text-center text-sm leading-relaxed text-zinc-500">
            Em poucos minutos voce cria um link compartilhavel com fotos,
            mensagens e um gift card especial.
          </p>
        </section>
      </MobileContainer>
    </main>
  );
}
