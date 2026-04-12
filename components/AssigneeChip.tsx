"use client";

import { UserName } from "@/lib/database.types";

interface AssigneeChipProps {
  assignee: UserName | null;
  onClick?: () => void;
}

export default function AssigneeChip({ assignee, onClick }: AssigneeChipProps) {
  if (!assignee) {
    return onClick ? (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="rounded-full border border-dashed border-gray-300 px-2 py-0.5 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-500"
      >
        --
      </button>
    ) : null;
  }

  const colors =
    assignee === "Ryan"
      ? "bg-teal-50 text-teal-700 border-teal-200"
      : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${colors}`}
    >
      {assignee}
    </button>
  );
}
