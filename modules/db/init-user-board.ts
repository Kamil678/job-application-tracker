import connectDB from "./client";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
  { name: "Wish List", order: 0, status: "wish_list" },
  { name: "Applied", order: 1, status: "applied" },
  { name: "Interviewing", order: 2, status: "interview" },
  { name: "Offer", order: 3, status: "offer" },
  { name: "Rejected", order: 4, status: "rejected" },
] as const;

export async function initUserBoard(userId: string) {
  await connectDB();

  const existingBoard = await Board.findOne({ userId, name: "Job Board" }).lean();
  if (existingBoard) return existingBoard;

  const board = await Board.create({ name: "Job Board", userId });

  await Column.insertMany(DEFAULT_COLUMNS.map((col) => ({ ...col, boardId: board._id })));

  return board;
}
