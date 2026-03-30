export type GiftCardAmount = 50 | 100 | 200;

export type GiftCardCompanyId = "eudora" | "renner" | "ifood";

export interface GiftItem {
  id: string;
  image: string;
  text: string;
}

export interface SelectedGiftCard {
  companyId: GiftCardCompanyId;
  companyName: string;
  amount: GiftCardAmount;
}

export interface GiftCardCompany {
  id: GiftCardCompanyId;
  name: string;
  description: string;
  values: GiftCardAmount[];
}

export interface PresentationAudio {
  name: string;
  url: string;
  type: string;
}

export type PresentationThemeId =
  | "romantic-hearts"
  | "butterfly-garden"
  | "sparkle-night";

export interface PresentationTheme {
  id: PresentationThemeId;
  name: string;
  description: string;
  decorations: string[];
  previewGradientClass: string;
  stageGradientClass: string;
  frameClass: string;
  captionClass: string;
}

export interface CreationDraft {
  items: GiftItem[];
  selectedGiftCard: SelectedGiftCard | null;
  selectedAudio: PresentationAudio | null;
  selectedThemeId: PresentationThemeId;
}

export interface PresentationRecord extends CreationDraft {
  id: string;
  ownerUid: string;
  status: "published";
}
