"use client";

import { useState, useCallback } from "react";
import { Task } from "@/lib/database.types";
import { useCategories } from "@/hooks/useCategories";
import { useTasks } from "@/hooks/useTasks";
import { useFilters } from "@/hooks/useFilters";
import Sidebar from "./Sidebar";
import CategorySection from "./CategorySection";
import AddCategoryInput from "./AddCategoryInput";
import TopBar from "./TopBar";
import SummaryBar from "./SummaryBar";

export default function AppShell() {
  const { categories, loading: catLoading, addCategory, renameCategory, deleteCategory } = useCategories();
  const { tasks, loading: taskLoading, addTask, updateTask, deleteTask } = useTasks();
  const {
    assigneeFilter,
    statusFilter,
    categoryFilter,
    setAssigneeFilter,
    setStatusFilter,
    setCategoryFilter,
    filterTasks,
    resetFilters,
    isFiltering,
  } = useFilters();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const loading = catLoading || taskLoading;

  const filteredTasks = filterTasks(tasks);

  function tasksForCategory(categoryId: string): Task[] {
    return filteredTasks.filter((t) => t.category_id === categoryId);
  }

  function toggleTaskExpand(taskId: string) {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  }

  const handleUpdateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      updateTask(id, updates);
    },
    [updateTask]
  );

  const handleDeleteTask = useCallback(
    (id: string) => {
      if (expandedTaskId === id) setExpandedTaskId(null);
      deleteTask(id);
    },
    [deleteTask, expandedTaskId]
  );

  const visibleCategories =
    categoryFilter === "All"
      ? categories
      : categories.filter((c) => c.id === categoryFilter);

  return (
    <div className="flex min-h-screen bg-stone">
      <Sidebar
        categories={categories}
        tasks={tasks}
        assigneeFilter={assigneeFilter}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        onAssigneeChange={setAssigneeFilter}
        onStatusChange={setStatusFilter}
        onCategoryChange={setCategoryFilter}
        onResetFilters={resetFilters}
        isFiltering={isFiltering}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <main className="flex flex-1 flex-col">
        <TopBar onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-sm text-ink-40">Loading...</div>
          </div>
        ) : (
          <>
            <SummaryBar tasks={tasks} />

            <div className="mx-auto w-full max-w-3xl space-y-3 px-4 pt-6 pb-2">
              {visibleCategories.map((cat) => {
                const catTasks = tasksForCategory(cat.id);
                if (isFiltering && catTasks.length === 0) return null;
                return (
                  <CategorySection
                    key={cat.id}
                    category={cat}
                    tasks={catTasks}
                    expandedTaskId={expandedTaskId}
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
                <div className="rounded-md border border-dashed border-ink-20 py-12 text-center">
                  <p className="text-sm text-ink-60">No categories yet</p>
                  <p className="mt-1 text-xs text-ink-40">
                    Add a category below to get started
                  </p>
                </div>
              )}

              {isFiltering &&
                visibleCategories.every(
                  (c) => tasksForCategory(c.id).length === 0
                ) &&
                categories.length > 0 && (
                  <div className="rounded-md border border-dashed border-ink-20 py-12 text-center">
                    <p className="text-sm text-ink-60">
                      No tasks match the current filters
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-xs font-medium text-terra hover:text-terra-muted"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
            </div>

            <AddCategoryInput onAdd={addCategory} />

            <div className="pb-8" />
          </>
        )}
      </main>
    </div>
  );
}
