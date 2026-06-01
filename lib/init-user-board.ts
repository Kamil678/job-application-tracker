import connectDB from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
  { name: "Wish List", order: 0 },
  { name: "Applied", order: 1 },
  { name: "Interviewing", order: 2 },
  { name: "Offer", order: 3 },
  { name: "Rejected", order: 4 },
];

export async function initUserBoard(userId: string) {
  try {
    await connectDB();

    const existingBoard = await Board.findOne({ userId, name: "Job Board" }).lean();
    if (existingBoard) return existingBoard;

    const board = await Board.create({ name: "Job Board", userId });

    await Column.insertMany(DEFAULT_COLUMNS.map((col) => ({ ...col, boardId: board._id })));

    return board;
  } catch (err) {
    throw err;
  }
}
