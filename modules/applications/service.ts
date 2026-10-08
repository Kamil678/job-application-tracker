import { isValidObjectId, Types, type Document, type SortOrder } from "mongoose";
import connectDB from "@/modules/db/client";
import { JobApplication } from "@/modules/db/models";
import type { IJobApplication } from "@/modules/db/models/job-application";
import type { JobApplicationInterface, Status } from "@/features/board/types/types";
import type { ApplicationSort, ListApplicationsQuery, UpdateApplicationData } from "@/features/applications/schema";

type JobApplicationDoc = Omit<IJobApplication, keyof Document> & { _id: Types.ObjectId };

export interface PaginatedApplications {
  items: JobApplicationInterface[];
  total: number;
  page: number;
  pageSize: number;
}

export type ApplicationStats = Record<Status, number> & { total: number };

export function toApplicationDTO(doc: JobApplicationDoc): JobApplicationInterface {
  return {
    _id: doc._id.toString(),
    company: doc.company,
    position: doc.position,
    location: doc.location,
    workType: doc.workType,
    status: doc.status,
    order: doc.order,
    description: doc.description,
    source: doc.source,
    appliedDate: doc.appliedDate?.toISOString(),
    salaryMin: doc.salaryMin,
    salaryMax: doc.salaryMax,
    currency: doc.currency,
    tags: doc.tags,
    notes: doc.notes,
    jobUrl: doc.jobUrl,
    createdAt: doc.createdAt?.toISOString(),
  };
}

const SORT_MAP: Record<ApplicationSort, Record<string, SortOrder>> = {
  "-createdAt": { createdAt: -1 },
  createdAt: { createdAt: 1 },
  company: { company: 1, createdAt: -1 },
  "-company": { company: -1, createdAt: -1 },
  "-appliedDate": { appliedDate: -1, createdAt: -1 },
  appliedDate: { appliedDate: 1, createdAt: -1 },
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listApplications(userId: string, query: ListApplicationsQuery): Promise<PaginatedApplications> {
  await connectDB();

  const filter: Record<string, unknown> = { userId };
  if (query.status) filter.status = query.status;
  if (query.q) {
    const pattern = new RegExp(escapeRegex(query.q), "i");
    filter.$or = [{ company: pattern }, { position: pattern }, { tags: pattern }];
  }

  const [docs, total] = await Promise.all([
    JobApplication.find(filter)
      .sort(SORT_MAP[query.sort])
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .lean<JobApplicationDoc[]>(),
    JobApplication.countDocuments(filter),
  ]);

  return { items: docs.map(toApplicationDTO), total, page: query.page, pageSize: query.limit };
}

/** Returns null when the id is malformed or the application doesn't belong to the user. */
export async function updateApplication(
  userId: string,
  id: string,
  data: UpdateApplicationData,
): Promise<JobApplicationInterface | null> {
  if (!isValidObjectId(id)) return null;
  await connectDB();

  const { appliedDate, ...rest } = data;
  const $set: Record<string, unknown> = { ...rest };
  const $unset: Record<string, ""> = {};
  if (appliedDate !== undefined) {
    if (appliedDate) $set.appliedDate = new Date(appliedDate);
    else $unset.appliedDate = "";
  }

  const doc = await JobApplication.findOneAndUpdate(
    { _id: id, userId },
    { $set, ...(Object.keys($unset).length ? { $unset } : {}) },
    { new: true, runValidators: true },
  ).lean<JobApplicationDoc>();

  return doc ? toApplicationDTO(doc) : null;
}

/** Idempotent: deleting a missing application is not an error. Returns whether something was deleted. */
export async function deleteApplication(userId: string, id: string): Promise<boolean> {
  if (!isValidObjectId(id)) return false;
  await connectDB();

  const result = await JobApplication.deleteOne({ _id: id, userId });
  return result.deletedCount > 0;
}

export async function getApplicationStats(userId: string): Promise<ApplicationStats> {
  await connectDB();

  const rows = await JobApplication.aggregate<{ _id: Status; count: number }>([
    { $match: { userId: new Types.ObjectId(userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const stats: ApplicationStats = { wish_list: 0, applied: 0, interview: 0, offer: 0, rejected: 0, ghost: 0, total: 0 };
  for (const row of rows) {
    stats[row._id] = row.count;
    stats.total += row.count;
  }
  return stats;
}

export async function getRecentApplications(userId: string, limit = 5): Promise<JobApplicationInterface[]> {
  await connectDB();

  const docs = await JobApplication.find({ userId }).sort({ updatedAt: -1 }).limit(limit).lean<JobApplicationDoc[]>();
  return docs.map(toApplicationDTO);
}
