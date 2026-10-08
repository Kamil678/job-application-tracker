"use client";

import { useState, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
  MoreVertical,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ViewMode, JobApplicationInterface, KanbanColumn, InitialBoard } from "@/features/board/types/types";
import { useAddApplication } from "@/features/applications/context";
import { WORK_TYPE_CONFIG } from "../constants/work-type-config";
import { COLUMNS_CONFIG } from "../constants/columns-config";
import { formatSalary, formatDate, getInitials, getCompanyColor } from "@/lib/utils";
import { moveApplication } from "@/modules/actions/job-applications";
import { toast } from "sonner";

// ─── Static config ─────────────────────────────────────────────────────────────

// ─── Job Card ──────────────────────────────────────────────────────────────────

function JobCard({
  app,
  onOpenDetail,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  app: JobApplicationInterface;
  onOpenDetail: (app: JobApplicationInterface) => void;
  isDragging?: boolean;
  onDragStart: (appId: string) => void;
  onDragEnd: () => void;
}) {
  const salary = formatSalary(app);
  const date = formatDate(app.appliedDate);
  const cfg = COLUMNS_CONFIG[app.status];

  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", app._id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(app._id);
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group relative bg-card border border-border rounded-md p-4 transition-all duration-200",
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
        <div
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center text-[11px] font-bold tracking-tight",
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
  draggedId,
  onCardDragStart,
  onCardDragEnd,
  onColumnDragOver,
  onColumnDragLeave,
  onDropApplication,
}: {
  column: KanbanColumn;
  applications: JobApplicationInterface[];
  onOpenDetail: (app: JobApplicationInterface) => void;
  isOver?: boolean;
  draggedId: string | null;
  onCardDragStart: (appId: string) => void;
  onCardDragEnd: () => void;
  onColumnDragOver: (columnId: string) => void;
  onColumnDragLeave: () => void;
  onDropApplication: (appId: string, column: KanbanColumn) => void;
}) {
  const config = COLUMNS_CONFIG[column.status];
  const count = applications.length;
  const { openAddApplication } = useAddApplication();

  return (
    <div className="flex flex-col w-75 shrink-0 min-h-100">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", config.dot)} />
          <span className="text-sm font-bold text-foreground tracking-tight">{column.name}</span>
          <span
            className={cn(
              "inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-md text-[11px] font-semibold border",
              count > 0 ? `${config.bg} ${config.fg} border-transparent` : "bg-transparent text-muted-foreground/50 border-border/50",
            )}
          >
            {count}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-6 w-6")}>
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-fit">
              <DropdownMenuItem className="cursor-pointer" onClick={() => openAddApplication(column.status, column._id)}>
                <Plus className="mr-2 h-4 w-4" />
                Add application
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          onColumnDragOver(column._id);
        }}
        onDragLeave={onColumnDragLeave}
        onDrop={(e) => {
          e.preventDefault();
          const appId = e.dataTransfer.getData("text/plain");
          if (appId) onDropApplication(appId, column);
        }}
        className={cn(
          "flex flex-col gap-2.5 flex-1 rounded-2xl p-2.5 min-h-30 transition-all duration-200",
          "bg-secondary/30 border border-dashed border-border/40",
          isOver && "bg-secondary/60 border-solid border-border/80 scale-[1.01]",
        )}
      >
        {/* Gradient top accent */}
        <div className={cn("h-1 w-full rounded-full bg-linear-to-r opacity-60", config.columnAccent)} />

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-8 gap-2 opacity-40">
            <span className="text-3xl leading-none">{config.emptyIcon}</span>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">No applications yet</p>
          </div>
        ) : (
          applications.map((app) => (
            <JobCard
              key={app._id}
              app={app}
              onOpenDetail={onOpenDetail}
              isDragging={draggedId === app._id}
              onDragStart={onCardDragStart}
              onDragEnd={onCardDragEnd}
            />
          ))
        )}

        {/* Add card shortcut at bottom of populated columns */}
        <Button variant="outline" onClick={() => openAddApplication(column.status, column._id)}>
          <Plus size={14} aria-hidden="true" />
          <span className="hidden sm:inline">Add application</span>
          <span className="sm:hidden">Add</span>
        </Button>
        {/* {applications.length > 0 && (
          <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent/40 transition-all duration-200 border border-transparent hover:border-border/30">
            <Plus className="h-3 w-3" />
            Add card
          </button>
        )} */}
      </div>
    </div>
  );
}

// ─── List Row ──────────────────────────────────────────────────────────────────

function ListRow({ app, onOpenDetail }: { app: JobApplicationInterface; onOpenDetail: (app: JobApplicationInterface) => void }) {
  const cfg = COLUMNS_CONFIG[app.status];
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

function DetailSheet({ app, open, onClose }: { app: JobApplicationInterface | null; open: boolean; onClose: () => void }) {
  if (!app) return null;
  const cfg = COLUMNS_CONFIG[app.status];
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

// ─── Main Board Client ─────────────────────────────────────────────────────────

interface KanbanBoardProps {
  initialBoard: InitialBoard;
  userId: string;
}

export function KanbanBoard({ initialBoard, userId }: KanbanBoardProps) {
  const [applications, setApplications] = useState<JobApplicationInterface[]>(initialBoard.applications);
  const [syncedApplications, setSyncedApplications] = useState(initialBoard.applications);
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<JobApplicationInterface | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const { setBoardId } = useAddApplication();

  useEffect(() => {
    if (initialBoard._id) setBoardId(initialBoard._id);
  }, [initialBoard._id]);

  // Re-sync local state when the server sends fresh data (e.g. after revalidatePath("/board")),
  // without duplicating the fetch in an effect — see https://react.dev/learn/you-might-not-need-an-effect
  if (initialBoard.applications !== syncedApplications) {
    setSyncedApplications(initialBoard.applications);
    setApplications(initialBoard.applications);
  }

  const columns = initialBoard.columns;

  const handleDropApplication = async (appId: string, column: KanbanColumn) => {
    setDraggedId(null);
    setDragOverColumnId(null);

    const app = applications.find((a) => a._id === appId);
    if (!app || app.status === column.status) return;

    const previousStatus = app.status;
    setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status: column.status } : a)));

    const result = await moveApplication(appId, column._id);
    if (!result.success) {
      setApplications((prev) => prev.map((a) => (a._id === appId ? { ...a, status: previousStatus } : a)));
      toast.error(result.error);
    }
  };

  const filtered = applications.filter(
    (a) =>
      !search ||
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.position.toLowerCase().includes(search.toLowerCase()) ||
      a.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  const handleOpenDetail = (app: JobApplicationInterface) => {
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
              <h1 className="text-sm font-bold text-foreground leading-tight">{initialBoard.name}</h1>
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
            {columns.map((col) => (
              <BoardColumn
                key={col._id}
                column={col}
                applications={filtered.filter((a) => a.status === col.status)}
                onOpenDetail={handleOpenDetail}
                isOver={dragOverColumnId === col._id}
                draggedId={draggedId}
                onCardDragStart={setDraggedId}
                onCardDragEnd={() => setDraggedId(null)}
                onColumnDragOver={setDragOverColumnId}
                onColumnDragLeave={() => setDragOverColumnId(null)}
                onDropApplication={handleDropApplication}
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

            {columns.map((col) => {
              const colApps = filtered.filter((a) => a.status === col.status);
              if (colApps.length === 0) return null;
              const cfg = COLUMNS_CONFIG[col.status];
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
