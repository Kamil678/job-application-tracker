import { WorkType } from "../types/types";

export const WORK_TYPE_CONFIG: Record<WorkType, { label: string; icon: string }> = {
  remote: { label: "Remote", icon: "🌐" },
  hybrid: { label: "Hybrid", icon: "⚡" },
  onsite: { label: "On-site", icon: "🏢" },
};
