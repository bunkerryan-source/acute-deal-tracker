"use client";

import { useState, useCallback } from "react";
import { UserName, Task } from "@/lib/database.types";
import { useCategories } from "@/hooks/useCategories";
import { useTasks } from "@/hooks/useTasks";
import { useFilters } from "@/hooks/useFilters";
import Header from "./Header";
import SummaryBar from "./SummaryBar";
import FilterBar from "./FilterBar";
import CategorySection from "./CategorySection";
import AddCategoryInput from "./AddCategoryInput";

interface AppShellProps {
  currentUser: UserName | null;
  onSelectUser: (user: UserName) => void;
}

export default function AppShell({ currentUser, onSelectUser }: AppShellProps) {
  const { categories, loading: catLoading, addCategory, renameCategory, deleteCategory } = useCategories();
  const { tasks, loading: taskLoading, addTask, updateTask, deleteTask } = useTasks();
  const { assigneeFilter, statusFilter, setAssigneeFilter, setStatusFilter, filterTasks } = useFilters();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const loading = catLoading || taskLoading;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  const filteredTasks = filterTasks(tasks);

  function tasksForCategory(categoryId: string): Task[] {
    return filteredTasks.filter((t) => t.category_id === categoryId);
  }

  function toggleTaskExpand(taskId: string) {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  }

  const handleUpdateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      updateTask(id, updates, currentUser);
    },
    [updateTask, currentUser]
  );

  const handleDeleteTask = useCallback(
    (id: string) => {
      if (expandedTaskId === id) setExpandedTaskId(null);
      deleteTask(id);
    },
    [deleteTask, expandedTaskId]
  );

  const isFiltering = assigneeFilter !== "All" || statusFilter !== "All";

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header currentUser={currentUser} onSelectUser={onSelectUser} />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header currentUser={currentUser} onSelectUser={onSelectUser} />
      <SummaryBar total={totalTasks} completed={completedTasks} />
      <FilterBar
        assigneeFilter={assigneeFilter}
        statusFilter={statusFilter}
        onAssigneeChange={setAssigneeFilter}
        onStatusChange={setStatusFilter}
      />

      <div className="mx-auto w-full max-w-3xl space-y-3 px-4 py-2">
        {categories.map((cat) => {
          const catTasks = tasksForCategory(cat.id);
          if (isFiltering && catTasks.length === 0) return null;
          return (
            <CategorySection
              key={cat.id}
              category={cat}
              tasks={catTasks}
              expandedTaskId={expandedTaskId}
              currentUser={currentUser}
              onToggleTaskExpand={toggleTaskExpand}
              onAddTask={addTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onRenameCategory={(id, name) => renameCategory(id, name)}
              onDeleteCategory={(id) => deleteCategory(id)}
            />
          );
        })}

        {categories.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
            <p className="text-sm text-gray-500">No categories yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Add a category below to get started
            </p>
          </div>
        )}
      </div>

      <AddCategoryInput onAdd={addCategory} />

      <div className="pb-8" />
    </div>
  );
}
