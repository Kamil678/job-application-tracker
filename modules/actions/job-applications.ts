"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/modules/auth/server";
import connectDB from "@/modules/db/client";
import { Board, Column, JobApplication } from "@/modules/db/models";
import * as applicationService from "@/modules/applications/service";
import {
  createApplicationSchema,
  updateApplicationSchema,
  type CreateApplicationFormData,
  type UpdateApplicationData,
} from "@/features/applications/schema";
import type { JobApplicationInterface } from "@/features/board/types/types";

type ActionResult<T = JobApplicationInterface> = { success: true; data: T } | { success: false; error: string };

function revalidateApplicationViews() {
  revalidatePath("/board");
  revalidatePath("/dashboard");
}

export async function createApplication(data: CreateApplicationFormData): Promise<ActionResult> {
  const session = await getSession();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const parsed = createApplicationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const parsedData = parsed.data;

  try {
    await connectDB();

    if (!parsedData.columnId || !parsedData.boardId) return { success: false, error: "Missing required fields" };

    const board = await Board.findOne({ _id: parsedData.boardId, userId: session.user.id });
    if (!board) return { success: false, error: "Board not found" };

    const column = await Column.findOne({ _id: parsedData.columnId, boardId: board._id });
    if (!column) return { success: false, error: "Column not found" };

    const { appliedDate, ...rest } = parsedData;

    const maxOrder = (await JobApplication.findOne({ columnId: parsedData.columnId }).sort({ order: -1 }).select("order").lean()) as {
      order: number;
    } | null;

    const application = await JobApplication.create({
      ...rest,
      userId: session.user.id,
      order: maxOrder ? maxOrder.order + 1 : 0,
      ...(appliedDate ? { appliedDate: new Date(appliedDate) } : {}),
    });

    revalidateApplicationViews();
    return { success: true, data: applicationService.toApplicationDTO(application.toObject()) };
  } catch {
    return { success: false, error: "Server error, please try again" };
  }
}

export async function updateApplication(id: string, data: UpdateApplicationData): Promise<ActionResult> {
  const session = await getSession();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const parsed = updateApplicationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const application = await applicationService.updateApplication(session.user.id, id, parsed.data);
    if (!application) return { success: false, error: "Application not found" };

    revalidateApplicationViews();
    return { success: true, data: application };
  } catch {
    return { success: false, error: "Server error, please try again" };
  }
}

export async function deleteApplication(id: string): Promise<ActionResult<null>> {
  const session = await getSession();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await applicationService.deleteApplication(session.user.id, id);
    revalidateApplicationViews();
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Server error, please try again" };
  }
}

export async function moveApplication(applicationId: string, targetColumnId: string): Promise<ActionResult> {
  const session = await getSession();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    await connectDB();

    const application = await JobApplication.findOne({ _id: applicationId, userId: session.user.id });
    if (!application) return { success: false, error: "Application not found" };

    const targetColumn = await Column.findOne({ _id: targetColumnId, boardId: application.boardId });
    if (!targetColumn) return { success: false, error: "Column not found" };

    const maxOrder = (await JobApplication.findOne({ columnId: targetColumnId }).sort({ order: -1 }).select("order").lean()) as {
      order: number;
    } | null;

    application.columnId = targetColumn._id;
    application.status = targetColumn.status;
    application.order = maxOrder ? maxOrder.order + 1 : 0;
    await application.save();

    revalidateApplicationViews();
    return { success: true, data: applicationService.toApplicationDTO(application.toObject()) };
  } catch {
    return { success: false, error: "Server error, please try again" };
  }
}
