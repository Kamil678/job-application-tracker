import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBoard extends Document {
  name: string;
  userId: Types.ObjectId;
  columns: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Board || mongoose.model<IBoard>("Board", BoardSchema);
