"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavBadge } from "./nav-badge";
import { isNavItemActive, type NavItemConfig } from "./nav-config";

interface NavItemProps extends NavItemConfig {
  onNavigate?: () => void;
}

export function NavItem({ href, icon: Icon, label, badge, badgeVariant, onNavigate }: NavItemProps) {
  const pathname = usePathname();
  const active = isNavItemActive(href, pathname);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg",
        "text-[13.5px] font-medium transition-colors relative mb-px",
        active ? "text-sidebar-foreground" : "text-sidebar-text hover:bg-sidebar-accent hover:text-sidebar-foreground",
      )}
    >
      {active && (
        <span aria-hidden="true" className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-4.5 bg-sidebar-primary rounded-r-full" />
      )}
      <Icon size={17} className="shrink-0" aria-hidden="true" />
      {label}
      {badge && badgeVariant && <NavBadge variant={badgeVariant}>{badge}</NavBadge>}
    </Link>
  );
}
