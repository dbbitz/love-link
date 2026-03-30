import type {
  PresentationTheme,
  PresentationThemeId,
} from "@/features/creation/types";

export const presentationThemes: PresentationTheme[] = [
  {
    id: "romantic-hearts",
    name: "Romantico",
    description: "Fundo rosado com coracoes e borda delicada.",
    decorations: ["❤️", "💕", "💖"],
    previewGradientClass: "bg-gradient-to-br from-rose-200 via-pink-100 to-white",
    stageGradientClass: "bg-gradient-to-b from-rose-200 via-pink-100 to-white",
    frameClass: "border-rose-300 ring-rose-200/60",
    captionClass: "from-rose-950/85 via-rose-900/65",
  },
  {
    id: "butterfly-garden",
    name: "Jardim de Borboletas",
    description: "Visual leve com tons lilas, azul e borboletas.",
    decorations: ["🦋", "🌸", "✨"],
    previewGradientClass:
      "bg-gradient-to-br from-sky-200 via-violet-100 to-fuchsia-100",
    stageGradientClass:
      "bg-gradient-to-b from-sky-200 via-violet-100 to-fuchsia-100",
    frameClass: "border-violet-300 ring-violet-200/70",
    captionClass: "from-violet-950/85 via-violet-900/65",
  },
  {
    id: "sparkle-night",
    name: "Brilho Encantado",
    description: "Efeito noturno com brilho dourado e elegante.",
    decorations: ["✨", "🌟", "💫"],
    previewGradientClass:
      "bg-gradient-to-br from-indigo-300 via-slate-800 to-slate-900",
    stageGradientClass:
      "bg-gradient-to-b from-indigo-300 via-slate-800 to-slate-900",
    frameClass: "border-amber-300 ring-amber-200/60",
    captionClass: "from-slate-950/90 via-slate-900/70",
  },
];

export function getPresentationThemeById(
  themeId: PresentationThemeId
): PresentationTheme {
  return (
    presentationThemes.find((theme) => theme.id === themeId) ??
    presentationThemes[0]
  );
}
