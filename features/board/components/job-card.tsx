"use client";

import { Banknote, Calendar, ExternalLink, MapPin, MoreHorizontal, Pencil, Trash2, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate, formatSalary, getCompanyColor, getInitials } from "@/lib/utils";
import { COLUMNS_CONFIG } from "../constants/columns-config";
import { WORK_TYPE_CONFIG } from "../constants/work-type-config";
import type { JobApplicationInterface, KanbanColumn } from "../types/types";

export interface BoardActions {
  open: (app: JobApplicationInterface) => void;
  edit: (app: JobApplicationInterface) => void;
  requestDelete: (app: JobApplicationInterface) => void;
  move: (app: JobApplicationInterface, column: KanbanColumn) => void;
}

interface JobCardProps {
  app: JobApplicationInterface;
  columns: KanbanColumn[];
  actions: BoardActions;
  isDragging?: boolean;
  onDragStart: (appId: string) => void;
  onDragEnd: () => void;
}

const PILL_CLASS =
  "inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-accent/60 rounded-lg px-2 py-0.5 border border-border/40";
const TAG_CLASS = "text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/50";

export function JobCard({ app, columns, actions, isDragging, onDragStart, onDragEnd }: JobCardProps) {
  const salary = formatSalary(app);
  const date = formatDate(app.appliedDate);
  const cfg = COLUMNS_CONFIG[app.status];
  const moveTargets = columns.filter((col) => col.status !== app.status);

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", app._id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart(app._id);
      }}
      onDragEnd={onDragEnd}
      aria-label={`${app.position} at ${app.company}`}
      className={cn(
        "group relative bg-card border border-border rounded-md p-4 transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-ring",
        "cursor-pointer select-none",
        isDragging && "opacity-50 scale-95 shadow-xl rotate-1",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute top-4 bottom-4 -left-0.5 w-0.5 rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          cfg.dot,
        )}
      />

      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className={cn(
            "shrink-0 w-9 h-9 rounded-md flex items-center justify-center text-[11px] font-bold tracking-tight",
            getCompanyColor(app.company),
          )}
        >
          {getInitials(app.company)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground leading-tight truncate">
            <button
              type="button"
              onClick={() => actions.open(app)}
              className="text-left outline-none after:absolute after:inset-0 after:content-['']"
            >
              {app.position}
            </button>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate font-medium">{app.company}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Actions for ${app.position} at ${app.company}`}
                className={cn(
                  "relative z-10 h-6 w-6 shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent",
                  "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100",
                )}
              />
            }
          >
            <MoreHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => actions.open(app)}>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.edit(app)}>
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
            </DropdownMenuItem>
            {moveTargets.length > 0 && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden="true" /> Move to…
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {moveTargets.map((col) => (
                    <DropdownMenuItem key={col._id} onClick={() => actions.move(app, col)}>
                      <span aria-hidden="true" className={cn("w-2 h-2 rounded-full", COLUMNS_CONFIG[col.status].dot)} />
                      {col.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            {app.jobUrl && (
              <DropdownMenuItem render={<a href={app.jobUrl} target="_blank" rel="noopener noreferrer" />}>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> Open job URL
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => actions.requestDelete(app)}>
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {app.location && (
          <span className={PILL_CLASS}>
            <MapPin className="h-2.5 w-2.5" aria-hidden="true" />
            {app.location}
          </span>
        )}
        <span className={PILL_CLASS}>
          <span aria-hidden="true">{WORK_TYPE_CONFIG[app.workType].icon}</span> {WORK_TYPE_CONFIG[app.workType].label}
        </span>
        {date && (
          <span className={PILL_CLASS}>
            <Calendar className="h-2.5 w-2.5" aria-hidden="true" /> {date}
          </span>
        )}
      </div>

      {salary && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <Banknote className="h-3 w-3 text-muted-foreground/60 shrink-0" aria-hidden="true" />
          <span className="text-xs font-semibold text-foreground/80">{salary}</span>
        </div>
      )}

      {app.tags && app.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1" aria-label="Tags">
          {app.tags.slice(0, 3).map((tag) => (
            <li key={tag} className={TAG_CLASS}>
              {tag}
            </li>
          ))}
          {app.tags.length > 3 && <li className={TAG_CLASS}>+{app.tags.length - 3}</li>}
        </ul>
      )}

      {app.notes && (
        <div className="mt-2.5 pt-2.5 border-t border-border/40">
          <p className="text-[11px] text-muted-foreground/70 line-clamp-1 italic">{app.notes}</p>
        </div>
      )}
    </article>
  );
}
