import { useMemo, useState } from "react";
import { Check, Gift, Store } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  GiftCardAmount,
  GiftCardCompany,
  GiftCardCompanyId,
  SelectedGiftCard,
} from "@/features/creation/types";

interface GiftCardSelectorProps {
  selectedGiftCard: SelectedGiftCard | null;
  onSaveGiftCard: (giftCard: SelectedGiftCard) => void;
}

const giftCardCompanies: GiftCardCompany[] = [
  {
    id: "eudora",
    name: "Eudora",
    description: "Beleza e autocuidado",
    values: [50, 100, 200],
  },
  {
    id: "renner",
    name: "Renner",
    description: "Moda e estilo",
    values: [50, 100, 200],
  },
  {
    id: "ifood",
    name: "iFood",
    description: "Comida para celebrar",
    values: [50, 100, 200],
  },
];

export function GiftCardSelector({
  selectedGiftCard,
  onSaveGiftCard,
}: GiftCardSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCompanyId, setActiveCompanyId] = useState<GiftCardCompanyId>(
    giftCardCompanies[0].id
  );
  const [activeAmount, setActiveAmount] = useState<GiftCardAmount | null>(null);

  const activeCompany = useMemo(
    () =>
      giftCardCompanies.find((company) => company.id === activeCompanyId) ??
      giftCardCompanies[0],
    [activeCompanyId]
  );

  const handleOpenChange = (open: boolean) => {
    if (open) {
      if (selectedGiftCard) {
        setActiveCompanyId(selectedGiftCard.companyId);
        setActiveAmount(selectedGiftCard.amount);
      } else {
        setActiveCompanyId(giftCardCompanies[0].id);
        setActiveAmount(null);
      }
    }

    setIsOpen(open);
  };

  const handleCompanySelect = (companyId: GiftCardCompanyId) => {
    const company = giftCardCompanies.find((item) => item.id === companyId);
    if (!company) return;

    setActiveCompanyId(companyId);
    setActiveAmount((prevAmount) =>
      prevAmount && company.values.includes(prevAmount) ? prevAmount : null
    );
  };

  const handleConfirmSelection = () => {
    if (!activeAmount || !activeCompany.values.includes(activeAmount)) return;

    onSaveGiftCard({
      companyId: activeCompany.id,
      companyName: activeCompany.name,
      amount: activeAmount,
    });
    setIsOpen(false);
  };

  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900">Gift card</h2>
          <p className="text-xs text-zinc-600">
            Escolha um cupom de presente para completar a surpresa.
          </p>
        </div>
        <Badge variant="outline">Mock</Badge>
      </div>

      {selectedGiftCard ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
          <p className="text-xs text-zinc-600">Cupom selecionado</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">
            {selectedGiftCard.companyName} - R$ {selectedGiftCard.amount}
          </p>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-3 text-sm text-zinc-500">
          Nenhum cupom selecionado.
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full justify-center gap-2"
        onClick={() => handleOpenChange(true)}
      >
        <Gift className="size-4" />
        {selectedGiftCard ? "Editar cupom" : "Adicionar cupom"}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="top-auto bottom-0 w-[calc(100%-1rem)] max-w-md -translate-x-1/2 translate-y-0 rounded-b-none rounded-t-2xl p-5 sm:max-w-md">
          <DialogHeader className="pr-7">
            <DialogTitle>Escolha seu gift card</DialogTitle>
            <DialogDescription>
              Selecione uma empresa e depois escolha um valor pre-definido.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase text-zinc-500">
              Empresas
            </p>
            <div className="grid grid-cols-1 gap-2">
              {giftCardCompanies.map((company) => (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => handleCompanySelect(company.id)}
                  className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    activeCompanyId === company.id
                      ? "border-rose-300 bg-rose-50"
                      : "border-zinc-200 bg-white hover:bg-zinc-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2">
                      <Store className="size-4 text-zinc-500" />
                      <span className="text-sm font-medium text-zinc-900">
                        {company.name}
                      </span>
                    </div>
                    {activeCompanyId === company.id && (
                      <Check className="size-4 text-rose-500" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {company.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase text-zinc-500">Valor</p>
            <div className="grid grid-cols-3 gap-2">
              {activeCompany.values.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveAmount(value)}
                  className={`rounded-lg border px-2 py-2 text-sm font-semibold transition-colors ${
                    activeAmount === value
                      ? "border-rose-300 bg-rose-500 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  R$ {value}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-rose-500 text-white hover:bg-rose-600"
              disabled={!activeAmount}
              onClick={handleConfirmSelection}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
