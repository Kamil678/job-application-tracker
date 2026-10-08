"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAGE_TITLES } from "./nav-config";
import { useApplicationDialog } from "@/features/applications/context";

interface AppTopbarProps {
  onMenuOpen: () => void;
}

export function AppTopbar({ onMenuOpen }: AppTopbarProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "App";
  const { openCreate } = useApplicationDialog();

  return (
    <header className="h-15 bg-card border-b border-border flex items-center gap-3 px-5 shrink-0">
      <button
        onClick={onMenuOpen}
        className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-[15px] font-semibold text-foreground flex-1">{title}</h1>

      <Button variant="outline" size="lg" aria-label="Notifications">
        <Bell size={15} />
      </Button>

      <Button size="lg" onClick={() => openCreate()}>
        <Plus size={14} aria-hidden="true" />
        <span className="hidden sm:inline">Add application</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </header>
  );
}
