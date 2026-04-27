// Acute Deal Tracker — Reskin (Direction B "Bureau")
// Mirrors the real app structure: Header, SummaryBar, FilterBar, CategorySection
// (with collapsible CategoryHeader, TaskRow, expandable TaskExpanded, AddTaskInput),
// AddCategoryInput. Plus PasswordScreen for the auth gate.

// ---------- Status pill ----------
function StatusIndicator({ status, onClick, accent }) {
  const base = {
    width: 26, height: 26, borderRadius: "50%",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
    transition: "all 120ms ease",
    border: "1.5px solid",
  };
  let s = {};
  if (status === "done") s = { background: accent, borderColor: accent, color: "white" };
  else if (status === "in_progress") s = { background: "var(--navy)", borderColor: "var(--navy)", color: "white" };
  else s = { background: "white", borderColor: "var(--ink-20)" };
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} style={{ ...base, ...s }} title="Click to change status">
      {status === "done" && (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5"/></svg>
      )}
      {status === "in_progress" && (
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />
      )}
    </button>
  );
}

// ---------- Assignee chip ----------
function AssigneeChip({ assignee, onClick, accent }) {
  const common = {
    fontFamily: "var(--font-mono)",
    fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase",
    padding: "3px 8px", borderRadius: 3,
    border: "1px solid", cursor: onClick ? "pointer" : "default",
    background: "transparent",
  };
  if (!assignee) {
    return onClick ? (
      <button onClick={(e) => { e.stopPropagation(); onClick(); }}
        style={{ ...common, borderStyle: "dashed", borderColor: "var(--ink-20)", color: "var(--ink-40)" }}>
        unassigned
      </button>
    ) : null;
  }
  const isRyan = assignee === "Ryan";
  const style = isRyan
    ? { borderColor: accent, color: accent, background: "rgba(191,74,32,0.06)" }
    : { borderColor: "var(--navy)", color: "var(--navy)", background: "rgba(14,30,58,0.05)" };
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick && onClick(); }} style={{ ...common, ...style }}>
      {assignee}
    </button>
  );
}

// ---------- Due date ----------
function DueDate({ iso, isDone }) {
  if (!iso) return null;
  let color = "var(--ink-60)";
  let weight = 400;
  if (!isDone) {
    if (isOverdue(iso)) { color = "#BF4A20"; weight = 500; }
    else if (isDueToday(iso)) { color = "#a64018"; weight = 500; }
  }
  return (
    <span className="mono" style={{ fontSize: 11, color, fontWeight: weight, minWidth: 50, textAlign: "right" }}>
      {formatDate(iso)}
    </span>
  );
}

