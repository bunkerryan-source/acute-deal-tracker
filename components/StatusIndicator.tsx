"use client";

import { TaskStatus } from "@/lib/database.types";

interface StatusIndicatorProps {
  status: TaskStatus;
  onClick: () => void;
}

const stateClass: Record<TaskStatus, string> = {
  not_started: "bg-white border-ink-20",
  in_progress: "bg-navy border-navy",
  done: "bg-terra border-terra",
};

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
      className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${stateClass[status]}`}
      title="Click to change status"
    >
      {status === "done" && (
        <svg
          className="h-[13px] w-[13px] text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {status === "in_progress" && (
        <div className="h-[7px] w-[7px] rounded-full bg-white" />
      )}
    </button>
  );
}
