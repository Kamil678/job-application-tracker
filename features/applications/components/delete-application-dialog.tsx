"use client";

import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { JobApplicationInterface } from "@/features/board/types/types";

interface DeleteApplicationDialogProps {
  app: JobApplicationInterface | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (app: JobApplicationInterface) => void;
}

export function DeleteApplicationDialog({ app, onOpenChange, onConfirm }: DeleteApplicationDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog open={app !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent initialFocus={cancelRef}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this application?</AlertDialogTitle>
          <AlertDialogDescription>
            {app ? (
              <>
                <strong className="font-semibold text-foreground">{app.position}</strong> at{" "}
                <strong className="font-semibold text-foreground">{app.company}</strong> will be permanently removed. This can&apos;t be undone.
              </>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              if (app) onConfirm(app);
              onOpenChange(false);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
