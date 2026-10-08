"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApplicationDialog } from "@/features/applications/context";
import { COLUMNS_CONFIG } from "../constants/columns-config";
import type { JobApplicationInterface, KanbanColumn } from "../types/types";
import { JobCard, type BoardActions } from "./job-card";

interface BoardColumnProps {
  column: KanbanColumn;
  columns: KanbanColumn[];
  applications: JobApplicationInterface[];
  actions: BoardActions;
  isOver: boolean;
  draggedId: string | null;
  onCardDragStart: (appId: string) => void;
  onCardDragEnd: () => void;
  onColumnDragOver: (columnId: string) => void;
  onColumnDragLeave: () => void;
  onDropApplication: (appId: string, column: KanbanColumn) => void;
}

export function BoardColumn({
  column,
  columns,
  applications,
  actions,
  isOver,
  draggedId,
  onCardDragStart,
  onCardDragEnd,
  onColumnDragOver,
  onColumnDragLeave,
  onDropApplication,
}: BoardColumnProps) {
  const config = COLUMNS_CONFIG[column.status];
  const count = applications.length;
  const headingId = `column-${column._id}-heading`;
  const { openCreate } = useApplicationDialog();

  return (
    <section aria-labelledby={headingId} className="flex flex-col w-75 shrink-0 min-h-100">
      <div className="flex items-center gap-2.5 mb-3 px-0.5">
        <div aria-hidden="true" className={cn("w-2.5 h-2.5 rounded-full shrink-0", config.dot)} />
        <h2 id={headingId} className="text-sm font-bold text-foreground tracking-tight">
          {column.name}
        </h2>
        <span
          aria-label={`${count} application${count === 1 ? "" : "s"}`}
          className={cn(
            "inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-md text-[11px] font-semibold border",
            count > 0 ? `${config.bg} ${config.fg} border-transparent` : "bg-transparent text-muted-foreground border-border/50",
          )}
        >
          {count}
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          onColumnDragOver(column._id);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onColumnDragLeave();
        }}
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
        <div aria-hidden="true" className={cn("h-1 w-full rounded-full bg-linear-to-r opacity-60", config.columnAccent)} />

        {count === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-8 gap-2 opacity-60">
            <span aria-hidden="true" className="text-3xl leading-none">
              {config.emptyIcon}
            </span>
            <p className="text-xs text-muted-foreground text-center leading-relaxed">No applications yet</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {applications.map((app) => (
              <li key={app._id}>
                <JobCard
                  app={app}
                  columns={columns}
                  actions={actions}
                  isDragging={draggedId === app._id}
                  onDragStart={onCardDragStart}
                  onDragEnd={onCardDragEnd}
                />
              </li>
            ))}
          </ul>
        )}

        <Button variant="outline" onClick={() => openCreate(column.status)}>
          <Plus size={14} aria-hidden="true" />
          Add<span className="sr-only sm:not-sr-only"> application</span>
          <span className="sr-only"> to {column.name}</span>
        </Button>
      </div>
    </section>
  );
}
