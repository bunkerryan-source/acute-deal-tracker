"use client";

import { TaskStatus, UserName } from "@/lib/database.types";
import { statusLabel } from "@/lib/utils";

type AssigneeFilter = "All" | UserName;
type StatusFilter = "All" | TaskStatus;

interface FilterBarProps {
  assigneeFilter: AssigneeFilter;
  statusFilter: StatusFilter;
  onAssigneeChange: (v: AssigneeFilter) => void;
  onStatusChange: (v: StatusFilter) => void;
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-teal-600 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

export default function FilterBar({
  assigneeFilter,
  statusFilter,
  onAssigneeChange,
  onStatusChange,
}: FilterBarProps) {
  const assigneeOptions: AssigneeFilter[] = ["All", "Ryan", "Matt"];
  const statusOptions: StatusFilter[] = [
    "All",
    "not_started",
    "in_progress",
    "done",
  ];

  return (
    <div className="mx-auto w-full max-w-3xl overflow-x-auto px-4 pb-2">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
            Who
          </span>
          {assigneeOptions.map((opt) => (
            <Pill
              key={opt}
              label={opt}
              active={assigneeFilter === opt}
              onClick={() => onAssigneeChange(opt)}
            />
          ))}
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-1.5">
          <span className="mr-1 text-xs font-medium text-gray-400 uppercase tracking-wide">
            Status
          </span>
          {statusOptions.map((opt) => (
            <Pill
              key={opt}
              label={opt === "All" ? "All" : statusLabel(opt)}
              active={statusFilter === opt}
              onClick={() => onStatusChange(opt)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
