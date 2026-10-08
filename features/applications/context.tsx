"use client";

import { createContext, useContext, useState } from "react";
import type { JobApplicationInterface, Status } from "@/features/board/types/types";

export type ApplicationDialogState =
  | { mode: "closed" }
  | { mode: "create"; status?: Status }
  | { mode: "edit"; app: JobApplicationInterface; onSaved?: (app: JobApplicationInterface) => void };

interface ApplicationDialogContextValue {
  state: ApplicationDialogState;
  openCreate: (status?: Status) => void;
  openEdit: (app: JobApplicationInterface, onSaved?: (app: JobApplicationInterface) => void) => void;
  close: () => void;
}

const ApplicationDialogContext = createContext<ApplicationDialogContextValue | null>(null);

export function ApplicationDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ApplicationDialogState>({ mode: "closed" });

  const value: ApplicationDialogContextValue = {
    state,
    openCreate: (status) => setState({ mode: "create", status }),
    openEdit: (app, onSaved) => setState({ mode: "edit", app, onSaved }),
    close: () => setState({ mode: "closed" }),
  };

  return <ApplicationDialogContext.Provider value={value}>{children}</ApplicationDialogContext.Provider>;
}

export function useApplicationDialog() {
  const ctx = useContext(ApplicationDialogContext);
  if (!ctx) throw new Error("useApplicationDialog must be used within ApplicationDialogProvider");
  return ctx;
}
