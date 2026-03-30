import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/shared/auth/AuthContext";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <section className="mx-auto w-full max-w-md rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-center">
          <h1 className="text-xl font-semibold text-zinc-900">
            Voce nao esta logado
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Entre para acessar os dados de perfil.
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
        <h1 className="text-xl font-semibold text-zinc-900">Perfil</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Nome: {user?.displayName ?? "Nao informado"}
        </p>
        <p className="mt-1 text-sm text-zinc-600">E-mail: {user?.email}</p>
      </section>
    </main>
  );
}
