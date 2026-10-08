"use client";

import { createContext, useContext, useState } from "react";
import type { Status } from "@/features/board/types/types";

interface AddApplicationContextValue {
  open: boolean;
  defaultStatus: Status | undefined;
  defaultColumnId: string | undefined;
  boardId: string | undefined;
  openAddApplication: (status?: Status, columnId?: string) => void;
  closeAddApplication: () => void;
  setBoardId: (id: string) => void;
}

const AddApplicationContext = createContext<AddApplicationContextValue | null>(null);

export function AddApplicationProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<Status | undefined>();
  const [defaultColumnId, setDefaultColumnId] = useState<string | undefined>();
  const [boardId, setBoardId] = useState<string | undefined>();

  function openAddApplication(status?: Status, columnId?: string) {
    setDefaultStatus(status);
    setDefaultColumnId(columnId);
    setOpen(true);
  }

  function closeAddApplication() {
    setOpen(false);
    setDefaultStatus(undefined);
    setDefaultColumnId(undefined);
  }

  return (
    <AddApplicationContext.Provider value={{ open, defaultStatus, defaultColumnId, boardId, openAddApplication, closeAddApplication, setBoardId }}>
      {children}
    </AddApplicationContext.Provider>
  );
}

export function useAddApplication() {
  const ctx = useContext(AddApplicationContext);
  if (!ctx) throw new Error("useAddApplication must be used within AddApplicationProvider");
  return ctx;
}
