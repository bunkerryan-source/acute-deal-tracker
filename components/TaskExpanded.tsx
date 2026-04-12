"use client";

import { useState } from "react";
import { Task, TaskStatus, UserName } from "@/lib/database.types";
import { statusLabel, statusTextColor, formatTimestamp } from "@/lib/utils";
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
    <div className="border-t border-gray-100 bg-gray-50/50 px-3 pb-4 pt-3">
      <div className="space-y-3">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />

        {/* Status */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Status
          </label>
          <div className="flex gap-1.5">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => onUpdate({ status: s })}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  task.status === s
                    ? statusTextColor(s)
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {statusLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Assignee */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Assigned To
          </label>
          <div className="flex gap-1.5">
            {assignees.map((a) => (
              <button
                key={a || "unassigned"}
                onClick={() => onUpdate({ assigned_to: a })}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  task.assigned_to === a
                    ? a === "Ryan"
                      ? "bg-teal-50 text-teal-700"
                      : a === "Matt"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-200 text-gray-700"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {a || "Unassigned"}
              </button>
            ))}
          </div>
        </div>

        {/* Due date */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Due Date
          </label>
          <input
            type="date"
            value={task.due_date || ""}
            onChange={(e) =>
              onUpdate({ due_date: e.target.value || null })
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            rows={3}
            placeholder="Add notes..."
            className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Completed info */}
        {task.status === "done" && task.completed_by && (
          <div className="rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-700">
            Completed by {task.completed_by}
            {task.completed_at && <> on {formatTimestamp(task.completed_at)}</>}
          </div>
        )}

        {/* Delete */}
        <div className="pt-1">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs font-medium text-red-500 hover:text-red-700"
          >
            Delete task
          </button>
        </div>
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
