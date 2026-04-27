// Acute Deal Tracker — Bureau direction (Option B reskin)
// Full app shell: PasswordScreen + AppShell (Header, SummaryBar, FilterBar,
// CategorySection w/ CategoryHeader + AddTaskInput, AddCategoryInput).

// ---------- Password screen ----------
function PasswordScreen({ onUnlock }) {
  const [pw, setPw] = React.useState("");
  const [err, setErr] = React.useState(false);
  const [shake, setShake] = React.useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (pw === "letmein") onUnlock();
    else { setErr(true); setShake(true); setPw(""); setTimeout(() => setShake(false), 500); }
  };
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--stone)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background triangle motif */}
      <svg style={{ position: "absolute", bottom: -80, right: -80, opacity: 0.08 }} width="360" height="360" viewBox="0 0 360 360">
        <path d="M360 120 L120 360 L360 360 Z" fill="#0E1E3A" />
      </svg>

      <div style={{
        width: 380, padding: "36px 36px 32px",
        background: "white",
        border: "1px solid var(--ink-10)",
        borderRadius: 8,
        animation: shake ? "shake 0.5s ease-in-out" : "none",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <AcuteLockup size={26} fg="var(--navy)" />
        </div>
        <h1 style={{ margin: 0, textAlign: "center", fontSize: 18, fontWeight: 500, color: "var(--ink)" }}>Acute Deal Tracker</h1>
        <p className="mono-label" style={{ textAlign: "center", marginTop: 6, marginBottom: 24 }}>Enter password to continue</p>
        <form onSubmit={submit}>
          <input type="password" autoFocus value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(false); }}
            placeholder="Password"
            style={{
              width: "100%", padding: "12px 14px",
              border: `1px solid ${err ? "#BF4A20" : "var(--ink-20)"}`,
              borderRadius: 4, fontSize: 14, fontFamily: "var(--font-ui)",
              outline: "none", color: "var(--ink)", background: "white",
            }} />
          {err && <div style={{ marginTop: 8, color: "#BF4A20", fontSize: 12 }}>Incorrect password</div>}
          <button type="submit" className="btn btn-primary" style={{ marginTop: 16, width: "100%", justifyContent: "center", padding: "12px 14px", fontSize: 14, borderRadius: 4 }}>
            Continue
          </button>
        </form>
        <div className="mono-label" style={{ textAlign: "center", marginTop: 22, color: "var(--ink-40)" }}>
          Hint: letmein
        </div>
      </div>
    </div>
  );
}

