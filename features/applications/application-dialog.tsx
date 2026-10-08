"use client";

import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FormField, INPUT_CLASS, TEXTAREA_CLASS, fieldA11yProps } from "@/components/form-field";
import { cn } from "@/lib/utils";
import { createApplication, updateApplication } from "@/modules/actions/job-applications";
import { COLUMNS_CONFIG } from "@/features/board/constants/columns-config";
import { WORK_TYPE_CONFIG } from "@/features/board/constants/work-type-config";
import type { Status, WorkType } from "@/features/board/types/types";
import { useApplicationDialog, type ApplicationDialogState } from "./context";
import { createApplicationSchema, type CreateApplicationFormData } from "./schema";

const STATUSES: Status[] = ["wish_list", "applied", "interview", "offer", "rejected"];
const WORK_TYPES: WorkType[] = ["remote", "hybrid", "onsite"];

type OpenDialogState = Exclude<ApplicationDialogState, { mode: "closed" }>;

export function ApplicationDialog() {
  const { state, close } = useApplicationDialog();

  return (
    <Dialog open={state.mode !== "closed"} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
        {state.mode !== "closed" && (
          <ApplicationForm key={state.mode === "edit" ? state.app._id : "create"} state={state} onDone={close} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function toFormValues(state: OpenDialogState): CreateApplicationFormData {
  if (state.mode === "create") {
    return { company: "", position: "", status: state.status ?? "applied", workType: "hybrid", tags: [] };
  }

  const { app } = state;
  return {
    company: app.company,
    position: app.position,
    status: app.status,
    workType: app.workType,
    location: app.location ?? "",
    appliedDate: app.appliedDate?.slice(0, 10) ?? "",
    jobUrl: app.jobUrl ?? "",
    source: app.source ?? "",
    salaryMin: app.salaryMin,
    salaryMax: app.salaryMax,
    currency: app.currency ?? "",
    tags: app.tags ?? [],
    description: app.description ?? "",
    notes: app.notes ?? "",
  };
}

function ApplicationForm({ state, onDone }: { state: OpenDialogState; onDone: () => void }) {
  const isEdit = state.mode === "edit";
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateApplicationFormData>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: toFormValues(state),
  });

  const [status, workType, tags] = useWatch({ control, name: ["status", "workType", "tags"] });

  function setTags(next: string[]) {
    setValue("tags", next, { shouldDirty: true });
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim().replace(/,$/, "");
      if (value && !tags.includes(value)) setTags([...tags, value]);
      setTagInput("");
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  async function onSubmit(data: CreateApplicationFormData) {
    if (state.mode === "edit") {
      const { status: _status, ...changes } = data;
      const result = await updateApplication(state.app._id, changes);
      if (!result.success) return toast.error(result.error);
      toast.success("Application updated");
      state.onSaved?.(result.data);
    } else {
      const result = await createApplication(data);
      if (!result.success) return toast.error(result.error);
      toast.success("Application added");
    }
    onDone();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit application" : "Add application"}</DialogTitle>
        <DialogDescription>
          {state.mode === "edit" ? `${state.app.position} at ${state.app.company}` : "Track a new job application"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {!isEdit && (
          <FormField label="* Status">
            <div role="group" aria-label="Status" className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => {
                const cfg = COLUMNS_CONFIG[s];
                const selected = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setValue("status", s)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                      selected
                        ? `${cfg.bg} ${cfg.fg} border-transparent ring-2 ring-offset-1 ring-offset-background`
                        : "bg-background text-muted-foreground border-border hover:border-muted-foreground/40",
                    )}
                  >
                    <span aria-hidden="true" className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </FormField>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="* Company" id="company" error={errors.company?.message}>
            <Input
              id="company"
              placeholder="e.g. Acme Corp"
              className={cn(INPUT_CLASS, errors.company && "border-destructive")}
              {...fieldA11yProps("company", errors.company?.message)}
              {...register("company")}
            />
          </FormField>
          <FormField label="* Position" id="position" error={errors.position?.message}>
            <Input
              id="position"
              placeholder="e.g. Frontend Engineer"
              className={cn(INPUT_CLASS, errors.position && "border-destructive")}
              {...fieldA11yProps("position", errors.position?.message)}
              {...register("position")}
            />
          </FormField>
        </div>

        <FormField label="Work type">
          <div role="group" aria-label="Work type" className="flex gap-2">
            {WORK_TYPES.map((wt) => {
              const cfg = WORK_TYPE_CONFIG[wt];
              const selected = workType === wt;
              return (
                <button
                  key={wt}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setValue("workType", wt)}
                  className={cn(
                    "flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    selected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/40",
                  )}
                >
                  <span aria-hidden="true">{cfg.icon}</span>
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </FormField>

        <Separator />

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Location" id="location">
            <Input id="location" placeholder="City, Country" className={INPUT_CLASS} {...register("location")} />
          </FormField>
          <FormField label="Apply date" id="appliedDate">
            <Input id="appliedDate" type="date" className={INPUT_CLASS} {...register("appliedDate")} />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="Job URL" id="jobUrl" error={errors.jobUrl?.message}>
            <Input
              id="jobUrl"
              type="url"
              placeholder="https://..."
              className={cn(INPUT_CLASS, errors.jobUrl && "border-destructive")}
              {...fieldA11yProps("jobUrl", errors.jobUrl?.message)}
              {...register("jobUrl")}
            />
          </FormField>
          <FormField label="Source" id="source">
            <Input id="source" placeholder="e.g. LinkedIn, Referral" className={INPUT_CLASS} {...register("source")} />
          </FormField>
        </div>

        <FormField label="Salary range" id="salaryMax" error={errors.salaryMin?.message ?? errors.salaryMax?.message}>
          <div className="flex items-center gap-2">
            <Input
              aria-label="Minimum salary"
              placeholder="Min"
              type="number"
              min={0}
              className={cn(INPUT_CLASS, errors.salaryMin && "border-destructive")}
              {...fieldA11yProps("salaryMax", errors.salaryMin?.message)}
              {...register("salaryMin", { setValueAs: (v) => (v === "" || v === undefined ? undefined : Number(v)) })}
            />
            <span aria-hidden="true" className="text-muted-foreground text-sm shrink-0">
              –
            </span>
            <Input
              id="salaryMax"
              aria-label="Maximum salary"
              placeholder="Max"
              type="number"
              min={0}
              className={cn(INPUT_CLASS, errors.salaryMax && "border-destructive")}
              {...fieldA11yProps("salaryMax", errors.salaryMax?.message)}
              {...register("salaryMax", { setValueAs: (v) => (v === "" || v === undefined ? undefined : Number(v)) })}
            />
            <Input aria-label="Currency" placeholder="USD" className={cn(INPUT_CLASS, "w-20 shrink-0")} {...register("currency")} />
          </div>
        </FormField>

        <FormField label="Tags" id="tag-input">
          <div
            className={cn(
              "flex flex-wrap items-center gap-1.5 min-h-10 px-2.5 py-1.5 rounded-md border border-border bg-card transition-all cursor-text",
              "focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
            )}
            onClick={() => tagInputRef.current?.focus()}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-muted-foreground text-xs font-medium border border-border/50"
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="hover:text-foreground transition-colors"
                >
                  <X size={10} aria-hidden="true" />
                </button>
              </span>
            ))}
            <input
              id="tag-input"
              ref={tagInputRef}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={tags.length === 0 ? "Add tags… (Enter or comma)" : ""}
              className="flex-1 min-w-20 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </FormField>

        <Separator />

        <FormField label="Description" id="description">
          <textarea
            id="description"
            rows={3}
            placeholder="Job description or key requirements…"
            className={TEXTAREA_CLASS}
            {...register("description")}
          />
        </FormField>

        <FormField label="Notes" id="notes">
          <textarea
            id="notes"
            rows={3}
            placeholder="Any personal notes about this application…"
            className={TEXTAREA_CLASS}
            {...register("notes")}
          />
        </FormField>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onDone} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                {isEdit ? "Saving…" : "Adding…"}
              </>
            ) : (
              <>
                {isEdit ? <Save size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                {isEdit ? "Save changes" : "Add application"}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
