import type { ReactNode } from "react";
import { AuthBackground } from "@/components/auth/auth-background";
import { AuthBrandHeader } from "@/components/auth/auth-brand-header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden bg-sidebar">
      <AuthBackground />
      <div className="relative z-10 flex flex-col items-center w-full gap-8">
        <AuthBrandHeader />
        <main className="w-full max-w-120">{children}</main>
        <p className="text-xs text-sidebar-foreground opacity-50">© {new Date().getFullYear()} JAT. All rights reserved.</p>
      </div>
    </div>
  );
}
