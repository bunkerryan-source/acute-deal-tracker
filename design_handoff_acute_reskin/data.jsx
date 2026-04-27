// Sample data matching the real app's data model
const SEED_CATEGORIES = [
  { id: "c1", name: "Transition", sort_order: 1 },
  { id: "c2", name: "Bank Debt", sort_order: 2 },
  { id: "c3", name: "Capital Raise", sort_order: 3 },
  { id: "c4", name: "Transaction Docs", sort_order: 4 },
  { id: "c5", name: "Buyer Formation", sort_order: 5 },
];

const SEED_TASKS = [
  // Transition
  { id: "t1",  category_id: "c1", title: "Schedule kickoff call with seller's CFO", status: "done", assigned_to: "Ryan", due_date: "2026-04-18", completed_by: "Ryan", completed_at: "2026-04-18T17:30:00Z", notes: "Good call. Aligned on data room access." },
  { id: "t2",  category_id: "c1", title: "Compile list of operational handover items", status: "in_progress", assigned_to: "Matt", due_date: "2026-04-28", notes: "" },
  { id: "t3",  category_id: "c1", title: "Draft 90-day transition plan", status: "not_started", assigned_to: "Ryan", due_date: "2026-05-05", notes: "" },
  { id: "t4",  category_id: "c1", title: "Identify key employee retention candidates", status: "not_started", assigned_to: null, due_date: null, notes: "" },

  // Bank Debt
  { id: "t5",  category_id: "c2", title: "Submit SBA 7(a) application package", status: "in_progress", assigned_to: "Ryan", due_date: "2026-04-25", notes: "Last item: updated personal financial statement." },
  { id: "t6",  category_id: "c2", title: "Provide 3 years of personal tax returns", status: "done", assigned_to: "Ryan", due_date: "2026-04-15", completed_by: "Ryan", completed_at: "2026-04-14T22:11:00Z", notes: "" },
  { id: "t7",  category_id: "c2", title: "Schedule appraisal of company assets", status: "not_started", assigned_to: "Matt", due_date: "2026-05-08", notes: "" },
  { id: "t8",  category_id: "c2", title: "Review term sheet from Live Oak", status: "not_started", assigned_to: "Ryan", due_date: "2026-04-30", notes: "" },

  // Capital Raise
  { id: "t9",  category_id: "c3", title: "Finalize investor deck v3", status: "in_progress", assigned_to: "Matt", due_date: "2026-04-26", notes: "Add updated financials from Q1." },
  { id: "t10", category_id: "c3", title: "Send commitment letters to top 5 LPs", status: "not_started", assigned_to: "Matt", due_date: "2026-05-02", notes: "" },
  { id: "t11", category_id: "c3", title: "Confirm $2.5M equity bridge", status: "not_started", assigned_to: null, due_date: "2026-05-15", notes: "" },

  // Transaction Docs
  { id: "t12", category_id: "c4", title: "Review APA redlines from seller counsel", status: "in_progress", assigned_to: "Ryan", due_date: "2026-04-25", notes: "Section 5.4 indemnification basket." },
  { id: "t13", category_id: "c4", title: "Finalize working capital target", status: "not_started", assigned_to: "Matt", due_date: "2026-05-01", notes: "" },
  { id: "t14", category_id: "c4", title: "Execute escrow agreement", status: "not_started", assigned_to: null, due_date: null, notes: "" },
  { id: "t15", category_id: "c4", title: "Draft non-compete for seller", status: "done", assigned_to: "Matt", due_date: "2026-04-10", completed_by: "Matt", completed_at: "2026-04-09T15:00:00Z", notes: "" },

  // Buyer Formation
  { id: "t16", category_id: "c5", title: "File Delaware C-corp formation docs", status: "done", assigned_to: "Ryan", due_date: "2026-04-05", completed_by: "Ryan", completed_at: "2026-04-04T19:45:00Z", notes: "" },
  { id: "t17", category_id: "c5", title: "Open business banking account", status: "in_progress", assigned_to: "Ryan", due_date: "2026-04-28", notes: "" },
  { id: "t18", category_id: "c5", title: "Obtain EIN from IRS", status: "done", assigned_to: "Matt", due_date: "2026-04-08", completed_by: "Matt", completed_at: "2026-04-07T12:00:00Z", notes: "" },
];

window.SEED_CATEGORIES = SEED_CATEGORIES;
window.SEED_TASKS = SEED_TASKS;

// Helpers
window.statusLabel = (s) => ({ not_started: "Not started", in_progress: "In progress", done: "Done" }[s]);
window.formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
window.formatTimestamp = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
window.isOverdue = (iso) => {
  if (!iso) return false;
  const d = new Date(iso + "T23:59:59");
  return d < new Date();
};
window.isDueToday = (iso) => {
  if (!iso) return false;
  const d = new Date(iso + "T12:00:00");
  const t = new Date();
  return d.toDateString() === t.toDateString();
};
window.cycleStatus = (s) => ({ not_started: "in_progress", in_progress: "done", done: "not_started" }[s]);
