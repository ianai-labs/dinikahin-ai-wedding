"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { ToastProvider } from "./ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider delay={300}>
          {children}
          <ToastProvider />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
