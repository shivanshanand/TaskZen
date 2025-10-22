export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
  tags?: string[];
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon?: string;
  userId: string;
  createdAt: Date;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
  tags?: string[];
  projectId?: string;
}

export interface UpdateTodoInput extends Partial<CreateTodoInput> {
  id: string;
  completed?: boolean;
}
