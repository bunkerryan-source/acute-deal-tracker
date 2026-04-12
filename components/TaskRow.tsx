"use client";

import { Task, UserName } from "@/lib/database.types";
import { cycleStatus, formatDate, isOverdue, isDueToday } from "@/lib/utils";
import StatusIndicator from "./StatusIndicator";
import AssigneeChip from "./AssigneeChip";
import TaskExpanded from "./TaskExpanded";

interface TaskRowProps {
  task: Task;
  isExpanded: boolean;
  currentUser: UserName | null;
  onToggleExpand: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskRow({
  task,
  isExpanded,
  currentUser,
  onToggleExpand,
  onUpdate,
  onDelete,
}: TaskRowProps) {
  const isDone = task.status === "done";

  function handleStatusCycle() {
    const nextStatus = cycleStatus(task.status);
    onUpdate(task.id, { status: nextStatus });
  }

  function handleAssigneeCycle() {
    const order: (UserName | null)[] = [null, "Ryan", "Matt"];
    const idx = order.indexOf(task.assigned_to);
    const next = order[(idx + 1) % order.length];
    onUpdate(task.id, { assigned_to: next });
  }

  let dueDateColor = "text-gray-500";
  if (task.due_date && !isDone) {
    if (isOverdue(task.due_date)) {
      dueDateColor = "text-red-500 font-medium";
    } else if (isDueToday(task.due_date)) {
      dueDateColor = "text-amber-600 font-medium";
    }
  }

  return (
    <div>
      <div
        onClick={onToggleExpand}
        className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors hover:bg-gray-50 ${
          isExpanded ? "bg-gray-50" : ""
        }`}
      >
        <StatusIndicator status={task.status} onClick={handleStatusCycle} />
        <span
          className={`flex-1 truncate text-sm ${
            isDone ? "text-gray-400 line-through" : "text-gray-900"
          }`}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <AssigneeChip
            assignee={task.assigned_to}
            onClick={handleAssigneeCycle}
          />
          {task.due_date && (
            <span className={`text-xs ${dueDateColor}`}>
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
      </div>
      <div
        className="grid transition-all duration-200"
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          {isExpanded && (
            <TaskExpanded
              task={task}
              onUpdate={(updates) => onUpdate(task.id, updates)}
              onDelete={() => onDelete(task.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
