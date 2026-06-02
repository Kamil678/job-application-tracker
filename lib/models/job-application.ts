import mongoose, { Schema, Document, Types } from "mongoose";

export interface IJobApplication extends Document {
  userId: Types.ObjectId;
  boardId: Types.ObjectId;
  columnId: Types.ObjectId;
  company: string;
  position: string;
  jobUrl?: string;
  location?: string;
  workType: "remote" | "hybrid" | "onsite";
  status: "wish_list" | "applied" | "interview" | "offer" | "rejected" | "ghost";
  appliedDate?: Date;
  order: number;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  tags?: string[];
  description?: string;
  notes?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: "Column",
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    jobUrl: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    workType: {
      type: String,
      required: true,
      enum: ["remote", "hybrid", "onsite"],
      default: "hybrid",
    },
    status: {
      type: String,
      required: true,
      enum: ["wish_list", "applied", "interview", "offer", "rejected", "ghost"],
      default: "applied",
    },
    appliedDate: {
      type: Date,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    salaryMin: {
      type: Number,
      min: 0,
    },
    salaryMax: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
    },
    notes: {
      type: String,
    },
    source: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.JobApplication || mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
