"use client";

interface SummaryBarProps {
  total: number;
  completed: number;
}

export default function SummaryBar({ total, completed }: SummaryBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {completed} of {total} tasks complete
        </span>
        <span className="font-medium text-gray-900">{pct}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
