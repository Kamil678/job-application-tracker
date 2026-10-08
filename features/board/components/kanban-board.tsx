"use client";

import { startTransition, useOptimistic, useState } from "react";
import { Briefcase, Building2, LayoutGrid, List, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useApplicationDialog } from "@/features/applications/context";
import { DeleteApplicationDialog } from "@/features/applications/components/delete-application-dialog";
import { deleteApplication, moveApplication } from "@/modules/actions/job-applications";
import { COLUMNS_CONFIG } from "../constants/columns-config";
import type { InitialBoard, JobApplicationInterface, KanbanColumn, Status, ViewMode } from "../types/types";
import { BoardColumn } from "./board-column";
import { DetailSheet } from "./detail-sheet";
import type { BoardActions } from "./job-card";
import { ListRow } from "./list-row";

type OptimisticAction = { type: "move"; id: string; status: Status } | { type: "delete"; id: string };

function applyAction(apps: JobApplicationInterface[], action: OptimisticAction): JobApplicationInterface[] {
  switch (action.type) {
    case "move":
      return apps.map((a) => (a._id === action.id ? { ...a, status: action.status } : a));
    case "delete":
      return apps.filter((a) => a._id !== action.id);
  }
}

function matchesSearch(app: JobApplicationInterface, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    app.company.toLowerCase().includes(q) ||
    app.position.toLowerCase().includes(q) ||
    (app.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
  );
}

const VIEW_OPTIONS: { mode: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { mode: "board", label: "Board view", icon: LayoutGrid },
  { mode: "list", label: "List view", icon: List },
];

export function KanbanBoard({ initialBoard }: { initialBoard: InitialBoard }) {
  const [applications, applyOptimistic] = useOptimistic(initialBoard.applications, applyAction);
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<JobApplicationInterface | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const { openEdit } = useApplicationDialog();

  const columns = initialBoard.columns;
  const filtered = applications.filter((a) => matchesSearch(a, search));
  const selectedApp = applications.find((a) => a._id === selectedId) ?? null;

  function moveTo(app: JobApplicationInterface, column: KanbanColumn) {
    if (app.status === column.status) return;

    startTransition(async () => {
      applyOptimistic({ type: "move", id: app._id, status: column.status });
      const result = await moveApplication(app._id, column._id);
      if (result.success) {
        setAnnouncement(`Moved ${app.position} at ${app.company} to ${column.name}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  function confirmDelete(app: JobApplicationInterface) {
    startTransition(async () => {
      applyOptimistic({ type: "delete", id: app._id });
      const result = await deleteApplication(app._id);
      if (result.success) {
        toast.success(`Deleted ${app.position} at ${app.company}`);
      } else {
        toast.error(result.error);
      }
    });
  }

  const actions: BoardActions = {
    open: (app) => {
      setSelectedId(app._id);
      setSheetOpen(true);
    },
    edit: (app) => openEdit(app),
    requestDelete: setDeleteTarget,
    move: moveTo,
  };

  function handleDrop(appId: string, column: KanbanColumn) {
    setDraggedId(null);
    setDragOverColumnId(null);
    const app = applications.find((a) => a._id === appId);
    if (app) moveTo(app, column);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-border sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div aria-hidden="true" className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-tight">{initialBoard.name}</h1>
            <p className="text-[11px] text-muted-foreground leading-tight">
              {filtered.length} application{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-1 sm:flex-none items-center gap-2">
          <div className="relative flex flex-1 items-center">
            <label htmlFor="board-search" className="sr-only">
              Search applications
            </label>
            <Search aria-hidden="true" className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              id="board-search"
              type="search"
              placeholder="Search applications…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-60 h-10 bg-card border-border px-8 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-2.5 rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div role="group" aria-label="View" className="flex items-center rounded-lg border border-border/50">
            {VIEW_OPTIONS.map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                type="button"
                aria-label={label}
                aria-pressed={viewMode === mode}
                title={label}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "h-10 w-10 rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  viewMode === mode ? "bg-primary shadow-sm text-primary-foreground" : "text-muted-foreground hover:text-primary",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === "board" && (
        <div className="flex-1 overflow-auto">
          <div className="flex gap-4 p-5 sm:p-6 min-w-max h-full items-start">
            {columns.map((col) => (
              <BoardColumn
                key={col._id}
                column={col}
                columns={columns}
                applications={filtered.filter((a) => a.status === col.status)}
                actions={actions}
                isOver={dragOverColumnId === col._id}
                draggedId={draggedId}
                onCardDragStart={setDraggedId}
                onCardDragEnd={() => setDraggedId(null)}
                onColumnDragOver={setDragOverColumnId}
                onColumnDragLeave={() => setDragOverColumnId(null)}
                onDropApplication={handleDrop}
              />
            ))}
          </div>
        </div>
      )}

      {viewMode === "list" && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            {columns.map((col) => {
              const colApps = filtered.filter((a) => a.status === col.status);
              if (colApps.length === 0) return null;
              const cfg = COLUMNS_CONFIG[col.status];
              const headingId = `list-${col._id}-heading`;
              return (
                <section key={col._id} aria-labelledby={headingId} className="mb-6">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <div aria-hidden="true" className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                    <h2 id={headingId} className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {col.name}
                    </h2>
                    <span className={cn("text-xs font-bold", cfg.fg)}>{colApps.length}</span>
                  </div>
                  <ul className="space-y-0.5">
                    {colApps.map((app) => (
                      <li key={app._id}>
                        <ListRow app={app} onOpen={actions.open} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
                <Building2 className="h-10 w-10" aria-hidden="true" />
                <p className="text-sm">No applications found</p>
              </div>
            )}
          </div>
        </div>
      )}

      <p aria-live="polite" role="status" className="sr-only">
        {announcement}
      </p>

      <DetailSheet app={selectedApp} open={sheetOpen && selectedApp !== null} onOpenChange={setSheetOpen} actions={actions} />
      <DeleteApplicationDialog app={deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)} onConfirm={confirmDelete} />
    </div>
  );
}
