import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return <div className="w-full rounded-2xl px-8 py-8 shadow-xl shadow-black/20 bg-card border-border">{children}</div>;
}
