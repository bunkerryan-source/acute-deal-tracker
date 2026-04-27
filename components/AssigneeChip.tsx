"use client";

import { UserName } from "@/lib/database.types";

interface AssigneeChipProps {
  assignee: UserName | null;
  onClick?: () => void;
}

const baseClass =
  "rounded-[3px] border px-2 py-[3px] uppercase tracking-[0.06em]";
const monoStyle: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono)",
  fontSize: 10,
  letterSpacing: "0.06em",
};

export default function AssigneeChip({ assignee, onClick }: AssigneeChipProps) {
  if (!assignee) {
    return onClick ? (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`${baseClass} border-dashed border-ink-20 text-ink-40 hover:text-ink-60`}
        style={monoStyle}
      >
        unassigned
      </button>
    ) : null;
  }

  const colors =
    assignee === "Ryan"
      ? "border-terra text-terra bg-terra/[0.06]"
      : "border-navy text-navy bg-navy/[0.05]";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`${baseClass} ${colors}`}
      style={monoStyle}
    >
      {assignee}
    </button>
  );
}
