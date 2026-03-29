import type { ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-8 sm:px-6">
      {children}
    </div>
  );
}
