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
