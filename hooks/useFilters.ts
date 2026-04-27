"use client";

import { useState, useCallback } from "react";
import { Task, TaskStatus, UserName } from "@/lib/database.types";

type AssigneeFilter = "All" | UserName;
type StatusFilter = "All" | TaskStatus;
type CategoryFilter = "All" | string;

export function useFilters() {
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");

  const filterTasks = useCallback(
    (tasks: Task[]): Task[] => {
      return tasks.filter((t) => {
        if (assigneeFilter !== "All" && t.assigned_to !== assigneeFilter)
          return false;
        if (statusFilter !== "All" && t.status !== statusFilter) return false;
        if (categoryFilter !== "All" && t.category_id !== categoryFilter)
          return false;
        return true;
      });
    },
    [assigneeFilter, statusFilter, categoryFilter]
  );

  const resetFilters = useCallback(() => {
    setAssigneeFilter("All");
    setStatusFilter("All");
    setCategoryFilter("All");
  }, []);

  const isFiltering =
    assigneeFilter !== "All" ||
    statusFilter !== "All" ||
    categoryFilter !== "All";

  return {
    assigneeFilter,
    statusFilter,
    categoryFilter,
    setAssigneeFilter,
    setStatusFilter,
    setCategoryFilter,
    filterTasks,
    resetFilters,
    isFiltering,
  };
}
