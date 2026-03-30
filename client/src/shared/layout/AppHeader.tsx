import { useState } from "react";
import { ArrowLeft, CreditCard, LogOut, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/shared/auth/AuthContext";

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOpenLogin = () => {
    navigate("/login", { state: { fromPath: location.pathname } });
  };

  const handleSignOut = () => {
    void signOut();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Button
          type="button"
          variant="ghost"
          className="h-9 gap-2 px-2 text-zinc-700"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="size-4" />
          Voltar para inicio
        </Button>

        {!isAuthenticated ? (
          <Button
            type="button"
            className="h-9 bg-rose-500 text-white hover:bg-rose-600"
            onClick={handleOpenLogin}
          >
            Entrar/Cadastrar
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              className="h-9 gap-2"
              onClick={() => setMenuOpen(true)}
            >
              <UserRound className="size-4" />
              {user?.displayName ?? "Minha conta"}
            </Button>

            <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
              <DialogContent className="top-auto bottom-0 w-[calc(100%-1rem)] max-w-md -translate-x-1/2 translate-y-0 rounded-b-none rounded-t-2xl p-5 sm:max-w-md">
                <DialogHeader className="pr-7">
                  <DialogTitle>Conta</DialogTitle>
                  <DialogDescription>
                    Logado como {user?.email ?? "usuario"}.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <UserRound className="size-4" />
                    Perfil
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/billing");
                    }}
                  >
                    <CreditCard className="size-4" />
                    Pagamento
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    className="justify-start gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="size-4" />
                    Sair
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </header>
  );
}