// ---------- Task row ----------
function TaskRow({ task, isExpanded, onToggleExpand, onUpdate, onDelete, accent }) {
  const isDone = task.status === "done";
  const cycleAssignee = () => {
    const order = [null, "Ryan", "Matt"];
    const next = order[(order.indexOf(task.assigned_to) + 1) % order.length];
    onUpdate(task.id, { assigned_to: next });
  };
  return (
    <div>
      <div
        onClick={() => onToggleExpand(task.id)}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 18px",
          background: isExpanded ? "rgba(14,30,58,0.03)" : "white",
          cursor: "pointer",
          borderLeft: task.status === "in_progress" && !isDone ? `3px solid ${accent}` : "3px solid transparent",
        }}
      >
        <StatusIndicator status={task.status} onClick={() => onUpdate(task.id, { status: cycleStatus(task.status) })} accent={accent} />
        <span style={{
          flex: 1, minWidth: 0, fontSize: 14, lineHeight: 1.35,
          color: isDone ? "var(--ink-40)" : "var(--ink)",
          textDecoration: isDone ? "line-through" : "none",
          fontWeight: 450,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{task.title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <AssigneeChip assignee={task.assigned_to} onClick={cycleAssignee} accent={accent} />
          <DueDate iso={task.due_date} isDone={isDone} />
        </div>
      </div>
      {isExpanded && (
        <TaskExpanded task={task} onUpdate={(u) => onUpdate(task.id, u)} onDelete={() => onDelete(task.id)} accent={accent} />
      )}
    </div>
  );
}

// ---------- Task expanded ----------
function TaskExpanded({ task, onUpdate, onDelete, accent }) {
  const statuses = ["not_started", "in_progress", "done"];
  const assignees = ["Ryan", "Matt", null];
  return (
    <div style={{
      borderTop: "1px solid var(--ink-10)",
      background: "var(--paper)",
      padding: "18px 22px 18px",
      display: "flex", flexDirection: "column", gap: 16,
    }}>
      <input
        defaultValue={task.title}
        onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== task.title) onUpdate({ title: v }); }}
        style={{
          width: "100%", padding: "10px 12px",
          border: "1px solid var(--ink-10)", borderRadius: 4, background: "white",
          fontSize: 14, fontFamily: "var(--font-ui)", fontWeight: 500, color: "var(--ink)",
          outline: "none",
        }}
      />

      <div>
        <div className="mono-label" style={{ marginBottom: 6 }}>Status</div>
        <div style={{ display: "flex", gap: 6 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => onUpdate({ status: s })}
              style={{
                fontFamily: "var(--font-ui)", fontSize: 12, padding: "6px 12px",
                borderRadius: 4, cursor: "pointer",
                background: task.status === s ? (s === "done" ? accent : s === "in_progress" ? "var(--navy)" : "var(--ink)") : "white",
                color: task.status === s ? "white" : "var(--ink-60)",
                border: `1px solid ${task.status === s ? "transparent" : "var(--ink-10)"}`,
                fontWeight: 500,
              }}>
              {statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mono-label" style={{ marginBottom: 6 }}>Assigned to</div>
        <div style={{ display: "flex", gap: 6 }}>
          {assignees.map(a => (
            <button key={a || "u"} onClick={() => onUpdate({ assigned_to: a })}
              style={{
                fontFamily: "var(--font-ui)", fontSize: 12, padding: "6px 12px",
                borderRadius: 4, cursor: "pointer",
                background: task.assigned_to === a
                  ? (a === "Ryan" ? accent : a === "Matt" ? "var(--navy)" : "var(--ink-60)")
                  : "white",
                color: task.assigned_to === a ? "white" : "var(--ink-60)",
                border: `1px solid ${task.assigned_to === a ? "transparent" : "var(--ink-10)"}`,
                fontWeight: 500,
              }}>
              {a || "Unassigned"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div className="mono-label" style={{ marginBottom: 6 }}>Due date</div>
          <input type="date" defaultValue={task.due_date || ""}
            onChange={(e) => onUpdate({ due_date: e.target.value || null })}
            style={{ padding: "8px 12px", border: "1px solid var(--ink-10)", borderRadius: 4, background: "white", fontSize: 13, fontFamily: "var(--font-ui)", color: "var(--ink)", outline: "none", width: "100%" }} />
        </div>
        <div />
      </div>

      <div>
        <div className="mono-label" style={{ marginBottom: 6 }}>Notes</div>
        <textarea defaultValue={task.notes || ""} rows={3} placeholder="Add notes…"
          onBlur={(e) => onUpdate({ notes: e.target.value.trim() || null })}
          style={{
            width: "100%", padding: "10px 12px",
            border: "1px solid var(--ink-10)", borderRadius: 4, background: "white",
            fontSize: 13, fontFamily: "var(--font-ui)", color: "var(--ink)", outline: "none",
            resize: "vertical", lineHeight: 1.5,
          }} />
      </div>

      {task.status === "done" && task.completed_by && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 14px",
          background: "rgba(191,74,32,0.07)",
          border: `1px solid rgba(191,74,32,0.20)`,
          borderRadius: 4,
          fontSize: 12, color: accent,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5"/></svg>
          <span>Completed by <strong style={{ fontWeight: 600 }}>{task.completed_by}</strong>{task.completed_at && <> · {formatTimestamp(task.completed_at)}</>}</span>
        </div>
      )}

      <div style={{ paddingTop: 4 }}>
        <button onClick={onDelete} style={{
          background: "transparent", border: "none", padding: 0, cursor: "pointer",
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em",
          textTransform: "uppercase", color: "var(--ink-40)",
        }}>
          Delete task
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { StatusIndicator, AssigneeChip, DueDate, TaskRow, TaskExpanded });
