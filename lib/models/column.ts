import mongoose, { Schema, Document, Types } from "mongoose";

export interface IColumn extends Document {
  boardId: Types.ObjectId;
  name: string;
  order: number;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema = new Schema<IColumn>(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    color: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Column || mongoose.model<IColumn>("Column", ColumnSchema);
