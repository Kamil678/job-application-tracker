import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, "Invalid phone")
    .or(z.literal("")),
  websiteUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  linkedinUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  jobTitle: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  image: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
