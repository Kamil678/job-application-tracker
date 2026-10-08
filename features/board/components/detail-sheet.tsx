"use client";

import { Banknote, Calendar, Globe, MapPin, Pencil, Trash2, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { cn, formatDate, formatSalary, getCompanyColor, getInitials } from "@/lib/utils";
import { COLUMNS_CONFIG } from "../constants/columns-config";
import { WORK_TYPE_CONFIG } from "../constants/work-type-config";
import type { JobApplicationInterface } from "../types/types";
import type { BoardActions } from "./job-card";

interface DetailSheetProps {
  app: JobApplicationInterface | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: Pick<BoardActions, "edit" | "requestDelete">;
}

const DETAIL_CLASS = "bg-secondary/40 rounded-2xl p-3 border border-border/50";
const DETAIL_LABEL_CLASS = "text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1";
const DETAIL_VALUE_CLASS = "text-sm font-semibold text-foreground flex items-center gap-1.5";

export function DetailSheet({ app, open, onOpenChange, actions }: DetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="w-full sm:max-w-md rounded-l-3xl border-l border-border bg-background p-0 gap-0 overflow-y-auto"
      >
        {app && <DetailSheetBody app={app} onOpenChange={onOpenChange} actions={actions} />}
      </SheetContent>
    </Sheet>
  );
}

function DetailSheetBody({ app, onOpenChange, actions }: Omit<DetailSheetProps, "open"> & { app: JobApplicationInterface }) {
  const cfg = COLUMNS_CONFIG[app.status];
  const salary = formatSalary(app);
  const date = formatDate(app.appliedDate);

  const runAndClose = (action: (app: JobApplicationInterface) => void) => () => {
    onOpenChange(false);
    action(app);
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="flex items-start gap-3">
          <div
            aria-hidden="true"
            className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0", getCompanyColor(app.company))}
          >
            {getInitials(app.company)}
          </div>
          <div className="flex-1 min-w-0">
            <SheetTitle className="text-base font-bold leading-tight">{app.position}</SheetTitle>
            <SheetDescription>{app.company}</SheetDescription>
          </div>
          <SheetClose render={<Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl shrink-0" aria-label="Close details" />}>
            <X className="h-4 w-4" aria-hidden="true" />
          </SheetClose>
        </div>
      </header>

      <div className="px-6 py-5 space-y-6">
        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold", cfg.bg, cfg.fg)}>
          <span aria-hidden="true" className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
          <span className="sr-only">Status: </span>
          {cfg.label}
        </span>

        <dl className="grid grid-cols-2 gap-3">
          {app.location && (
            <div className={DETAIL_CLASS}>
              <dt className={DETAIL_LABEL_CLASS}>Location</dt>
              <dd className={DETAIL_VALUE_CLASS}>
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" /> {app.location}
              </dd>
            </div>
          )}
          <div className={DETAIL_CLASS}>
            <dt className={DETAIL_LABEL_CLASS}>Work type</dt>
            <dd className={DETAIL_VALUE_CLASS}>
              <span aria-hidden="true">{WORK_TYPE_CONFIG[app.workType].icon}</span> {WORK_TYPE_CONFIG[app.workType].label}
            </dd>
          </div>
          {date && (
            <div className={DETAIL_CLASS}>
              <dt className={DETAIL_LABEL_CLASS}>Applied</dt>
              <dd className={DETAIL_VALUE_CLASS}>
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" /> {date}
              </dd>
            </div>
          )}
          {salary && (
            <div className={DETAIL_CLASS}>
              <dt className={DETAIL_LABEL_CLASS}>Salary</dt>
              <dd className={DETAIL_VALUE_CLASS}>
                <Banknote className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" /> {salary}
              </dd>
            </div>
          )}
        </dl>

        {app.tags && app.tags.length > 0 && (
          <section aria-labelledby="detail-tags-heading">
            <h3 id="detail-tags-heading" className="text-xs font-semibold text-muted-foreground mb-2">
              Tech stack
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {app.tags.map((tag) => (
                <li key={tag} className="text-xs font-medium px-2.5 py-1 rounded-xl bg-accent text-foreground/80 border border-border/60">
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        {app.description && (
          <section aria-labelledby="detail-description-heading">
            <h3 id="detail-description-heading" className="text-xs font-semibold text-muted-foreground mb-2">
              Description
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{app.description}</p>
          </section>
        )}

        {app.notes && (
          <section aria-labelledby="detail-notes-heading">
            <h3 id="detail-notes-heading" className="text-xs font-semibold text-muted-foreground mb-2">
              Notes
            </h3>
            <div className="bg-secondary/40 rounded-2xl p-4 border border-border/50">
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{app.notes}</p>
            </div>
          </section>
        )}

        <div className="flex flex-col gap-2 pt-2">
          {app.jobUrl && (
            <a
              href={app.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl gap-2 h-10")}
            >
              <Globe className="h-4 w-4" aria-hidden="true" /> View job posting
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          <Button className="w-full rounded-xl gap-2 h-10" onClick={runAndClose(actions.edit)}>
            <Pencil className="h-4 w-4" aria-hidden="true" /> Edit application
          </Button>
          <Button variant="destructive" className="w-full rounded-xl gap-2 h-10" onClick={runAndClose(actions.requestDelete)}>
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete application
          </Button>
        </div>
      </div>
    </>
  );
}
