"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from "@/actions/todo.actions";
import type { CreateTodoInput, UpdateTodoInput, Todo } from "@/types/todo";

const TODOS_QUERY_KEY = ["todos"];

export function useTodos(userId: string) {
  return useQuery({
    queryKey: [...TODOS_QUERY_KEY, userId],
    queryFn: () => getTodos(userId),
    enabled: !!userId,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      input,
    }: {
      userId: string;
      input: CreateTodoInput;
    }) => createTodo(userId, input),

    onMutate: async ({ userId, input }) => {
      await queryClient.cancelQueries({
        queryKey: [...TODOS_QUERY_KEY, userId],
      });

      const previousTodos = queryClient.getQueryData<Todo[]>([
        ...TODOS_QUERY_KEY,
        userId,
      ]);

      const tempTodo: Todo = {
        id: `temp-${Date.now()}`,
        ...input,
        completed: false,
        tags: input.tags || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      };

      queryClient.setQueryData<Todo[]>([...TODOS_QUERY_KEY, userId], (old) =>
        old ? [tempTodo, ...old] : [tempTodo]
      );

      return { previousTodos, userId };
    },

    onError: (err, { userId }, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(
          [...TODOS_QUERY_KEY, userId],
          context.previousTodos
        );
      }
      toast.error("Failed to create todo");
    },

    onSuccess: (data, { userId }) => {
      if (!data.success) {
        toast.error(data.error || "Failed to create todo");
      }
    },

    onSettled: (data, error, { userId }) => {
      queryClient.invalidateQueries({ queryKey: [...TODOS_QUERY_KEY, userId] });
    },
  });
}

export function useToggleTodo(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleTodo(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: [...TODOS_QUERY_KEY, userId],
      });

      const previousTodos = queryClient.getQueryData<Todo[]>([
        ...TODOS_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData<Todo[]>([...TODOS_QUERY_KEY, userId], (old) =>
        old?.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );

      return { previousTodos };
    },

    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(
          [...TODOS_QUERY_KEY, userId],
          context.previousTodos
        );
      }
      toast.error("Failed to toggle todo");
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to toggle todo");
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...TODOS_QUERY_KEY, userId] });
    },
  });
}

export function useDeleteTodo(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log("Mutation called with id:", id); // Debug
      const result = await deleteTodo(id);
      console.log("Mutation result:", result); // Debug

      if (!result.success) {
        throw new Error(result.error || "Failed to delete");
      }

      return result;
    },

    onMutate: async (id) => {
      console.log("onMutate - deleting id:", id); // Debug

      await queryClient.cancelQueries({
        queryKey: [...TODOS_QUERY_KEY, userId],
      });

      const previousTodos = queryClient.getQueryData<Todo[]>([
        ...TODOS_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData<Todo[]>([...TODOS_QUERY_KEY, userId], (old) => {
        const filtered = old?.filter((todo) => todo.id !== id);
        console.log(
          "Optimistically removed, remaining todos:",
          filtered?.length
        ); // Debug
        return filtered;
      });

      return { previousTodos };
    },

    onError: (err, id, context) => {
      console.error("Delete failed, rolling back:", err); // Debug

      if (context?.previousTodos) {
        queryClient.setQueryData(
          [...TODOS_QUERY_KEY, userId],
          context.previousTodos
        );
      }
      toast.error("Failed to delete todo");
    },

    onSuccess: (data) => {
      console.log("Delete successful:", data); // Debug
      toast.success("Todo deleted successfully");
    },

    onSettled: () => {
      console.log("Refetching after delete..."); // Debug
      queryClient.invalidateQueries({ queryKey: [...TODOS_QUERY_KEY, userId] });
    },
  });
}

export function useUpdateTodo(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateTodoInput) => updateTodo(input),

    onMutate: async (input) => {
      await queryClient.cancelQueries({
        queryKey: [...TODOS_QUERY_KEY, userId],
      });

      const previousTodos = queryClient.getQueryData<Todo[]>([
        ...TODOS_QUERY_KEY,
        userId,
      ]);

      queryClient.setQueryData<Todo[]>([...TODOS_QUERY_KEY, userId], (old) =>
        old?.map((todo) =>
          todo.id === input.id
            ? { ...todo, ...input, updatedAt: new Date() }
            : todo
        )
      );

      return { previousTodos };
    },

    onError: (err, input, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(
          [...TODOS_QUERY_KEY, userId],
          context.previousTodos
        );
      }
      toast.error("Failed to update todo");
    },

    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error || "Failed to update todo");
      } else {
        toast.success("Todo updated successfully");
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...TODOS_QUERY_KEY, userId] });
    },
  });
}
