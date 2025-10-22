/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/mongodb";
import TodoModel from "@/lib/models/Todo";
import type { CreateTodoInput, UpdateTodoInput, Todo } from "@/types/todo";

// GET all todos for a user
export async function getTodos(userId: string): Promise<Todo[]> {
  try {
    await connectDB();

    const todos = (await TodoModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec()) as Array<Omit<Todo, "id"> & { _id: any }>;

    return todos.map((todo) => ({
      ...todo,
      id: todo._id.toString(),
      _id: undefined,
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt),
    }));
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    throw new Error("Failed to fetch todos");
  }
}

// CREATE a new todo
export async function createTodo(
  userId: string,
  input: CreateTodoInput
): Promise<{ success: boolean; todo?: Todo; error?: string }> {
  try {
    await connectDB();

    const todoDoc = await TodoModel.create({
      ...input,
      userId,
      completed: false,
    });

    const todo = {
      ...todoDoc.toObject(),
      id: todoDoc._id.toString(),
      _id: undefined,
      dueDate: todoDoc.dueDate ? new Date(todoDoc.dueDate) : undefined,
      createdAt: new Date(todoDoc.createdAt),
      updatedAt: new Date(todoDoc.updatedAt),
    };

    return {
      success: true,
      todo,
    };
  } catch (error) {
    // console.error("Failed to create todo:", error);
    return {
      success: false,
      error: "Failed to create todo",
    };
  }
}

// UPDATE a todo
export async function updateTodo(
  input: UpdateTodoInput
): Promise<{ success: boolean; todo?: Todo; error?: string }> {
  try {
    await connectDB();

    const { id, ...updates } = input;

    const todoDoc = await TodoModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).exec();

    if (!todoDoc) {
      return { success: false, error: "Todo not found" };
    }

    const todo = {
      ...todoDoc.toObject(),
      id: todoDoc._id.toString(),
      _id: undefined,
      dueDate: todoDoc.dueDate ? new Date(todoDoc.dueDate) : undefined,
      createdAt: new Date(todoDoc.createdAt),
      updatedAt: new Date(todoDoc.updatedAt),
    };

    return {
      success: true,
      todo,
    };
  } catch (error) {
    // console.error("Failed to update todo:", error);
    return {
      success: false,
      error: "Failed to update todo",
    };
  }
}

// DELETE a todo
export async function deleteTodo(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectDB();

    // console.log("Deleting todo with ID:", id);

    const result = await TodoModel.findByIdAndDelete(id).exec();

    // console.log("Delete result:", result);

    if (!result) {
      return { success: false, error: "Todo not found" };
    }

    return { success: true };
  } catch (error) {
    // console.error("Failed to delete todo:", error);
    return {
      success: false,
      error: "Failed to delete todo",
    };
  }
}

// TOGGLE completion status
export async function toggleTodo(
  id: string
): Promise<{ success: boolean; todo?: Todo; error?: string }> {
  try {
    await connectDB();

    const todoDoc = await TodoModel.findById(id).exec();

    if (!todoDoc) {
      return { success: false, error: "Todo not found" };
    }

    todoDoc.completed = !todoDoc.completed;
    await todoDoc.save();

    const todo = {
      ...todoDoc.toObject(),
      id: todoDoc._id.toString(),
      _id: undefined,
      dueDate: todoDoc.dueDate ? new Date(todoDoc.dueDate) : undefined,
      createdAt: new Date(todoDoc.createdAt),
      updatedAt: new Date(todoDoc.updatedAt),
    };

    return {
      success: true,
      todo,
    };
  } catch (error) {
    // console.error("Failed to toggle todo:", error);
    return {
      success: false,
      error: "Failed to toggle todo",
    };
  }
}
