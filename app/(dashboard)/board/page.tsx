import { getSession } from "@/modules/auth/server";
import connectDB from "@/modules/db/client";
import Board from "@/modules/db/models/board";
import Column from "@/modules/db/models/column";
import JobApplication from "@/modules/db/models/job-application";
import { KanbanBoard } from "@/features/board/components/kanban-board";
import type { InitialBoard, KanbanColumn, JobApplicationInterface as JobApplicationType, Status } from "@/features/board/types/types";

export default async function BoardPage() {
  const session = await getSession();
  const userId = session!.user.id;

  await connectDB();

  const board = await Board.findOne({ userId }).lean();

  if (!board) {
    const empty: InitialBoard = { _id: "", name: "", userId, columns: [], applications: [] };
    return <KanbanBoard initialBoard={empty} userId={userId} />;
  }

  const [dbColumns, dbApplications] = await Promise.all([
    Column.find({ boardId: board._id }).sort({ order: 1 }).lean(),
    JobApplication.find({ boardId: board._id }).sort({ order: 1 }).lean(),
  ]);

  const columns: KanbanColumn[] = dbColumns.map((col) => ({
    _id: col._id.toString(),
    name: col.name,
    order: col.order,
    status: col.status ?? "ghost",
  }));

  const applications: JobApplicationType[] = dbApplications.map((app) => ({
    _id: app._id.toString(),
    company: app.company,
    position: app.position,
    location: app.location,
    workType: app.workType,
    status: app.status,
    order: app.order,
    description: app.description,
    source: app.source,
    appliedDate: app.appliedDate?.toISOString(),
    salaryMin: app.salaryMin,
    salaryMax: app.salaryMax,
    currency: app.currency,
    tags: app.tags,
    notes: app.notes,
    jobUrl: app.jobUrl,
  }));

  const initialBoard: InitialBoard = {
    _id: board._id.toString(),
    userId: board.userId.toString(),
    name: board.name,
    columns,
    applications,
  };

  return <KanbanBoard initialBoard={initialBoard} userId={userId} />;
}
