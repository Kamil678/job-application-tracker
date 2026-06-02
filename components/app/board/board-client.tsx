"use client";

import { useState, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Plus,
  MoreHorizontal,
  Building2,
  MapPin,
  Calendar,
  GripVertical,
  SlidersHorizontal,
  Search,
  Banknote,
  ExternalLink,
  Briefcase,
  LayoutGrid,
  List,
  X,
  Globe,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Status = "wish_list" | "applied" | "interview" | "offer" | "rejected" | "ghost";
type WorkType = "remote" | "hybrid" | "onsite";
type ViewMode = "board" | "list";

interface JobApplication {
  _id: string;
  company: string;
  position: string;
  location?: string;
  workType: WorkType;
  status: Status;
  appliedDate?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  tags?: string[];
  notes?: string;
  jobUrl?: string;
}

interface KanbanColumn {
  _id: string;
  name: string;
  order: number;
  status: Status;
}

// ─── Static config ─────────────────────────────────────────────────────────────

const COLUMNS: KanbanColumn[] = [
  { _id: "1", name: "Wish List", order: 0, status: "wish_list" },
  { _id: "2", name: "Applied", order: 1, status: "applied" },
  { _id: "3", name: "Interviewing", order: 2, status: "interview" },
  { _id: "4", name: "Offer", order: 3, status: "offer" },
  { _id: "5", name: "Rejected", order: 4, status: "rejected" },
];

const STATUS_CONFIG: Record<
  Status,
  {
    label: string;
    bg: string;
    fg: string;
    dot: string;
    columnAccent: string;
    emptyIcon: string;
  }
> = {
  wish_list: {
    label: "Wish List",
    bg: "bg-muted",
    fg: "text-muted-foreground",
    dot: "bg-muted-foreground/60",
    columnAccent: "from-muted/40 to-transparent",
    emptyIcon: "✦",
  },
  applied: {
    label: "Applied",
    bg: "bg-status-applied-bg",
    fg: "text-status-applied-fg",
    dot: "bg-status-applied-fg",
    columnAccent: "from-status-applied-bg/30 to-transparent",
    emptyIcon: "→",
  },
  interview: {
    label: "Interviewing",
    bg: "bg-status-interview-bg",
    fg: "text-status-interview-fg",
    dot: "bg-status-interview-fg",
    columnAccent: "from-status-interview-bg/30 to-transparent",
    emptyIcon: "◎",
  },
  offer: {
    label: "Offer",
    bg: "bg-status-offer-bg",
    fg: "text-status-offer-fg",
    dot: "bg-status-offer-fg",
    columnAccent: "from-status-offer-bg/30 to-transparent",
    emptyIcon: "★",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-status-rejected-bg",
    fg: "text-status-rejected-fg",
    dot: "bg-status-rejected-fg",
    columnAccent: "from-status-rejected-bg/30 to-transparent",
    emptyIcon: "×",
  },
  ghost: {
    label: "Ghost",
    bg: "bg-status-ghost-bg",
    fg: "text-status-ghost-fg",
    dot: "bg-status-ghost-fg",
    columnAccent: "from-status-ghost-bg/30 to-transparent",
    emptyIcon: "◌",
  },
};

const WORK_TYPE_CONFIG: Record<WorkType, { label: string; icon: string }> = {
  remote: { label: "Remote", icon: "🌐" },
  hybrid: { label: "Hybrid", icon: "⚡" },
  onsite: { label: "On-site", icon: "🏢" },
};

// ─── Mock data ─────────────────────────────────────────────────────────────────

const INITIAL_APPS: JobApplication[] = [
  {
    _id: "a1",
    company: "Vercel",
    position: "Senior Frontend Engineer",
    location: "Remote",
    workType: "remote",
    status: "wish_list",
    tags: ["React", "Next.js", "TypeScript"],
    salaryMin: 150000,
    salaryMax: 190000,
    currency: "USD",
    jobUrl: "https://vercel.com/careers",
    notes: "Dream company — would love to work on Next.js itself.",
  },
  {
    _id: "a2",
    company: "Linear",
    position: "Product Designer",
    location: "San Francisco",
    workType: "hybrid",
    status: "wish_list",
    tags: ["Figma", "Design Systems", "Motion"],
  },
  {
    _id: "a3",
    company: "Stripe",
    position: "Full Stack Engineer",
    location: "New York",
    workType: "hybrid",
    status: "applied",
    appliedDate: "2025-05-10",
    tags: ["TypeScript", "Node.js", "Postgres"],
    salaryMin: 160000,
    salaryMax: 200000,
    currency: "USD",
  },
  {
    _id: "a4",
    company: "Notion",
    position: "Software Engineer",
    location: "Remote",
    workType: "remote",
    status: "applied",
    appliedDate: "2025-05-08",
    tags: ["React", "TypeScript"],
  },
  {
    _id: "a5",
    company: "Loom",
    position: "React Native Engineer",
    location: "Remote",
    workType: "remote",
    status: "applied",
    appliedDate: "2025-05-03",
    tags: ["React Native", "Expo"],
  },
  {
    _id: "a6",
    company: "Figma",
    position: "Frontend Engineer",
    location: "London",
    workType: "hybrid",
    status: "interview",
    appliedDate: "2025-04-28",
    tags: ["WebGL", "Canvas", "TypeScript"],
    salaryMin: 120000,
    salaryMax: 150000,
    currency: "GBP",
    notes: "Second round interview scheduled for May 30th. Prep system design.",
  },
  {
    _id: "a7",
    company: "Anthropic",
    position: "TypeScript Engineer",
    location: "Remote",
    workType: "remote",
    status: "interview",
    appliedDate: "2025-04-20",
    tags: ["AI", "TypeScript", "Python"],
  },
  {
    _id: "a8",
    company: "Arc",
    position: "Staff Engineer",
    location: "New York",
    workType: "onsite",
    status: "offer",
    appliedDate: "2025-04-01",
    tags: ["Swift", "Rust", "C++"],
    salaryMin: 220000,
    salaryMax: 260000,
    currency: "USD",
    notes: "Offer expires June 1st. Negotiating equity.",
  },
  {
    _id: "a9",
    company: "Raycast",
    position: "macOS Engineer",
    location: "Remote",
    workType: "remote",
    status: "rejected",
    appliedDate: "2025-04-15",
    tags: ["Swift", "Objective-C"],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatSalary(app: JobApplication): string | null {
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

function formatDate(ds?: string) {
  if (!ds) return null;
  return new Date(ds).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getInitials(company: string) {
  return company
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// Deterministic pastel from company name
function getCompanyColor(company: string): string {
  const colors = [
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  ];
  const idx = company.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
}

// ─── Job Card ──────────────────────────────────────────────────────────────────

function JobCard({
  app,
  onOpenDetail,
  isDragging,
  dragHandleProps,
}: {
  app: JobApplication;
  onOpenDetail: (app: JobApplication) => void;
  isDragging?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const salary = formatSalary(app);
  const date = formatDate(app.appliedDate);
  const cfg = STATUS_CONFIG[app.status];

  return (
    <Card
      className={cn(
        "group relative bg-card border border-border rounded-2xl p-4 transition-all duration-200",
        "hover:border-border/80 hover:shadow-md hover:-translate-y-0.5",
        "cursor-pointer select-none",
        isDragging && "opacity-50 scale-95 shadow-xl rotate-1",
      )}
      onClick={() => onOpenDetail(app)}
    >
      {/* Subtle top accent line */}
      <div
        className={cn(
          "absolute top-4 bottom-4 -left-0.5 w-0.5 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          cfg.dot.replace("bg-", "bg-"),
        )}
      />

      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-30 hover:!opacity-60 transition-opacity duration-200 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Logo */}
        <div
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold tracking-tight",
            getCompanyColor(app.company),
          )}
        >
          {getInitials(app.company)}
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight truncate">{app.position}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate font-medium">{app.company}</p>
        </div>

        {/* Context menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl">
            <DropdownMenuItem className="rounded-lg text-xs">View details</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg text-xs">Edit</DropdownMenuItem>
            {app.jobUrl && (
              <DropdownMenuItem className="rounded-lg text-xs gap-2">
                <ExternalLink className="h-3 w-3" /> Open job URL
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg text-xs text-destructive focus:text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Meta pills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {app.location && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-accent/60 rounded-lg px-2 py-0.5 border border-border/40">
            <MapPin className="h-2.5 w-2.5" />
            {app.location}
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-accent/60 rounded-lg px-2 py-0.5 border border-border/40">
          {WORK_TYPE_CONFIG[app.workType].icon} {WORK_TYPE_CONFIG[app.workType].label}
        </span>
        {date && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-accent/60 rounded-lg px-2 py-0.5 border border-border/40">
            <Calendar className="h-2.5 w-2.5" /> {date}
          </span>
        )}
      </div>

      {/* Salary */}
      {salary && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <Banknote className="h-3 w-3 text-muted-foreground/60 flex-shrink-0" />
          <span className="text-xs font-semibold text-foreground/80">{salary}</span>
        </div>
      )}

      {/* Tags */}
      {app.tags && app.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {app.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/50"
            >
              {tag}
            </span>
          ))}
          {app.tags.length > 3 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/50">
              +{app.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Notes indicator */}
      {app.notes && (
        <div className="mt-2.5 pt-2.5 border-t border-border/40">
          <p className="text-[11px] text-muted-foreground/70 line-clamp-1 italic">{app.notes}</p>
        </div>
      )}
    </Card>
  );
}

// ─── Column ────────────────────────────────────────────────────────────────────

function BoardColumn({
  column,
  applications,
  onOpenDetail,
  isOver,
}: {
  column: KanbanColumn;
  applications: JobApplication[];
  onOpenDetail: (app: JobApplication) => void;
  isOver?: boolean;
}) {
  const cfg = STATUS_CONFIG[column.status];
  const count = applications.length;

  return (
    <div className="flex flex-col w-[300px] flex-shrink-0 h-full">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", cfg.dot)} />
          <span className="text-sm font-bold text-foreground tracking-tight">{column.name}</span>
          <span
            className={cn(
              "inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-md text-[11px] font-semibold border",
              count > 0 ? `${cfg.bg} ${cfg.fg} border-transparent` : "bg-transparent text-muted-foreground/50 border-border/50",
            )}
          >
            {count}
          </span>
        </div>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs rounded-xl">
              Add to {column.name}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Drop zone */}
      <div
        className={cn(
          "flex flex-col gap-2.5 flex-1 rounded-2xl p-2.5 min-h-[120px] transition-all duration-200",
          "bg-secondary/30 border border-dashed border-border/40",
          isOver && "bg-secondary/60 border-solid border-border/80 scale-[1.01]",
        )}
      >
        {/* Gradient top accent */}
        <div className={cn("h-1 w-full rounded-full bg-gradient-to-r opacity-60", cfg.columnAccent)} />

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-8 gap-2 opacity-40">
            <span className="text-3xl leading-none">{cfg.emptyIcon}</span>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">No applications yet</p>
          </div>
        ) : (
          applications.map((app) => <JobCard key={app._id} app={app} onOpenDetail={onOpenDetail} />)
        )}

        {/* Add card shortcut at bottom of populated columns */}
        {applications.length > 0 && (
          <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent/40 transition-all duration-200 border border-transparent hover:border-border/30">
            <Plus className="h-3 w-3" />
            Add card
          </button>
        )}
      </div>
    </div>
  );
}

