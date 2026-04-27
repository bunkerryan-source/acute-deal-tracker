"use client";

import { Task, UserName } from "@/lib/database.types";
import { cycleStatus, formatDate, isOverdue, isDueToday } from "@/lib/utils";
import StatusIndicator from "./StatusIndicator";
import AssigneeChip from "./AssigneeChip";
import TaskExpanded from "./TaskExpanded";

interface TaskRowProps {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskRow({
  task,
  isExpanded,
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

  let dueDateColor = "text-ink-60";
  if (task.due_date && !isDone) {
    if (isOverdue(task.due_date)) {
      dueDateColor = "text-terra font-medium";
    } else if (isDueToday(task.due_date)) {
      dueDateColor = "text-terra-muted font-medium";
    }
  }

  const accentBorder =
    task.status === "in_progress" ? "border-l-terra" : "border-l-transparent";

  return (
    <div>
      <div
        onClick={onToggleExpand}
        className={`flex cursor-pointer items-center gap-3 border-l-[3px] px-[18px] py-3 transition-colors hover:bg-[rgba(14,30,58,0.03)] ${accentBorder} ${
          isExpanded ? "bg-[rgba(14,30,58,0.03)]" : ""
        }`}
      >
        <StatusIndicator status={task.status} onClick={handleStatusCycle} />
        <span
          className={`flex-1 truncate text-[14px] font-[450] leading-[1.35] ${
            isDone ? "text-ink-40 line-through" : "text-ink"
          }`}
        >
          {task.title}
        </span>
        <div className="flex shrink-0 items-center gap-2.5">
          <AssigneeChip
            assignee={task.assigned_to}
            onClick={handleAssigneeCycle}
          />
          {task.due_date && (
            <span
              className={`min-w-[50px] text-right ${dueDateColor}`}
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: 11,
                fontVariantNumeric: "tabular-nums",
              }}
            >
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
