"use client";

import { ChevronRight } from "lucide-react";
import { cn, formatDate, formatSalary, getCompanyColor, getInitials } from "@/lib/utils";
import { COLUMNS_CONFIG } from "../constants/columns-config";
import { WORK_TYPE_CONFIG } from "../constants/work-type-config";
import type { JobApplicationInterface } from "../types/types";

interface ListRowProps {
  app: JobApplicationInterface;
  onOpen: (app: JobApplicationInterface) => void;
}

export function ListRow({ app, onOpen }: ListRowProps) {
  const cfg = COLUMNS_CONFIG[app.status];
  const salary = formatSalary(app);
  const date = formatDate(app.appliedDate);

  return (
    <button
      type="button"
      onClick={() => onOpen(app)}
      className="group w-full text-left flex items-center gap-4 px-4 py-3 rounded-xl border border-transparent transition-all duration-150 hover:bg-accent/40 hover:border-border/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden="true"
        className={cn("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold", getCompanyColor(app.company))}
      >
        {getInitials(app.company)}
      </span>

      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-foreground truncate">{app.position}</span>
        <span className="block text-xs text-muted-foreground truncate">{app.company}</span>
      </span>

      <span className="hidden md:flex items-center gap-2 shrink-0">
        {app.location && <span className="text-xs text-muted-foreground hidden lg:block">{app.location}</span>}
        <span className="text-xs text-muted-foreground">{WORK_TYPE_CONFIG[app.workType].label}</span>
      </span>

      {salary && <span className="hidden lg:block text-xs font-medium text-foreground/70 shrink-0">{salary}</span>}

      {date && <span className="hidden md:block text-xs text-muted-foreground shrink-0">{date}</span>}

      <span className={cn("shrink-0 inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium", cfg.bg, cfg.fg)}>{cfg.label}</span>

      <ChevronRight
        aria-hidden="true"
        className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
      />
    </button>
  );
}
