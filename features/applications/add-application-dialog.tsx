"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FormField, INPUT_CLASS, TEXTAREA_CLASS } from "@/components/form-field";
import { cn } from "@/lib/utils";
import { useAddApplication } from "./context";
import { createApplication } from "@/modules/actions/job-applications";
import { createApplicationSchema, type CreateApplicationFormData } from "./schema";
import { COLUMNS_CONFIG } from "@/features/board/constants/columns-config";
import { WORK_TYPE_CONFIG } from "@/features/board/constants/work-type-config";
import type { Status, WorkType } from "@/features/board/types/types";

const STATUSES: Status[] = ["wish_list", "applied", "interview", "offer", "rejected"];
const WORK_TYPES: WorkType[] = ["remote", "hybrid", "onsite"];

export function AddApplicationDialog() {
  const { open, closeAddApplication, defaultStatus, defaultColumnId, boardId } = useAddApplication();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateApplicationFormData>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      status: defaultStatus ?? "applied",
      workType: "hybrid",
      tags: [],
    },
  });

  const status = watch("status");
  const workType = watch("workType");

  useEffect(() => {
    if (open) {
      reset({
        status: defaultStatus ?? "applied",
        workType: "hybrid",
        tags: [],
        boardId: boardId,
        columnId: defaultColumnId,
      });
      setTags([]);
      setTagInput("");
    }
  }, [open, defaultStatus, defaultColumnId, boardId, reset]);

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim().replace(/,$/, "");
      if (value && !tags.includes(value)) {
        const updated = [...tags, value];
        setTags(updated);
        setValue("tags", updated);
      }
      setTagInput("");
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      const updated = tags.slice(0, -1);
      setTags(updated);
      setValue("tags", updated);
    }
  }

  function removeTag(tag: string) {
    const updated = tags.filter((t) => t !== tag);
    setTags(updated);
    setValue("tags", updated);
  }

  async function onSubmit(data: CreateApplicationFormData) {
    try {
      const result = await createApplication(data);
      if (result.success) {
        toast.success("Application added!");
        closeAddApplication();
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && closeAddApplication()}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add application</DialogTitle>
          <DialogDescription>Track a new job application</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="* Status">
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => {
                const cfg = COLUMNS_CONFIG[s];
                const selected = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setValue("status", s)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                      selected
                        ? `${cfg.bg} ${cfg.fg} border-transparent ring-2 ring-offset-1 ring-offset-background`
                        : "bg-background text-muted-foreground border-border hover:border-muted-foreground/40",
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="* Company" id="company" error={errors.company?.message}>
              <Input
                id="company"
                placeholder="e.g. Acme Corp"
                className={cn(INPUT_CLASS, errors.company ? "border-destructive" : "")}
                {...register("company")}
              />
            </FormField>
            <FormField label="* Position" id="position" error={errors.position?.message}>
              <Input
                id="position"
                placeholder="e.g. Frontend Engineer"
                className={cn(INPUT_CLASS, errors.position ? "border-destructive" : "")}
                {...register("position")}
              />
            </FormField>
          </div>

          <FormField label="Work type">
            <div className="flex gap-2">
              {WORK_TYPES.map((wt) => {
                const cfg = WORK_TYPE_CONFIG[wt];
                const selected = workType === wt;
                return (
                  <button
                    key={wt}
                    type="button"
                    onClick={() => setValue("workType", wt as WorkType)}
                    className={cn(
                      "flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/40",
                    )}
                  >
                    <span>{cfg.icon}</span>
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
                className={cn(INPUT_CLASS, errors.jobUrl ? "border-destructive" : "")}
                {...register("jobUrl")}
              />
            </FormField>
            <FormField label="Source" id="source">
              <Input id="source" placeholder="e.g. LinkedIn, Referral" className={INPUT_CLASS} {...register("source")} />
            </FormField>
          </div>

          <FormField label="Salary range" error={errors.salaryMax?.message}>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Min"
                type="number"
                min={0}
                className={cn(INPUT_CLASS, errors.salaryMin ? "border-destructive" : "")}
                {...register("salaryMin", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              />
              <span className="text-muted-foreground text-sm shrink-0">–</span>
              <Input
                placeholder="Max"
                type="number"
                min={0}
                className={cn(INPUT_CLASS, errors.salaryMax ? "border-destructive" : "")}
                {...register("salaryMax", { setValueAs: (v) => (v === "" ? undefined : Number(v)) })}
              />
              <Input placeholder="USD" className={cn(INPUT_CLASS, "w-20 shrink-0")} {...register("currency")} />
            </div>
          </FormField>

          <FormField label="Tags">
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
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-foreground transition-colors">
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input
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
            <Button type="button" variant="outline" onClick={closeAddApplication} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Add application
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
