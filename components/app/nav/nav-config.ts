import { LayoutDashboard, FileText, Kanban, Calendar, BarChart3, Bot, Star, FileUser, Settings, type LucideIcon } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeVariant = "primary" | "warning" | "info";

export interface NavItemConfig {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
}

export interface NavSection {
  label: string;
  items: NavItemConfig[];
}

export interface User {
  name: string;
  email: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAV: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/app/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        href: "/app/applications",
        icon: FileText,
        label: "Applications",
        badge: "24",
        badgeVariant: "primary",
      },
      {
        href: "/app/board",
        icon: Kanban,
        label: "Board",
      },
      {
        href: "/app/calendar",
        icon: Calendar,
        label: "Calendar",
        badge: "3",
        badgeVariant: "warning",
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        href: "/app/settings",
        icon: Settings,
        label: "Settings",
      },
    ],
  },
];

// ─── Page titles (used in topbar) ─────────────────────────────────────────────

export const PAGE_TITLES: Record<string, string> = {
  "/app/dashboard": "Dashboard",
  "/applications": "Applications",
  "/app/kanban": "Kanban",
  "/app/calendar": "Calendar",
  "/app/settings": "Settings",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns up to 2 uppercase initials from a full name. */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Returns true when the nav item's href matches the current pathname. */
export function isNavItemActive(href: string, pathname: string): boolean {
  return href === "/app/dashboard" ? pathname === "/app/dashboard" : pathname.startsWith(href);
}
