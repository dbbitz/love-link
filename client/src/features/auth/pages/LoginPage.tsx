import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/shared/auth/AuthContext";
import { getAuthErrorMessage } from "@/features/auth/utils/authErrorMessage";

interface LoginLocationState {
  fromPath?: string;
  fromState?: unknown;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, isAuthenticated, isLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const redirectPath = useMemo(() => {
    const state = location.state as LoginLocationState | null;
    if (state?.fromPath && state.fromPath !== "/login") {
      return state.fromPath;
    }

    return "/create";
  }, [location.state]);
  const redirectState = useMemo(() => {
    const state = location.state as LoginLocationState | null;
    return state?.fromState;
  }, [location.state]);

  useEffect(() => {
    if (!isAuthenticated) return;
    navigate(redirectPath, { replace: true, state: redirectState });
  }, [isAuthenticated, navigate, redirectPath, redirectState]);

  const isBusy = isLoading || isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || password.length < 6) {
      setAuthError("Informe e-mail e senha com ao menos 6 caracteres.");
      return;
    }

    setAuthError(null);
    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
      navigate(redirectPath, { replace: true, state: redirectState });
    } catch (error) {
      setAuthError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <section className="mx-auto w-full max-w-md rounded-xl border border-zinc-200 bg-zinc-50 p-5">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-900">
            {mode === "signin" ? "Entrar" : "Cadastrar"}
          </h1>
          <p className="text-sm text-zinc-600">
            Autenticacao real via Firebase.
          </p>
        </header>

        <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700">E-mail</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@email.com"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-700">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {authError && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {authError}
            </p>
          )}

          <Button
            type="submit"
            className="h-11 w-full bg-rose-500 text-white hover:bg-rose-600"
            disabled={isBusy}
          >
            {isBusy
              ? "Processando..."
              : mode === "signin"
                ? "Entrar"
                : "Criar conta"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full"
            onClick={() => {
              setMode((prev) => (prev === "signin" ? "signup" : "signin"));
              setAuthError(null);
            }}
            disabled={isBusy}
          >
            {mode === "signin"
              ? "Nao tem conta? Cadastre-se"
              : "Ja tem conta? Entrar"}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Voltar para{" "}
          <Link to="/" className="font-medium text-rose-600">
            inicio
          </Link>
        </p>
      </section>
    </main>
  );
}
