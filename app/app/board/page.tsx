import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import Board from "@/lib/models/board";
import { BoardClient } from "@/components/app/board/board-client";

export default async function BoardPage() {
  const session = await getSession();
  await connectDB();
  const board = await Board.findOne({ userId: session?.user.id }).lean();
  return <BoardClient initialBoard={board} />;
}