// ─── List Row ──────────────────────────────────────────────────────────────────

function ListRow({ app, onOpenDetail }: { app: JobApplication; onOpenDetail: (app: JobApplication) => void }) {
  const cfg = STATUS_CONFIG[app.status];
  const salary = formatSalary(app);
  const date = formatDate(app.appliedDate);

  return (
    <div
      className="group flex items-center gap-4 px-4 py-3 hover:bg-accent/40 rounded-xl transition-all duration-150 cursor-pointer border border-transparent hover:border-border/30"
      onClick={() => onOpenDetail(app)}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold",
          getCompanyColor(app.company),
        )}
      >
        {getInitials(app.company)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{app.position}</p>
        <p className="text-xs text-muted-foreground truncate">{app.company}</p>
      </div>

      <div className="hidden md:flex items-center gap-2 flex-shrink-0">
        {app.location && <span className="text-xs text-muted-foreground hidden lg:block">{app.location}</span>}
        <span className="text-xs text-muted-foreground">{WORK_TYPE_CONFIG[app.workType].label}</span>
      </div>

      {salary && <span className="hidden lg:block text-xs font-medium text-foreground/70 flex-shrink-0">{salary}</span>}

      {date && <span className="hidden md:block text-xs text-muted-foreground flex-shrink-0">{date}</span>}

      <span className={cn("flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium", cfg.bg, cfg.fg)}>
        {cfg.label}
      </span>

      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

// ─── Detail Sheet ──────────────────────────────────────────────────────────────

function DetailSheet({ app, open, onClose }: { app: JobApplication | null; open: boolean; onClose: () => void }) {
  if (!app) return null;
  const cfg = STATUS_CONFIG[app.status];
  const salary = formatSalary(app);
  const date = formatDate(app.appliedDate);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-md rounded-l-3xl border-l border-border bg-background p-0 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0",
                getCompanyColor(app.company),
              )}
            >
              {getInitials(app.company)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-foreground leading-tight">{app.position}</h2>
              <p className="text-sm text-muted-foreground">{app.company}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl flex-shrink-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Status */}
          <div>
            <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold", cfg.bg, cfg.fg)}>
              <div className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
              {cfg.label}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {app.location && (
              <div className="bg-secondary/40 rounded-2xl p-3 border border-border/50">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">Location</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {app.location}
                </p>
              </div>
            )}
            <div className="bg-secondary/40 rounded-2xl p-3 border border-border/50">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">Work type</p>
              <p className="text-sm font-semibold text-foreground">
                {WORK_TYPE_CONFIG[app.workType].icon} {WORK_TYPE_CONFIG[app.workType].label}
              </p>
            </div>
            {date && (
              <div className="bg-secondary/40 rounded-2xl p-3 border border-border/50">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">Applied</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {date}
                </p>
              </div>
            )}
            {salary && (
              <div className="bg-secondary/40 rounded-2xl p-3 border border-border/50">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium mb-1">Salary</p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Banknote className="h-3.5 w-3.5 text-muted-foreground" /> {salary}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {app.tags && app.tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Tech stack</p>
              <div className="flex flex-wrap gap-1.5">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-xl bg-accent text-foreground/80 border border-border/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {app.notes && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Notes</p>
              <div className="bg-secondary/40 rounded-2xl p-4 border border-border/50">
                <p className="text-sm text-foreground/80 leading-relaxed">{app.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            {app.jobUrl && (
              <Button variant="outline" className="w-full rounded-xl gap-2 h-10 border-border text-sm font-medium">
                <Globe className="h-4 w-4" /> View job posting
              </Button>
            )}
            <Button className="w-full rounded-xl gap-2 h-10 bg-primary text-primary-foreground text-sm font-medium">
              Edit application
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────────

function StatsBar({ applications }: { applications: JobApplication[] }) {
  const stats = COLUMNS.map((col) => ({
    ...col,
    count: applications.filter((a) => a.status === col.status).length,
  }));
  const total = applications.length;
  const offerRate = total > 0 ? Math.round((applications.filter((a) => a.status === "offer").length / total) * 100) : 0;

  return (
    <div className="flex items-center gap-6 px-6 py-2 border-b border-border/50 bg-background/60 overflow-x-auto scrollbar-none">
      {stats.map((s) => {
        const cfg = STATUS_CONFIG[s.status];
        return (
          <div key={s._id} className="flex items-center gap-2 flex-shrink-0">
            <div className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
            <span className="text-xs text-muted-foreground">{s.name}</span>
            <span className={cn("text-xs font-bold", cfg.fg, s.count === 0 && "text-muted-foreground/40")}>{s.count}</span>
          </div>
        );
      })}
      <div className="ml-auto flex-shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        <span>
          <span className="font-bold text-foreground">{offerRate}%</span> offer rate
        </span>
      </div>
    </div>
  );
}

// ─── Main Board Client ─────────────────────────────────────────────────────────

export function BoardClient() {
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPS);
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = applications.filter(
    (a) =>
      !search ||
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.position.toLowerCase().includes(search.toLowerCase()) ||
      a.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  const handleOpenDetail = (app: JobApplication) => {
    setSelectedApp(app);
    setSheetOpen(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">Job Hunt</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">
                {filtered.length} application{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:flex items-center">
            <Search className="absolute left-2.5 h-3 w-3 text-muted-foreground pointer-events-none" />
            <Input
              id="searchApplications"
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
              className="hidden sm:flex w-60 h-10 bg-card border-border px-7 focus-visible:ring-ring"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 cursor-pointer">
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex items-center  rounded-lg border border-border/50">
            <Tooltip>
              <TooltipTrigger
                onClick={() => setViewMode("board")}
                className={cn(
                  "h-10 w-10 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer",
                  viewMode === "board" ? "bg-primary shadow-sm text-primary-foreground" : "text-muted-foreground hover:text-primary",
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Board
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                onClick={() => setViewMode("list")}
                className={cn(
                  "h-10 w-10 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer",
                  viewMode === "list" ? "bg-primary shadow-sm text-primary-foreground" : "text-muted-foreground hover:text-primary",
                )}
              >
                <List className="h-3.5 w-3.5" />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                List
              </TooltipContent>
            </Tooltip>
          </div>

          <Button variant="outline" size="lg" className="hidden sm:flex">
            <SlidersHorizontal className="h-3 w-3" />
            Filter
          </Button>
        </div>
      </div>

      {/* ── Mobile search ── */}
      <div className="sm:hidden px-4 py-2 border-b border-border/40">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applications…"
            className="w-full h-9 rounded-xl bg-secondary/60 border border-border text-sm pl-9 pr-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3">
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* ── Board view ── */}
      {viewMode === "board" && (
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <div className="flex gap-4 p-5 sm:p-6 min-w-max h-full items-start">
            {COLUMNS.map((col) => (
              <BoardColumn
                key={col._id}
                column={col}
                applications={filtered.filter((a) => a.status === col.status)}
                onOpenDetail={handleOpenDetail}
              />
            ))}
            {/* Add column button */}
            <div className="flex-shrink-0 w-[300px]">
              <button className="w-full h-10 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border/40 text-xs text-muted-foreground/50 hover:text-muted-foreground hover:border-border/70 hover:bg-accent/20 transition-all duration-200">
                <Plus className="h-3.5 w-3.5" />
                Add column
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── List view ── */}
      {viewMode === "list" && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            {/* List header */}
            <div className="hidden md:grid grid-cols-[1fr_120px_80px_120px_100px_32px] gap-4 px-4 mb-2">
              {["Role", "Location", "Type", "Salary", "Status", ""].map((h) => (
                <span key={h} className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60">
                  {h}
                </span>
              ))}
            </div>

            {COLUMNS.map((col) => {
              const colApps = filtered.filter((a) => a.status === col.status);
              if (colApps.length === 0) return null;
              const cfg = STATUS_CONFIG[col.status];
              return (
                <div key={col._id} className="mb-6">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{col.name}</span>
                    <span className={cn("text-xs font-bold", cfg.fg)}>{colApps.length}</span>
                  </div>
                  <div className="space-y-0.5">
                    {colApps.map((app) => (
                      <ListRow key={app._id} app={app} onOpenDetail={handleOpenDetail} />
                    ))}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-3 opacity-50">
                <Building2 className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No applications found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Detail Sheet ── */}
      <DetailSheet app={selectedApp} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}
