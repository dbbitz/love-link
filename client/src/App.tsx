import { Navigate, Route, Routes } from "react-router-dom";

import { CreationPage } from "@/features/creation/pages/CreationPage";
import { LandingPage } from "@/features/landing/pages/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/create" element={<CreationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
