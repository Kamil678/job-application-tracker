import { LayoutDashboard, FileText, Kanban, Calendar, Settings, type LucideIcon } from "lucide-react";

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
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export const NAV: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        href: "/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        href: "/applications",
        icon: FileText,
        label: "Applications",
        badge: "24",
        badgeVariant: "primary",
      },
      {
        href: "/board",
        icon: Kanban,
        label: "Board",
      },
      {
        href: "/calendar",
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
        href: "/settings",
        icon: Settings,
        label: "Settings",
      },
    ],
  },
];

export const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/applications": "Applications",
  "/board": "Board",
  "/calendar": "Calendar",
  "/settings": "Settings",
};

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function isNavItemActive(href: string, pathname: string): boolean {
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
}
