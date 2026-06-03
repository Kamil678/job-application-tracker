"use client";

import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AppSidebar } from "./sidebar";
import { AppTopbar } from "./topbar";
import type { User } from "./nav-config";

interface AppShellProps {
  user: User;
  children: React.ReactNode;
  onAddApplication?: () => void;
}

export function AppShell({ user, children, onAddApplication = () => {} }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex shrink-0">
        <AppSidebar user={user} />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-55 bg-sidebar border-sidebar-border">
          <AppSidebar user={user} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 overflow-hidden">
        <AppTopbar onMenuOpen={() => setMobileOpen(true)} onAddApplication={onAddApplication} />
        <main className="flex-1 overflow-y-auto bg-white p-5">{children}</main>
      </div>
    </div>
  );
}
