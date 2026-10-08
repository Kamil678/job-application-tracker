import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { JobApplicationInterface } from "@/features/board/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(app: JobApplicationInterface): string | null {
  if (!app.salaryMin && !app.salaryMax) return null;
  const cur = app.currency ?? "USD";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
      maximumFractionDigits: 0,
      notation: "compact",
    }).format(n);
  if (app.salaryMin && app.salaryMax) return `${fmt(app.salaryMin)} – ${fmt(app.salaryMax)}`;
  if (app.salaryMin) return `from ${fmt(app.salaryMin)}`;
  return `up to ${fmt(app.salaryMax!)}`;
}

export function formatDate(ds?: string) {
  if (!ds) return null;
  return new Date(ds).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getInitials(company: string) {
  return company
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// Deterministic pastel from company name
export function getCompanyColor(company: string): string {
  const colors = [
    "bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300",
    "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-500/25 dark:text-rose-300",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-300",
    "bg-teal-100 text-teal-700 dark:bg-teal-500/25 dark:text-teal-300",
    "bg-orange-100 text-orange-700 dark:bg-orange-500/25 dark:text-orange-300",
  ];
  const idx = company.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
}
