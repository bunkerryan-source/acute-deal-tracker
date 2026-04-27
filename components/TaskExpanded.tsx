"use client";

import { useState } from "react";
import { Task, TaskStatus, UserName } from "@/lib/database.types";
import { statusLabel, formatTimestamp } from "@/lib/utils";
import ConfirmDialog from "./ConfirmDialog";

interface TaskExpandedProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
}

export default function TaskExpanded({
  task,
  onUpdate,
  onDelete,
}: TaskExpandedProps) {
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statuses: TaskStatus[] = ["not_started", "in_progress", "done"];
  const assignees: (UserName | null)[] = ["Ryan", "Matt", null];

  const statusActive: Record<TaskStatus, string> = {
    not_started: "bg-ink text-white",
    in_progress: "bg-navy text-white",
    done: "bg-terra text-white",
  };

  function assigneeActive(a: UserName | null): string {
    if (a === "Ryan") return "bg-terra text-white";
    if (a === "Matt") return "bg-navy text-white";
    return "bg-ink-60 text-white";
  }

  function handleTitleBlur() {
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdate({ title: trimmed });
    } else {
      setTitle(task.title);
    }
  }

  function handleNotesBlur() {
    const value = notes.trim() || null;
    if (value !== task.notes) {
      onUpdate({ notes: value });
    }
  }

  return (
    <div className="flex flex-col gap-4 border-t border-ink-10 bg-paper px-[22px] py-[18px]">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className="w-full rounded border border-ink-10 bg-white px-3 py-2.5 text-[14px] font-medium text-ink outline-none focus:border-terra focus:ring-2 focus:ring-terra/20"
      />

      {/* Status */}
      <div>
        <label className="mb-1.5 block mono-label">Status</label>
        <div className="flex gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => onUpdate({ status: s })}
              className={`rounded px-3 py-1.5 text-[12px] font-medium transition-colors ${
                task.status === s
                  ? statusActive[s]
                  : "border border-ink-10 bg-white text-ink-60 hover:text-ink"
              }`}
            >
              {statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Assignee */}
      <div>
        <label className="mb-1.5 block mono-label">Assigned To</label>
        <div className="flex gap-1.5">
          {assignees.map((a) => (
            <button
              key={a || "unassigned"}
              onClick={() => onUpdate({ assigned_to: a })}
              className={`rounded px-3 py-1.5 text-[12px] font-medium transition-colors ${
                task.assigned_to === a
                  ? assigneeActive(a)
                  : "border border-ink-10 bg-white text-ink-60 hover:text-ink"
              }`}
            >
              {a || "Unassigned"}
            </button>
          ))}
        </div>
      </div>

      {/* Due date */}
      <div>
        <label className="mb-1.5 block mono-label">Due Date</label>
        <input
          type="date"
          value={task.due_date || ""}
          onChange={(e) => onUpdate({ due_date: e.target.value || null })}
          className="rounded border border-ink-10 bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-terra focus:ring-2 focus:ring-terra/20"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1.5 block mono-label">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          rows={3}
          placeholder="Add notes..."
          className="w-full resize-y rounded border border-ink-10 bg-white px-3 py-2.5 text-[13px] leading-[1.5] text-ink outline-none focus:border-terra focus:ring-2 focus:ring-terra/20"
        />
      </div>

      {task.status === "done" && task.completed_by && (
        <div className="flex items-center gap-2 rounded border border-terra/20 bg-terra/[0.07] px-[14px] py-2.5 text-[12px] text-terra">
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>
            Completed by <strong>{task.completed_by}</strong>
            {task.completed_at && (
              <> · {formatTimestamp(task.completed_at)}</>
            )}
          </span>
        </div>
      )}

      {/* Delete */}
      <div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="mono-label hover:text-terra"
        >
          Delete task
        </button>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Task"
          message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
          onConfirm={onDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
