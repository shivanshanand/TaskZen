import mongoose, { Schema, Model } from "mongoose";
import type { Todo } from "@/types/todo";

const TodoSchema = new Schema<Todo>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [200, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    projectId: {
      type: String,
    },

    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries
TodoSchema.index({ userId: 1, completed: 1 });
TodoSchema.index({ userId: 1, dueDate: 1 });

const TodoModel: Model<Todo> =
  mongoose.models.Todo || mongoose.model<Todo>("Todo", TodoSchema);

export default TodoModel;
