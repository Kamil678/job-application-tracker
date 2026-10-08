"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/modules/auth/server";
import connectDB from "@/modules/db/client";
import Board from "@/modules/db/models/board";
import Column from "@/modules/db/models/column";
import JobApplication from "@/modules/db/models/job-application";
import { createApplicationSchema, type CreateApplicationFormData } from "@/features/applications/schema";
import { JobApplicationInterface } from "@/features/board/types/types";

type ActionResult = { success: true; data: JobApplicationInterface } | { success: false; error: string };

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

    if (!parsedData.company || !parsedData.position || !parsedData.columnId || !parsedData.boardId)
      return { success: false, error: "Missing required fields" };

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

    revalidatePath("/board");
    return { success: true, data: JSON.parse(JSON.stringify(application)) };
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

    revalidatePath("/board");
    return { success: true, data: JSON.parse(JSON.stringify(application)) };
  } catch {
    return { success: false, error: "Server error, please try again" };
  }
}
