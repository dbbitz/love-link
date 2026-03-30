import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { BillingPage } from "@/features/account/pages/BillingPage";
import { ProfilePage } from "@/features/account/pages/ProfilePage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { CreationPage } from "@/features/creation/pages/CreationPage";
import { FinalizePresentationPage } from "@/features/creation/pages/FinalizePresentationPage";
import { LandingPage } from "@/features/landing/pages/LandingPage";
import { PresentationViewPage } from "@/features/presentation/pages/PresentationViewPage";
import { AuthProvider } from "@/shared/auth/AuthContext";
import { RequireAuth } from "@/shared/auth/RequireAuth";
import { AppHeader } from "@/shared/layout/AppHeader";

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isFullscreenRoute = location.pathname.startsWith("/present/");

  if (isFullscreenRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <AppHeader />
      <div className="pt-14">{children}</div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreationPage />} />
          <Route
            path="/create/finalize"
            element={
              <RequireAuth>
                <FinalizePresentationPage />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/billing"
            element={
              <RequireAuth>
                <BillingPage />
              </RequireAuth>
            }
          />
          <Route
            path="/present/:userId/:presentationId"
            element={<PresentationViewPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </AuthProvider>
  );
}

export default App;
