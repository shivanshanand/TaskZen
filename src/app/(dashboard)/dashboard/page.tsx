"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, LogOut, CalendarIcon, Flame } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TodoCard } from "@/components/todo/TodoCard";
import { TodoForm } from "@/components/todo/TodoForm";
import { useTodos } from "@/hooks/useTodos";
import CalendarView from "@/components/calendar/CalendarView";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Use real user ID from session
  const userId = session?.user?.id || "";
  const { data: todos = [], isLoading, error } = useTodos(userId);

  // Filter and search logic
  const filteredTodos = useMemo(() => {
    let results = todos;
    // Filter by calendar date if selected
    if (selectedDate) {
      results = results.filter(
        (todo) =>
          todo.dueDate &&
          new Date(todo.dueDate).toDateString() === selectedDate.toDateString()
      );
    }
    // Now further filter by search, priority, status
    return results.filter((todo) => {
      // Search filter
      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Priority filter
      const matchesPriority =
        filterPriority === "all" || todo.priority === filterPriority;

      // Status filter
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && !todo.completed) ||
        (filterStatus === "completed" && todo.completed);

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [todos, searchQuery, filterPriority, filterStatus, selectedDate]);

  // Statistics
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const high = todos.filter(
      (t) => t.priority === "high" && !t.completed
    ).length;

    return { total, completed, active, high };
  }, [todos]);

  const daysWithTodos = useMemo(() => {
    const days = new Set(
      todos
        .filter((todo) => todo.dueDate)
        .map((todo) => new Date(todo.dueDate).toDateString())
    );
    return Array.from(days).map((dateStr) => new Date(dateStr));
  }, [todos]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero header with brand and streak */}
        <motion.div
          className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-8 md:gap-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="text-blue-600 h-7 w-7" />
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskZen <span className="text-yellow-400">AI</span>
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-300 text-lg font-medium">
              Welcome,{" "}
              <span className="font-semibold">
                {session?.user?.name || "User"}
              </span>
              ! <br />
              <span className="text-blue-700 dark:text-purple-200">
                Plan smarter. Level up your day—one task at a time.
              </span>
            </p>
          </div>
          {/* Mini streak/ai callout or stats - edit as desired */}
          <div className="rounded-xl bg-gradient-to-br from-yellow-100 via-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 px-6 py-3 shadow flex flex-col md:items-end items-center">
            <span className="flex gap-1 items-center text-lg font-bold text-blue-700 dark:text-purple-200">
              <Flame className="text-orange-500" /> Productivity streak:{" "}
              <span className="ml-2">
                {stats.completed}/{stats.total}
              </span>{" "}
              tasks done!
            </span>
            <span className="text-xs mt-1 text-blue-500">
              Keep going to unlock new badges!
            </span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border-l-4 border-blue-600"
          >
            <p className="text-sm text-blue-600 font-medium">Total Tasks</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border-l-4 border-indigo-600"
          >
            <p className="text-sm text-indigo-600 font-medium">Active</p>
            <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border-l-4 border-green-600"
          >
            <p className="text-sm text-green-600 font-medium">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.completed}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border-l-4 border-red-500"
          >
            <p className="text-sm text-red-500 font-medium">High Priority</p>
            <p className="text-3xl font-bold text-red-600">{stats.high}</p>
          </motion.div>
        </div>

        {/* Responsive Split Panel: Calendar left, Task panel right */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Calendar Left */}
          <div className="lg:w-1/3 w-full">
            <div className="sticky top-6 z-10">
              <CalendarView
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{
                  hasTodo: daysWithTodos,
                }}
                modifiersClassNames={{
                  hasTodo: "border-blue-500 border-2 rounded-full",
                  today: "bg-blue-100",
                  selected:
                    "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
                }}
              />
              <div className="text-center mt-2 text-muted-foreground">
                {selectedDate
                  ? `Tasks for ${selectedDate.toLocaleDateString()}`
                  : "Showing all tasks"}
              </div>
            </div>
          </div>

          {/* Tasks and Filters Right */}
          <div className="lg:w-2/3 w-full">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-6 border border-blue-100 dark:border-slate-800">
              <div className="flex flex-col md:flex-row gap-4 mb-2">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {/* Priority Filter */}
                <Select
                  value={filterPriority}
                  onValueChange={setFilterPriority}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                {/* Add Todo Button */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <TodoForm onSuccess={() => setIsDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
              {/* Status Tabs */}
              <Tabs
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as any)}
                className="mt-4"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {/* Todo List */}
            <div className="space-y-4">
              {/* Loading, error, empty logic as before */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">Loading tasks...</p>
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-red-600">Failed to load tasks</p>
                </motion.div>
              )}
              {!isLoading && !error && filteredTodos.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    filterPriority !== "all" ||
                    filterStatus !== "all"
                      ? "No tasks match your filters"
                      : "No tasks yet. Create one to get started!"}
                  </p>
                </motion.div>
              )}
              <AnimatePresence mode="popLayout">
                {filteredTodos.map((todo) => (
                  <TodoCard key={todo.id} todo={todo} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
