"use client";

import { useState, useCallback } from "react";
import { Task, TaskStatus, UserName } from "@/lib/database.types";

type AssigneeFilter = "All" | UserName;
type StatusFilter = "All" | TaskStatus;

export function useFilters() {
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filterTasks = useCallback(
    (tasks: Task[]): Task[] => {
      return tasks.filter((t) => {
        if (assigneeFilter !== "All" && t.assigned_to !== assigneeFilter)
          return false;
        if (statusFilter !== "All" && t.status !== statusFilter) return false;
        return true;
      });
    },
    [assigneeFilter, statusFilter]
  );

  return {
    assigneeFilter,
    statusFilter,
    setAssigneeFilter,
    setStatusFilter,
    filterTasks,
  };
}
