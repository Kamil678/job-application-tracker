import { getSession } from "@/modules/auth/server";
import connectDB from "@/modules/db/client";
import Board from "@/modules/db/models/board";
import { BoardClient } from "@/features/board/components/board-client";

export default async function BoardPage() {
  const session = await getSession();
  await connectDB();
  const board = await Board.findOne({ userId: session?.user.id }).lean();
  return <BoardClient initialBoard={board} />;
}
