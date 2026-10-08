import { z } from "zod";

const STATUS_VALUES = ["wish_list", "applied", "interview", "offer", "rejected", "ghost"] as const;
const WORK_TYPE_VALUES = ["remote", "hybrid", "onsite"] as const;

export const createApplicationSchema = z
  .object({
    company: z.string().min(1, "Company is required"),
    position: z.string().min(1, "Position is required"),
    status: z.enum(STATUS_VALUES),
    workType: z.enum(WORK_TYPE_VALUES),
    location: z.string().optional(),
    appliedDate: z.string().optional(),
    jobUrl: z
      .string()
      .optional()
      .refine((val) => !val || /^https?:\/\/.+/.test(val), { message: "Must start with http:// or https://" }),
    source: z.string().optional(),
    salaryMin: z.number().min(0, "Must be ≥ 0").optional(),
    salaryMax: z.number().min(0, "Must be ≥ 0").optional(),
    currency: z.string().optional(),
    tags: z.array(z.string()),
    description: z.string().optional(),
    notes: z.string().optional(),
    boardId: z.string().optional(),
    columnId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.salaryMin !== undefined && data.salaryMax !== undefined) {
        return data.salaryMax >= data.salaryMin;
      }
      return true;
    },
    { message: "Max must be ≥ min", path: ["salaryMax"] },
  );

export type CreateApplicationFormData = z.infer<typeof createApplicationSchema>;
