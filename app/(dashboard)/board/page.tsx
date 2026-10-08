import { getSession } from "@/modules/auth/server";
import connectDB from "@/modules/db/client";
import { Board, Column, JobApplication } from "@/modules/db/models";
import { toApplicationDTO } from "@/modules/applications/service";
import { KanbanBoard } from "@/features/board/components/kanban-board";
import type { InitialBoard, KanbanColumn } from "@/features/board/types/types";

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
    JobApplication.find({ boardId: board._id }).sort({ order: 1 }).lean<Parameters<typeof toApplicationDTO>[0][]>(),
  ]);

  const columns: KanbanColumn[] = dbColumns.map((col) => ({
    _id: col._id.toString(),
    name: col.name,
    order: col.order,
    status: col.status ?? "ghost",
  }));

  const applications = dbApplications.map(toApplicationDTO);

  const initialBoard: InitialBoard = {
    _id: board._id.toString(),
    userId: board.userId.toString(),
    name: board.name,
    columns,
    applications,
  };

  return <KanbanBoard initialBoard={initialBoard} userId={userId} />;
}
