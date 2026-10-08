import { z } from "zod";

export const STATUS_VALUES = ["wish_list", "applied", "interview", "offer", "rejected", "ghost"] as const;
export const WORK_TYPE_VALUES = ["remote", "hybrid", "onsite"] as const;
export const SORT_VALUES = ["-createdAt", "createdAt", "company", "-company", "-appliedDate", "appliedDate"] as const;

const salaryRangeIsValid = (data: { salaryMin?: number; salaryMax?: number }) =>
  data.salaryMin === undefined || data.salaryMax === undefined || data.salaryMax >= data.salaryMin;

const salaryRangeError = { message: "Max must be ≥ min", path: ["salaryMax"] };

const applicationBaseSchema = z.object({
  company: z.string().trim().min(1, "Company is required"),
  position: z.string().trim().min(1, "Position is required"),
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
});

export const createApplicationSchema = applicationBaseSchema
  .extend({
    boardId: z.string().optional(),
    columnId: z.string().optional(),
  })
  .refine(salaryRangeIsValid, salaryRangeError);

export const updateApplicationSchema = applicationBaseSchema
  .omit({ status: true })
  .partial()
  .strict()
  .refine(salaryRangeIsValid, salaryRangeError);

export const listApplicationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(STATUS_VALUES).optional(),
  q: z.string().trim().max(100).optional(),
  sort: z.enum(SORT_VALUES).default("-createdAt"),
});

export type CreateApplicationFormData = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationData = z.infer<typeof updateApplicationSchema>;
export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;
export type ListApplicationsQueryInput = z.input<typeof listApplicationsQuerySchema>;
export type ApplicationSort = (typeof SORT_VALUES)[number];