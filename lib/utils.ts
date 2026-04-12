import { TaskStatus } from "./database.types";

export function cycleStatus(current: TaskStatus): TaskStatus {
  const order: TaskStatus[] = ["not_started", "in_progress", "done"];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}

export function statusLabel(status: TaskStatus): string {
  switch (status) {
    case "not_started":
      return "Not Started";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
  }
}

export function statusColor(status: TaskStatus): string {
  switch (status) {
    case "not_started":
      return "bg-gray-300";
    case "in_progress":
      return "bg-amber-400";
    case "done":
      return "bg-teal-500";
  }
}

export function statusTextColor(status: TaskStatus): string {
  switch (status) {
    case "not_started":
      return "text-gray-500 bg-gray-100";
    case "in_progress":
      return "text-amber-700 bg-amber-50";
    case "done":
      return "text-teal-700 bg-teal-50";
  }
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(y, m - 1, d));
}

export function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function isOverdue(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dateStr.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  return due < today;
}

export function isDueToday(dateStr: string): boolean {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return dateStr === `${yyyy}-${mm}-${dd}`;
}
