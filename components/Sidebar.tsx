"use client";

import { Category, Task, TaskStatus, UserName } from "@/lib/database.types";
import { statusLabel } from "@/lib/utils";

type AssigneeFilter = "All" | UserName;
type StatusFilter = "All" | TaskStatus;
type CategoryFilter = "All" | string;

interface SidebarProps {
  categories: Category[];
  tasks: Task[];
  assigneeFilter: AssigneeFilter;
  statusFilter: StatusFilter;
  categoryFilter: CategoryFilter;
  onAssigneeChange: (v: AssigneeFilter) => void;
  onStatusChange: (v: StatusFilter) => void;
  onCategoryChange: (v: CategoryFilter) => void;
  onResetFilters: () => void;
  isFiltering: boolean;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

interface FilterRowProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

function FilterRow({ label, count, active, onClick }: FilterRowProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-md border-l-2 px-3 py-2 text-left text-sm transition-colors ${
        active
          ? "border-teal-600 bg-teal-50 font-medium text-teal-900"
          : "border-transparent text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span
          className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs ${
            active
              ? "bg-teal-100 text-teal-800"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </p>
  );
}

export default function Sidebar({
  categories,
  tasks,
  assigneeFilter,
  statusFilter,
  categoryFilter,
  onAssigneeChange,
  onStatusChange,
  onCategoryChange,
  onResetFilters,
  isFiltering,
  isMobileOpen,
  onMobileClose,
}: SidebarProps) {
  // Counts respect Who and Status filters but ignore the active Category filter,
  // so a user can see what each category would yield without first changing tabs.
  function categoryCount(categoryId: string | "All"): number {
    return tasks.filter((t) => {
      if (assigneeFilter !== "All" && t.assigned_to !== assigneeFilter)
        return false;
      if (statusFilter !== "All" && t.status !== statusFilter) return false;
      if (categoryId !== "All" && t.category_id !== categoryId) return false;
      return true;
    }).length;
  }

  const handleSelect = (action: () => void) => () => {
    action();
    onMobileClose();
  };

  const content = (
    <>
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-lg font-bold text-gray-900">
          Acute Deal Tracker
        </h1>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-2 pb-6">
        <div>
          <SectionLabel>Category</SectionLabel>
          <div className="space-y-0.5">
            <FilterRow
              label="All Categories"
              count={categoryCount("All")}
              active={categoryFilter === "All"}
              onClick={handleSelect(() => onCategoryChange("All"))}
            />
            {categories.map((cat) => (
              <FilterRow
                key={cat.id}
                label={cat.name}
                count={categoryCount(cat.id)}
                active={categoryFilter === cat.id}
                onClick={handleSelect(() => onCategoryChange(cat.id))}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Who</SectionLabel>
          <div className="space-y-0.5">
            {(["All", "Ryan", "Matt"] as AssigneeFilter[]).map((opt) => (
              <FilterRow
                key={opt}
                label={opt}
                active={assigneeFilter === opt}
                onClick={handleSelect(() => onAssigneeChange(opt))}
              />
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Status</SectionLabel>
          <div className="space-y-0.5">
            {(
              ["All", "not_started", "in_progress", "done"] as StatusFilter[]
            ).map((opt) => (
              <FilterRow
                key={opt}
                label={opt === "All" ? "All" : statusLabel(opt)}
                active={statusFilter === opt}
                onClick={handleSelect(() => onStatusChange(opt))}
              />
            ))}
          </div>
        </div>

        {isFiltering && (
          <div className="px-3">
            <button
              onClick={handleSelect(onResetFilters)}
              className="text-xs font-medium text-teal-700 hover:text-teal-800"
            >
              Reset filters
            </button>
          </div>
        )}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop: persistent sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white">
        {content}
      </aside>

      {/* Mobile: slide-in drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          isMobileOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!isMobileOpen}
      >
        <div
          onClick={onMobileClose}
          className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-64 flex-col border-r border-gray-200 bg-white shadow-lg transition-transform duration-200 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {content}
        </aside>
      </div>
    </>
  );
}
