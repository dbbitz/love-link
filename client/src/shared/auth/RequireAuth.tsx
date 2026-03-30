import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/shared/auth/AuthContext";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto w-full max-w-md rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-center text-sm text-zinc-600">
          Carregando sessao...
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          fromPath: location.pathname,
          fromState: location.state,
        }}
      />
    );
  }

  return <>{children}</>;
}
