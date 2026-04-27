"use client";

import { Task } from "@/lib/database.types";

interface SummaryBarProps {
  tasks: Task[];
}

export default function SummaryBar({ tasks }: SummaryBarProps) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="border-b border-ink-10 bg-white px-5 py-4 sm:px-7">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="mono-label">Progress</span>
          <span className="text-[13px] text-ink-60">
            <strong className="font-semibold text-ink">{done}</strong> of{" "}
            <strong className="font-semibold text-ink">{total}</strong> tasks complete
          </span>
        </div>
        <span
          className="text-terra"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 18,
            fontWeight: 500,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {pct}%
        </span>
      </div>
      <div className="mt-2.5 h-1 overflow-hidden rounded-sm bg-ink-06">
        <div
          className="h-full bg-terra transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
