"use client";

import { TaskStatus } from "@/lib/database.types";
import { statusColor } from "@/lib/utils";

interface StatusIndicatorProps {
  status: TaskStatus;
  onClick: () => void;
}

export default function StatusIndicator({
  status,
  onClick,
}: StatusIndicatorProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:ring-2 hover:ring-gray-300 ${statusColor(
        status
      )}`}
      title={`Click to change status`}
    >
      {status === "done" && (
        <svg
          className="h-3.5 w-3.5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
      {status === "in_progress" && (
        <div className="h-2 w-2 rounded-full bg-white" />
      )}
    </button>
  );
}