// ---------- Header ----------
function Header({ currentUser, onSelectUser, accent }) {
  return (
    <header style={{
      background: "var(--navy)", color: "white",
      padding: "14px 28px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "relative", overflow: "hidden",
    }}>
      <svg style={{ position: "absolute", bottom: -30, right: -30, opacity: 0.08 }} width="160" height="160" viewBox="0 0 160 160">
        <path d="M160 50 L50 160 L160 160 Z" fill="white" />
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
        <AcuteLockup size={22} fg="white" />
        <span style={{ width: 1, height: 18, background: "rgba(255,255,255,0.20)" }} />
        <span style={{ fontSize: 13, fontWeight: 450, color: "rgba(255,255,255,0.85)", letterSpacing: "0.01em" }}>Deal Tracker</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
        <span className="mono-label" style={{ color: "rgba(255,255,255,0.5)" }}>Working as</span>
        <div style={{ display: "flex", padding: 3, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
          {["Ryan", "Matt"].map(name => (
            <button key={name} onClick={() => onSelectUser(name)}
              style={{
                padding: "5px 14px", fontSize: 12, fontWeight: 500,
                background: currentUser === name ? accent : "transparent",
                color: currentUser === name ? "white" : "rgba(255,255,255,0.7)",
                border: "none", borderRadius: 3, cursor: "pointer",
                fontFamily: "var(--font-ui)",
              }}>
              {name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

// ---------- Summary ----------
function SummaryBar({ total, completed, accent }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div style={{
      background: "white",
      borderBottom: "1px solid var(--ink-10)",
      padding: "16px 28px",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span className="mono-label">Progress</span>
          <span style={{ fontSize: 14, color: "var(--ink-60)" }}>
            <strong style={{ color: "var(--ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{completed}</strong> of <strong style={{ color: "var(--ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{total}</strong> tasks complete
          </span>
        </div>
        <span className="mono" style={{ fontSize: 18, fontWeight: 500, color: accent, fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: "var(--ink-06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: accent, transition: "width 500ms ease" }} />
      </div>
    </div>
  );
}

// ---------- Filter bar ----------
function FilterBar({ assigneeFilter, statusFilter, onAssigneeChange, onStatusChange, accent }) {
  const Pill = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding: "5px 12px", fontSize: 12, fontWeight: 500,
      background: active ? "var(--navy)" : "white",
      color: active ? "white" : "var(--ink-60)",
      border: `1px solid ${active ? "var(--navy)" : "var(--ink-10)"}`,
      borderRadius: 3, cursor: "pointer", fontFamily: "var(--font-ui)",
    }}>{label}</button>
  );
  return (
    <div style={{
      background: "var(--stone-2)",
      borderBottom: "1px solid var(--ink-10)",
      padding: "12px 28px",
      display: "flex", alignItems: "center", gap: 24,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="mono-label">Who</span>
        {["All", "Ryan", "Matt"].map(o => (
          <Pill key={o} label={o} active={assigneeFilter === o} onClick={() => onAssigneeChange(o)} />
        ))}
      </div>
      <span style={{ width: 1, height: 18, background: "var(--ink-10)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="mono-label">Status</span>
        {[["All", "All"], ["not_started", "Not started"], ["in_progress", "In progress"], ["done", "Done"]].map(([k, l]) => (
          <Pill key={k} label={l} active={statusFilter === k} onClick={() => onStatusChange(k)} />
        ))}
      </div>
    </div>
  );
}

// ---------- Category section ----------
function CategorySection({ category, tasks, expandedTaskId, onToggleExpand, onUpdate, onDelete, onAddTask, onRenameCategory, accent }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const done = tasks.filter(t => t.status === "done").length;
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(category.name);
  const save = () => {
    const v = name.trim();
    if (v && v !== category.name) onRenameCategory(category.id, v);
    else setName(category.name);
    setEditing(false);
  };
  return (
    <div style={{
      background: "white",
      border: "1px solid var(--ink-10)",
      borderRadius: 6,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "14px 18px",
        background: "var(--stone-2)",
        borderBottom: collapsed ? "none" : "1px solid var(--ink-10)",
      }}>
        <button onClick={() => setCollapsed(!collapsed)} style={{
          width: 22, height: 22, background: "transparent", border: "none", cursor: "pointer",
          color: "var(--ink-60)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? "rotate(0deg)" : "rotate(90deg)", transition: "transform 200ms" }}>
            <path d="m9 5 7 7-7 7"/>
          </svg>
        </button>
        {editing ? (
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
            onBlur={save} onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") { setName(category.name); setEditing(false); } }}
            style={{
              flex: 1, padding: "4px 8px", fontSize: 14, fontWeight: 600,
              border: `1px solid ${accent}`, borderRadius: 3, outline: "none",
              background: "white", color: "var(--ink)", fontFamily: "var(--font-ui)",
            }} />
        ) : (
          <button onClick={() => setEditing(true)} style={{
            flex: 1, textAlign: "left", padding: 0,
            background: "transparent", border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 600, color: "var(--ink)", fontFamily: "var(--font-ui)",
            letterSpacing: "0.01em",
          }}>
            {category.name}
          </button>
        )}
        <span className="mono" style={{
          fontSize: 11, padding: "3px 8px",
          background: "white", border: "1px solid var(--ink-10)",
          color: "var(--ink-60)", borderRadius: 3,
          fontVariantNumeric: "tabular-nums",
        }}>
          {done}/{tasks.length}
        </span>
      </div>

      {!collapsed && (
        <div>
          {tasks.length > 0 ? (
            <div>
              {tasks.map((t, i) => (
                <div key={t.id} style={{ borderBottom: i < tasks.length - 1 ? "1px solid var(--ink-06)" : "none" }}>
                  <TaskRow task={t} isExpanded={expandedTaskId === t.id} onToggleExpand={onToggleExpand}
                    onUpdate={onUpdate} onDelete={onDelete} accent={accent} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "24px", textAlign: "center", fontSize: 12, color: "var(--ink-40)" }} className="mono-label">
              No tasks yet
            </div>
          )}
          <AddTaskInput categoryId={category.id} onAdd={onAddTask} accent={accent} />
        </div>
      )}
    </div>
  );
}

// ---------- Add task input ----------
function AddTaskInput({ categoryId, onAdd, accent }) {
  const [v, setV] = React.useState("");
  const submit = (e) => {
    e.preventDefault();
    const t = v.trim();
    if (!t) return;
    onAdd(categoryId, t);
    setV("");
  };
  return (
    <form onSubmit={submit} style={{
      padding: "10px 18px",
      background: "var(--paper)",
      borderTop: "1px solid var(--ink-06)",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <Icon name="plus" size={14} color="var(--ink-40)" />
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Add task…"
        style={{
          flex: 1, border: "none", outline: "none", background: "transparent",
          fontSize: 13, fontFamily: "var(--font-ui)", color: "var(--ink)",
          padding: "4px 0",
        }} />
      {v && (
        <button type="submit" className="mono" style={{
          fontSize: 10, padding: "3px 8px",
          background: accent, color: "white", border: "none", borderRadius: 3,
          cursor: "pointer", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>Add ↵</button>
      )}
    </form>
  );
}

// ---------- Add category ----------
function AddCategoryInput({ onAdd, accent }) {
  const [open, setOpen] = React.useState(false);
  const [v, setV] = React.useState("");
  const submit = (e) => {
    e.preventDefault();
    const t = v.trim();
    if (!t) return;
    onAdd(t); setV(""); setOpen(false);
  };
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        width: "100%", padding: "14px",
        border: "1px dashed var(--ink-20)", borderRadius: 6, background: "transparent",
        color: "var(--ink-60)", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-ui)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        <Icon name="plus" size={14} color="var(--ink-60)" /> Add category
      </button>
    );
  }
  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
      <input autoFocus value={v} onChange={(e) => setV(e.target.value)}
        placeholder="Category name"
        onKeyDown={(e) => { if (e.key === "Escape") { setOpen(false); setV(""); } }}
        style={{
          flex: 1, padding: "10px 14px",
          border: "1px solid var(--ink-20)", borderRadius: 4,
          fontSize: 13, fontFamily: "var(--font-ui)", outline: "none",
          background: "white", color: "var(--ink)",
        }} />
      <button type="submit" className="btn btn-primary" style={{ background: accent, padding: "8px 16px" }}>Add</button>
      <button type="button" onClick={() => { setOpen(false); setV(""); }} className="btn btn-ghost" style={{ padding: "8px 14px" }}>Cancel</button>
    </form>
  );
}

// ---------- Main App Shell ----------
function AppShell({ accent }) {
  const [tasks, setTasks] = React.useState(SEED_TASKS);
  const [categories, setCategories] = React.useState(SEED_CATEGORIES);
  const [currentUser, setCurrentUser] = React.useState("Ryan");
  const [assigneeFilter, setAssigneeFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [expandedId, setExpandedId] = React.useState("t5");

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const merged = { ...t, ...updates };
      if (updates.status === "done" && t.status !== "done") {
        merged.completed_by = currentUser;
        merged.completed_at = new Date().toISOString();
      }
      if (updates.status && updates.status !== "done") {
        merged.completed_by = null;
        merged.completed_at = null;
      }
      return merged;
    }));
  };
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const addTask = (catId, title) => setTasks(prev => [...prev, {
    id: "t" + Math.random().toString(36).slice(2, 8),
    category_id: catId, title, status: "not_started", assigned_to: null,
    due_date: null, notes: "", completed_by: null, completed_at: null,
  }]);
  const renameCategory = (id, name) => setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  const addCategory = (name) => setCategories(prev => [...prev, {
    id: "c" + Math.random().toString(36).slice(2, 6), name, sort_order: prev.length + 1
  }]);

  const filtered = tasks.filter(t => {
    if (assigneeFilter !== "All" && t.assigned_to !== assigneeFilter) return false;
    if (statusFilter !== "All" && t.status !== statusFilter) return false;
    return true;
  });
  const isFiltering = assigneeFilter !== "All" || statusFilter !== "All";
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "done").length;

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--stone)",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--font-ui)", color: "var(--ink)",
      overflow: "hidden",
    }}>
      <Header currentUser={currentUser} onSelectUser={setCurrentUser} accent={accent} />
      <SummaryBar total={total} completed={completed} accent={accent} />
      <FilterBar
        assigneeFilter={assigneeFilter} statusFilter={statusFilter}
        onAssigneeChange={setAssigneeFilter} onStatusChange={setStatusFilter}
        accent={accent}
      />

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px 28px 60px", display: "flex", flexDirection: "column", gap: 14 }}>
          {categories.map(cat => {
            const ct = filtered.filter(t => t.category_id === cat.id);
            if (isFiltering && ct.length === 0) return null;
            return (
              <CategorySection key={cat.id} category={cat} tasks={ct}
                expandedTaskId={expandedId}
                onToggleExpand={(id) => setExpandedId(prev => prev === id ? null : id)}
                onUpdate={updateTask} onDelete={deleteTask} onAddTask={addTask}
                onRenameCategory={renameCategory} accent={accent} />
            );
          })}
          <div style={{ marginTop: 8 }}>
            <AddCategoryInput onAdd={addCategory} accent={accent} />
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PasswordScreen, Header, SummaryBar, FilterBar, CategorySection, AddTaskInput, AddCategoryInput, AppShell });
