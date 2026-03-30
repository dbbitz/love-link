import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/shared/auth/AuthContext";

export function BillingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <section className="mx-auto w-full max-w-md rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-center">
          <h1 className="text-xl font-semibold text-zinc-900">
            Voce nao esta logado
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Entre para visualizar opcoes de pagamento.
          </p>
          <Button
            className="mt-4 bg-rose-500 text-white hover:bg-rose-600"
            onClick={() => navigate("/login")}
          >
            Entrar/Cadastrar
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <section className="mx-auto w-full max-w-md rounded-xl border border-zinc-200 bg-zinc-50 p-5">
        <h1 className="text-xl font-semibold text-zinc-900">Pagamento</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Esta secao e mockada para futuras opcoes de checkout e historico.
        </p>
      </section>
    </main>
  );
}
