export type Status = "wish_list" | "applied" | "interview" | "offer" | "rejected" | "ghost";
export type WorkType = "remote" | "hybrid" | "onsite";
export type ViewMode = "board" | "list";

export interface JobApplicationInterface {
  _id: string;
  company: string;
  position: string;
  location?: string;
  workType: WorkType;
  status: Status;
  appliedDate?: string;
  order: number;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  tags?: string[];
  description?: string;
  notes?: string;
  source?: string;
  jobUrl?: string;
  createdAt?: string;
}

export interface KanbanColumn {
  _id: string;
  name: string;
  order: number;
  status: Status;
}

export interface Board {
  _id: string;
  name: string;
  userId: string;
}

export interface InitialBoard extends Board {
  columns: KanbanColumn[];
  applications: JobApplicationInterface[];
}
