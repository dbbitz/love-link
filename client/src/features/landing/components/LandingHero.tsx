import { HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LandingHeroProps {
  onStart: () => void;
}

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <Card className="border-rose-200/60 bg-gradient-to-b from-rose-50 to-background shadow-sm">
      <CardContent className="space-y-6 px-6 py-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
          <HeartHandshake className="size-3.5" />
          Feito para emocionar quem voce ama
        </div>

        <div className="space-y-3">
          <h1 className="text-balance text-3xl leading-tight font-semibold tracking-tight text-zinc-900">
            Transforme suas memorias em um presente digital inesquecivel
          </h1>
          <p className="text-pretty text-base leading-relaxed text-zinc-600">
            Junte fotos, dedicatorias e uma trilha sonora especial em uma
            experiencia unica para surpreender alguem importante.
          </p>
        </div>

        <Button
          size="lg"
          className="h-14 w-full rounded-xl bg-rose-500 text-base font-semibold text-white hover:bg-rose-600"
          onClick={onStart}
        >
          Criar Presente Agora
        </Button>
      </CardContent>
    </Card>
  );
}
