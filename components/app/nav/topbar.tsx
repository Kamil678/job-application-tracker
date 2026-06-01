"use client";

import { usePathname } from "next/navigation";
import { Menu, Search, Bell, Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PAGE_TITLES } from "./nav-config";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface AppTopbarProps {
  onMenuOpen: () => void;
  onAddApplication: () => void;
}

export function AppTopbar({ onMenuOpen, onAddApplication }: AppTopbarProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "App";

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

      <div className="relative">
        <Button variant="outline" size="lg" aria-label="Notifications">
          <Bell size={15} />
        </Button>
      </div>

      <Button size="lg" onClick={onAddApplication}>
        <Plus size={14} aria-hidden="true" />
        <span className="hidden sm:inline">Add application</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </header>
  );
}
