export type TaskStatus = "not_started" | "in_progress" | "done";
export type UserName = "Ryan" | "Matt";

export interface Category {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface Task {
  id: string;
  category_id: string;
  title: string;
  notes: string | null;
  status: TaskStatus;
  assigned_to: UserName | null;
  due_date: string | null;
  completed_by: UserName | null;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
