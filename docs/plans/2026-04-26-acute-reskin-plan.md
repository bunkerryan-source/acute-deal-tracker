# Acute Brand Reskin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Acute Logistics brand to the existing Next.js task tracker per the spec at `docs/specs/2026-04-26-acute-reskin-design.md`. Five sequential phases, browser-verified between each.

**Architecture:** Foundation first (tokens, fonts, brand assets, `Brand.tsx`), then top-down per surface: Sidebar → TopBar + SummaryBar → body components (CategorySection, TaskRow, etc.) → inputs + PasswordScreen. The data model, hooks, and component tree are preserved; only colors, typography, chrome, and small structural details change.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4 (`@theme inline` tokens), `next/font/google` for DM Sans + JetBrains Mono, Supabase (untouched).

**Testing model:** No unit tests exist in this project and a CSS reskin is not unit-testable. Verification is browser-based: `npm run dev` after each phase, walk through the checklist in the relevant verify step. A final `npx next build` at the end of Phase 5 confirms no TypeScript regressions.

**Commits:** This project's `CLAUDE.md` says never commit without explicit user approval. Each phase ends with a commit step that the executing skill must surface to the user before running.

---

## Phase 1 — Foundation

### Task 1: Replace teal palette with Acute tokens in `globals.css`

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1.1: Overwrite `app/globals.css` with the new token block, font references, and `.mono-label` utility**

```css
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-dm-sans);
  --font-mono: var(--font-jetbrains-mono);

  /* Brand */
  --color-terra: #BF4A20;
  --color-terra-muted: #a64018;
  --color-terra-tint: #fbeee8;

  --color-navy: #0E1E3A;
  --color-navy-2: #1a2c4d;
  --color-navy-tint: #e7eaf0;

  --color-stone: #EAE4D6;
  --color-stone-2: #f1ecdf;
  --color-paper: #faf7f0;

  --color-black: #0B0B0B;
  --color-ink: #0E1E3A;
  --color-ink-60: rgba(14, 30, 58, 0.62);
  --color-ink-40: rgba(14, 30, 58, 0.40);
  --color-ink-20: rgba(14, 30, 58, 0.18);
  --color-ink-10: rgba(14, 30, 58, 0.10);
  --color-ink-06: rgba(14, 30, 58, 0.06);
}

.mono-label {
  font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-ink-60);
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
```

**Note on token names:** Tailwind v4 generates utility classes from the variable names — `--color-terra` → `bg-terra`, `text-terra`, `border-terra`. The `--color-ink-*` alpha tokens become `bg-ink-10`, `text-ink-60`, etc.

### Task 2: Add JetBrains Mono and update body background in `layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 2.1: Replace the file with the updated font import and body class**

```tsx
import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Acute Deal Tracker",
  description: "Task management for the Acute Logistics acquisition",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full bg-stone font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
```

### Task 3: Copy brand SVGs into `public/brand/`

**Files:**
- Create: `public/brand/acute-mark.svg`
- Create: `public/brand/acute-mark-terra.svg`
- Create: `public/brand/acute-lockup.svg`
- Create: `public/brand/acute-lockup-stone.svg`

- [ ] **Step 3.1: Create the brand directory and copy files (run in bash)**

```bash
mkdir -p "c:/Users/rbunker/claude-workspace/projects/acute/acute-todo/public/brand"
cp "c:/Users/rbunker/claude-workspace/projects/acute/design/acute-monogram-navy.svg" \
   "c:/Users/rbunker/claude-workspace/projects/acute/acute-todo/public/brand/acute-mark.svg"
cp "c:/Users/rbunker/claude-workspace/projects/acute/design/acute-monogram-terracotta.svg" \
   "c:/Users/rbunker/claude-workspace/projects/acute/acute-todo/public/brand/acute-mark-terra.svg"
cp "c:/Users/rbunker/claude-workspace/projects/acute/design/acute-lockup-primary-navy.svg" \
   "c:/Users/rbunker/claude-workspace/projects/acute/acute-todo/public/brand/acute-lockup.svg"
cp "c:/Users/rbunker/claude-workspace/projects/acute/design/acute-lockup-secondary-stone.svg" \
   "c:/Users/rbunker/claude-workspace/projects/acute/acute-todo/public/brand/acute-lockup-stone.svg"
```

- [ ] **Step 3.2: Verify all four files exist**

Run:
```bash
ls "c:/Users/rbunker/claude-workspace/projects/acute/acute-todo/public/brand/"
```

Expected: `acute-mark.svg  acute-mark-terra.svg  acute-lockup.svg  acute-lockup-stone.svg`

### Task 4: Replace `favicon.ico` and `apple-icon.png` with Acute monogram

**Files:**
- Modify (replace): `app/favicon.ico`
- Modify (replace): `app/apple-icon.png`

- [ ] **Step 4.1: Replace `apple-icon.png` with the 64px navy monogram PNG**

For the apple touch icon, Next will serve `app/apple-icon.png` as the iOS home-screen icon. The largest PNG in the design folder is 64×64. iOS scales gracefully but 180×180 is the spec. Use the largest available source as a stopgap; if visual quality is poor on a Retina iPhone, render a 180×180 from the SVG using ImageMagick or an online converter as a follow-up.

```bash
cp "c:/Users/rbunker/claude-workspace/projects/acute/design/acute-monogram-navy-64.png" \
   "c:/Users/rbunker/claude-workspace/projects/acute/acute-todo/app/apple-icon.png"
```

- [ ] **Step 4.2: Replace `favicon.ico` with the 32px navy monogram**

Next 16 also accepts PNG and SVG favicons via `app/icon.{ico,png,svg}`. The cleanest approach is to add `app/icon.png` from the 32px monogram and let Next generate the favicon route from it. We'll keep the existing `favicon.ico` filename in case browsers cache it; just overwrite with the 32px PNG renamed:

```bash
cp "c:/Users/rbunker/claude-workspace/projects/acute/design/acute-monogram-navy-32.png" \
   "c:/Users/rbunker/claude-workspace/projects/acute/acute-todo/app/icon.png"
rm "c:/Users/rbunker/claude-workspace/projects/acute/acute-todo/app/favicon.ico"
```

(Removing `favicon.ico` lets Next 16 use `app/icon.png` automatically. If you'd rather keep the .ico for legacy IE/Edge fallback, skip the `rm` and leave both — Next serves both.)

- [ ] **Step 4.3: Verify icons exist**

```bash
ls "c:/Users/rbunker/claude-workspace/projects/acute/acute-todo/app/" | grep -E "icon|favicon"
```

Expected: `apple-icon.png  icon.png` (favicon.ico optional).

### Task 5: Create `components/Brand.tsx`

**Files:**
- Create: `components/Brand.tsx`

- [ ] **Step 5.1: Write the file**

```tsx
import Image from "next/image";

interface AcuteMarkProps {
  size?: number;
  className?: string;
}

export function AcuteMark({ size = 24, className = "" }: AcuteMarkProps) {
  return (
    <Image
      src="/brand/acute-mark.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

type LockupVariant = "navy" | "white" | "black";

interface AcuteLockupProps {
  size?: number;
  variant?: LockupVariant;
  secondary?: string;
}

export function AcuteLockup({
  size = 22,
  variant = "navy",
  secondary = "logistics",
}: AcuteLockupProps) {
  const fg =
    variant === "white" ? "#fff" : variant === "black" ? "#0B0B0B" : "#0E1E3A";
  const filter = variant === "white" ? "brightness(0) invert(1)" : undefined;

  return (
    <span className="inline-flex items-center gap-2">
      <Image
        src="/brand/acute-mark.svg"
        alt="Acute Logistics"
        width={size}
        height={size}
        style={filter ? { filter } : undefined}
        priority
      />
      <span
        style={{ color: fg, fontSize: Math.round(size * 0.72) }}
        className="font-medium tracking-tight lowercase leading-none"
      >
        acute
        {secondary && <span className="ml-1 opacity-55">{secondary}</span>}
      </span>
    </span>
  );
}
```

### Task 6: Phase 1 verification

- [ ] **Step 6.1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 6.2: Open http://localhost:3000 and verify**

Visual checklist:
- [ ] Page background is stone (warm beige `#EAE4D6`), not gray.
- [ ] Tab favicon shows the Acute navy monogram.
- [ ] If on iOS, "Add to Home Screen" preview shows the monogram (skip if not testable).
- [ ] No console errors about missing fonts or SVGs.
- [ ] Existing teal-themed components still render (they will look stale until later phases — that's expected).

- [ ] **Step 6.3: Verify brand SVGs resolve**

Visit `http://localhost:3000/brand/acute-mark.svg` directly — should show the navy monogram. Visit `http://localhost:3000/brand/acute-lockup.svg` — should show the lockup.

### Task 7: Phase 1 commit

- [ ] **Step 7.1: Surface to user for approval before committing**

Per project policy: do not commit without explicit user approval. Show the user the diff:
```bash
git status
git diff app/globals.css app/layout.tsx
```

Once user approves:

```bash
git add app/globals.css app/layout.tsx app/icon.png app/apple-icon.png public/brand components/Brand.tsx
git rm --cached app/favicon.ico 2>/dev/null || true
git commit -m "$(cat <<'EOF'
Phase 1: Acute brand foundation

Replace teal palette with brand tokens (terra/navy/stone/paper/inks),
add JetBrains Mono via next/font, copy logo SVGs to public/brand,
swap favicon and apple-icon to the Acute monogram, and add
Brand.tsx with AcuteMark and AcuteLockup components.

EOF
)"
```

---

## Phase 2 — Sidebar Reskin

### Task 8: Replace H1 with lockup, switch to brand colors and mono labels in `Sidebar.tsx`

**Files:**
- Modify: `components/Sidebar.tsx`

- [ ] **Step 8.1: Add `Brand` import at the top of the file**

In `components/Sidebar.tsx`, change:
```tsx
import { Category, Task, TaskStatus, UserName } from "@/lib/database.types";
import { statusLabel } from "@/lib/utils";
```
to:
```tsx
import { Category, Task, TaskStatus, UserName } from "@/lib/database.types";
import { statusLabel } from "@/lib/utils";
import { AcuteLockup } from "./Brand";
```

- [ ] **Step 8.2: Replace `FilterRow` body with terra-active brand styling**

Find the existing `FilterRow` function (around lines 32–56) and replace its return JSX:

```tsx
function FilterRow({ label, count, active, onClick }: FilterRowProps) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
        active
          ? "bg-terra text-white"
          : "text-ink-60 hover:bg-ink-06 hover:text-navy"
      }`}
    >
      <span className="truncate">{label}</span>
      {count !== undefined && (
        <span
          className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs ${
            active
              ? "bg-white/20 text-white"
              : "bg-ink-06 text-ink-60"
          }`}
          style={{ fontFamily: "var(--font-jetbrains-mono)", fontVariantNumeric: "tabular-nums" }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
```

- [ ] **Step 8.3: Replace `SectionLabel` to use the `.mono-label` utility**

```tsx
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-1.5 px-3 mono-label">{children}</p>;
}
```

- [ ] **Step 8.4: Replace the brand block at the top of `content` and the reset link**

Find:
```tsx
  const content = (
    <>
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-lg font-bold text-gray-900">
          Acute Deal Tracker
        </h1>
      </div>
```

Replace with:
```tsx
  const content = (
    <>
      <div className="px-5 pt-6 pb-5">
        <AcuteLockup size={22} />
        <p className="mt-1.5 text-[13px] font-medium text-ink-60">Deal Tracker</p>
      </div>
```

Then find:
```tsx
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
```

Replace with:
```tsx
        {isFiltering && (
          <div className="px-3">
            <button
              onClick={handleSelect(onResetFilters)}
              className="text-xs font-medium text-terra hover:text-terra-muted"
            >
              Reset filters
            </button>
          </div>
        )}
```

- [ ] **Step 8.5: Update sidebar container backgrounds**

Find:
```tsx
      {/* Desktop: persistent sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white">
```

Replace with:
```tsx
      {/* Desktop: persistent sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-ink-10 md:bg-stone-2">
```

Find:
```tsx
        <aside
          className={`absolute inset-y-0 left-0 flex w-64 flex-col border-r border-gray-200 bg-white shadow-lg transition-transform duration-200 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
```

Replace with:
```tsx
        <aside
          className={`absolute inset-y-0 left-0 flex w-64 flex-col border-r border-ink-10 bg-stone-2 shadow-lg transition-transform duration-200 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
```

### Task 9: Phase 2 verification

- [ ] **Step 9.1: With `npm run dev` running, reload the app**

Visual checklist:
- [ ] Sidebar background is stone-2 (slightly lighter beige than the page).
- [ ] Top of sidebar shows the Acute lockup (mark + "acute logistics" wordmark) and "Deal Tracker" subtitle in ink-60.
- [ ] Section labels ("Category", "Who", "Status") are uppercase mono, tracked-out, ink-60.
- [ ] Active filter row is solid terra with white text.
- [ ] Inactive rows are ink-60; hover gives a subtle ink-06 wash and ink turns navy.
- [ ] Counter pills on category rows render in JetBrains Mono with tabular numerals.
- [ ] Reset filters link is terra.
- [ ] Mobile drawer (resize below 768px or use devtools) — same colors, slides in over the page.

### Task 10: Phase 2 commit

- [ ] **Step 10.1: Surface to user for approval, then commit**

```bash
git add components/Sidebar.tsx
git commit -m "$(cat <<'EOF'
Phase 2: Brand-applied sidebar

Replace teal active state with terra, swap section labels to
mono-label utility, add AcuteLockup at the top with "Deal Tracker"
subtitle, and shift all chrome from gray to stone-2/ink palette.

EOF
)"
```

---

## Phase 3 — Top Bar + SummaryBar

### Task 11: Create `components/TopBar.tsx`

**Files:**
- Create: `components/TopBar.tsx`

- [ ] **Step 11.1: Write the file**

```tsx
"use client";

import { AcuteLockup } from "./Brand";

interface TopBarProps {
  onOpenMobileSidebar: () => void;
}

export default function TopBar({ onOpenMobileSidebar }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-navy-2/40 bg-navy px-5 py-3 text-white sm:px-7">
      {/* Mobile menu button */}
      <button
        onClick={onOpenMobileSidebar}
        className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white md:hidden"
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>

      {/* Decorative triangle (8% white) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 160 160"
        className="pointer-events-none absolute"
        style={{ bottom: -30, right: -30, width: 160, height: 160, opacity: 0.08 }}
      >
        <path d="M160 50 L50 160 L160 160 Z" fill="#fff" />
      </svg>

      {/* Lockup + subtitle */}
      <div className="flex items-center gap-3">
        <AcuteLockup size={22} variant="white" />
        <span className="hidden h-[18px] w-px bg-white/20 sm:block" />
        <span className="hidden text-[13px] font-medium text-white/85 sm:block">
          Deal Tracker
        </span>
      </div>

      {/* Right-side spacer (placeholder for future Working-as toggle) */}
      <div className="ml-auto" />
    </header>
  );
}
```

### Task 12: Create `components/SummaryBar.tsx`

**Files:**
- Create: `components/SummaryBar.tsx`

- [ ] **Step 12.1: Write the file**

```tsx
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
```

### Task 13: Mount TopBar + SummaryBar in `AppShell.tsx`; remove floating mobile menu

**Files:**
- Modify: `components/AppShell.tsx`

- [ ] **Step 13.1: Add imports for `TopBar` and `SummaryBar`**

After the existing component imports near the top, add:

```tsx
import TopBar from "./TopBar";
import SummaryBar from "./SummaryBar";
```

- [ ] **Step 13.2: Replace the entire `<main>` block**

Find:
```tsx
      <main className="flex-1">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="fixed left-3 top-3 z-30 rounded-lg bg-white p-2 shadow-md ring-1 ring-gray-200 md:hidden"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        </button>

        {loading ? (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-sm text-gray-400">Loading...</div>
          </div>
        ) : (
          <>
            <div className="mx-auto w-full max-w-3xl space-y-3 px-4 pt-16 md:pt-6 pb-2">
```

Replace with:
```tsx
      <main className="flex flex-1 flex-col">
        <TopBar onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-sm text-ink-40">Loading...</div>
          </div>
        ) : (
          <>
            <SummaryBar tasks={tasks} />

            <div className="mx-auto w-full max-w-3xl space-y-3 px-4 pt-6 pb-2">
```

(Removes the floating mobile button, the `pt-16` mobile padding hack, and adds the new chrome stack.)

- [ ] **Step 13.3: Update the empty-state and no-results blocks to use brand colors**

Find:
```tsx
              {categories.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
                  <p className="text-sm text-gray-500">No categories yet</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Add a category below to get started
                  </p>
                </div>
              )}

              {isFiltering &&
                visibleCategories.every(
                  (c) => tasksForCategory(c.id).length === 0
                ) &&
                categories.length > 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
                    <p className="text-sm text-gray-500">
                      No tasks match the current filters
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-xs font-medium text-teal-700 hover:text-teal-800"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
```

Replace with:
```tsx
              {categories.length === 0 && (
                <div className="rounded-md border border-dashed border-ink-20 py-12 text-center">
                  <p className="text-sm text-ink-60">No categories yet</p>
                  <p className="mt-1 text-xs text-ink-40">
                    Add a category below to get started
                  </p>
                </div>
              )}

              {isFiltering &&
                visibleCategories.every(
                  (c) => tasksForCategory(c.id).length === 0
                ) &&
                categories.length > 0 && (
                  <div className="rounded-md border border-dashed border-ink-20 py-12 text-center">
                    <p className="text-sm text-ink-60">
                      No tasks match the current filters
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-xs font-medium text-terra hover:text-terra-muted"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
```

- [ ] **Step 13.4: Update the wrapping flex container background**

Find:
```tsx
    <div className="flex min-h-screen bg-gray-50">
```

Replace with:
```tsx
    <div className="flex min-h-screen bg-stone">
```

### Task 14: Phase 3 verification

- [ ] **Step 14.1: Reload the app**

Visual checklist:
- [ ] Top bar is solid navy across the full main column (not the sidebar).
- [ ] Lockup at left renders white via the CSS filter; "Deal Tracker" subtitle appears at >= 640px.
- [ ] A faint white triangle ornament is visible in the bottom-right of the top bar.
- [ ] Top bar is sticky on scroll.
- [ ] SummaryBar sits below the top bar: white background, `PROGRESS` mono label, "X of Y tasks complete" body, large terra percentage on the right.
- [ ] Progress bar fills correctly and animates when status changes (toggle a task to "done" in the sidebar/board to confirm).
- [ ] Mobile (< 768px): hamburger button now lives inside the navy top bar, not floating.
- [ ] No console errors.

### Task 15: Phase 3 commit

- [ ] **Step 15.1: Surface to user, then commit**

```bash
git add components/TopBar.tsx components/SummaryBar.tsx components/AppShell.tsx
git commit -m "$(cat <<'EOF'
Phase 3: Navy top bar and progress summary

Add TopBar with the white lockup, decorative triangle, and mobile
menu trigger; add SummaryBar with brand-colored progress text and
4px terra progress bar. Mount both above the category list in
AppShell and drop the floating mobile menu button.

EOF
)"
```

---

## Phase 4 — Body Components

### Task 16: Drop the unused `statusColor` and `statusTextColor` helpers from `lib/utils.ts`

The new `StatusIndicator` and `TaskExpanded` use component-local mappings, so these helpers become dead code. YAGNI says delete.

**Files:**
- Modify: `lib/utils.ts`

- [ ] **Step 16.1: Delete the two functions**

Find and delete:
```ts
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
```

### Task 17: Rewrite `StatusIndicator.tsx` with brand fills

**Files:**
- Modify: `components/StatusIndicator.tsx`

- [ ] **Step 17.1: Replace the file**

```tsx
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
```

### Task 18: Rewrite `AssigneeChip.tsx` with mono badges and brand colors

**Files:**
- Modify: `components/AssigneeChip.tsx`

- [ ] **Step 18.1: Replace the file**

```tsx
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
```

### Task 19: Update `TaskRow.tsx` (3px terra accent, navy hover, brand due-date colors)

**Files:**
- Modify: `components/TaskRow.tsx`

- [ ] **Step 19.1: Replace the due-date color logic**

Find:
```tsx
  let dueDateColor = "text-gray-500";
  if (task.due_date && !isDone) {
    if (isOverdue(task.due_date)) {
      dueDateColor = "text-red-500 font-medium";
    } else if (isDueToday(task.due_date)) {
      dueDateColor = "text-amber-600 font-medium";
    }
  }
```

Replace with:
```tsx
  let dueDateColor = "text-ink-60";
  if (task.due_date && !isDone) {
    if (isOverdue(task.due_date)) {
      dueDateColor = "text-terra font-medium";
    } else if (isDueToday(task.due_date)) {
      dueDateColor = "text-terra-muted font-medium";
    }
  }
```

- [ ] **Step 19.2: Replace the row container and inner JSX**

Find the `return (` block (lines 47–90) and replace its body with:

```tsx
  const accentBorder =
    task.status === "in_progress" ? "border-l-terra" : "border-l-transparent";

  return (
    <div>
      <div
        onClick={onToggleExpand}
        className={`flex cursor-pointer items-center gap-3 border-l-[3px] px-[18px] py-3 transition-colors hover:bg-[rgba(14,30,58,0.03)] ${accentBorder} ${
          isExpanded ? "bg-[rgba(14,30,58,0.03)]" : ""
        }`}
      >
        <StatusIndicator status={task.status} onClick={handleStatusCycle} />
        <span
          className={`flex-1 truncate text-[14px] font-[450] leading-[1.35] ${
            isDone ? "text-ink-40 line-through" : "text-ink"
          }`}
        >
          {task.title}
        </span>
        <div className="flex shrink-0 items-center gap-2.5">
          <AssigneeChip
            assignee={task.assigned_to}
            onClick={handleAssigneeCycle}
          />
          {task.due_date && (
            <span
              className={`min-w-[50px] text-right ${dueDateColor}`}
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: 11,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatDate(task.due_date)}
            </span>
          )}
        </div>
      </div>
      <div
        className="grid transition-all duration-200"
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          {isExpanded && (
            <TaskExpanded
              task={task}
              onUpdate={(updates) => onUpdate(task.id, updates)}
              onDelete={() => onDelete(task.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
```

### Task 20: Update `CategoryHeader.tsx` (terra inline-edit, mono done/total counter, ink colors)

The header needs `done` and `total` counts instead of just `taskCount`. We'll change the prop signature.

**Files:**
- Modify: `components/CategoryHeader.tsx`
- Modify: `components/CategorySection.tsx` (caller — Task 21 below updates the call site)

- [ ] **Step 20.1: Update the props interface and the function signature**

Find:
```tsx
interface CategoryHeaderProps {
  name: string;
  taskCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function CategoryHeader({
  name,
  taskCount,
  isCollapsed,
  onToggleCollapse,
  onRename,
  onDelete,
  canDelete,
}: CategoryHeaderProps) {
```

Replace with:
```tsx
interface CategoryHeaderProps {
  name: string;
  doneCount: number;
  totalCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export default function CategoryHeader({
  name,
  doneCount,
  totalCount,
  isCollapsed,
  onToggleCollapse,
  onRename,
  onDelete,
  canDelete,
}: CategoryHeaderProps) {
```

- [ ] **Step 20.2: Replace the return JSX**

Find the `return (` block (lines 45–122) and replace with:

```tsx
  return (
    <div
      className={`flex items-center gap-2.5 bg-stone-2 px-[18px] py-[14px] ${
        isCollapsed ? "" : "border-b border-ink-10"
      }`}
    >
      <button
        onClick={onToggleCollapse}
        className="flex h-6 w-6 shrink-0 items-center justify-center text-ink-60 hover:text-ink"
      >
        <svg
          className={`h-[14px] w-[14px] transition-transform duration-200 ${
            isCollapsed ? "" : "rotate-90"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditName(name);
              setIsEditing(false);
            }
          }}
          className="flex-1 rounded border border-terra bg-white px-2 py-0.5 text-[14px] font-semibold text-ink outline-none ring-2 ring-terra/20"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 text-left text-[14px] font-semibold text-ink hover:text-terra"
        >
          {name}
        </button>
      )}

      <span
        className="rounded-[3px] border border-ink-10 bg-white px-2 py-[3px] text-ink-60"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: 11,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {doneCount}/{totalCount}
      </span>

      {canDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex h-6 w-6 items-center justify-center rounded text-ink-20 hover:text-terra"
          title="Delete category (empty)"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
```

### Task 21: Update `CategorySection.tsx` (rounded-md card, ink-06 separators, mono empty state, pass new counts)

**Files:**
- Modify: `components/CategorySection.tsx`

- [ ] **Step 21.1: Replace the entire return block**

Find:
```tsx
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <CategoryHeader
        name={category.name}
        taskCount={tasks.length}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onRename={(newName) => onRenameCategory(category.id, newName)}
        onDelete={() => setShowDeleteConfirm(true)}
        canDelete={canDelete}
      />

      <div
        className="grid transition-all duration-200"
        style={{ gridTemplateRows: isCollapsed ? "0fr" : "1fr" }}
      >
        <div className="overflow-hidden">
          {tasks.length > 0 ? (
            <div className="divide-y divide-gray-100 border-t border-gray-100">
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  isExpanded={expandedTaskId === task.id}
                  onToggleExpand={() => onToggleTaskExpand(task.id)}
                  onUpdate={onUpdateTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          ) : (
            <div className="border-t border-gray-100 px-3 py-4 text-center text-xs text-gray-400">
              No tasks yet
            </div>
          )}
          <AddTaskInput
            onAdd={(title) => onAddTask(category.id, title)}
          />
        </div>
      </div>
```

Replace with:
```tsx
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="overflow-hidden rounded-md border border-ink-10 bg-white">
      <CategoryHeader
        name={category.name}
        doneCount={doneCount}
        totalCount={tasks.length}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        onRename={(newName) => onRenameCategory(category.id, newName)}
        onDelete={() => setShowDeleteConfirm(true)}
        canDelete={canDelete}
      />

      <div
        className="grid transition-all duration-200"
        style={{ gridTemplateRows: isCollapsed ? "0fr" : "1fr" }}
      >
        <div className="overflow-hidden">
          {tasks.length > 0 ? (
            <div>
              {tasks.map((task, idx) => (
                <div
                  key={task.id}
                  className={idx > 0 ? "border-t border-ink-06" : ""}
                >
                  <TaskRow
                    task={task}
                    isExpanded={expandedTaskId === task.id}
                    onToggleExpand={() => onToggleTaskExpand(task.id)}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-6 text-center mono-label">No tasks yet</div>
          )}
          <AddTaskInput onAdd={(title) => onAddTask(category.id, title)} />
        </div>
      </div>
```

### Task 22: Rewrite `TaskExpanded.tsx` with bg-paper, mono labels, segmented brand buttons, terra completed banner

**Files:**
- Modify: `components/TaskExpanded.tsx`

- [ ] **Step 22.1: Drop the unused `statusTextColor` import**

Find:
```tsx
import { statusLabel, statusTextColor, formatTimestamp } from "@/lib/utils";
```

Replace with:
```tsx
import { statusLabel, formatTimestamp } from "@/lib/utils";
```

- [ ] **Step 22.2: Add status/assignee active-style maps near the top of the component (after the `assignees` constant)**

Find:
```tsx
  const statuses: TaskStatus[] = ["not_started", "in_progress", "done"];
  const assignees: (UserName | null)[] = ["Ryan", "Matt", null];
```

Add immediately after:
```tsx
  const statusActive: Record<TaskStatus, string> = {
    not_started: "bg-ink text-white",
    in_progress: "bg-navy text-white",
    done: "bg-terra text-white",
  };

  function assigneeActive(a: UserName | null): string {
    if (a === "Ryan") return "bg-terra text-white";
    if (a === "Matt") return "bg-navy text-white";
    return "bg-ink-60 text-white";
  }
```

- [ ] **Step 22.3: Replace the entire `return (` block**

Find the `return (` block (lines 42–163) and replace with:

```tsx
  return (
    <div className="flex flex-col gap-4 border-t border-ink-10 bg-paper px-[22px] py-[18px]">
      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleTitleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className="w-full rounded border border-ink-10 bg-white px-3 py-2.5 text-[14px] font-medium text-ink outline-none focus:border-terra focus:ring-2 focus:ring-terra/20"
      />

      {/* Status */}
      <div>
        <label className="mb-1.5 block mono-label">Status</label>
        <div className="flex gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => onUpdate({ status: s })}
              className={`rounded px-3 py-1.5 text-[12px] font-medium transition-colors ${
                task.status === s
                  ? statusActive[s]
                  : "border border-ink-10 bg-white text-ink-60 hover:text-ink"
              }`}
            >
              {statusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Assignee */}
      <div>
        <label className="mb-1.5 block mono-label">Assigned To</label>
        <div className="flex gap-1.5">
          {assignees.map((a) => (
            <button
              key={a || "unassigned"}
              onClick={() => onUpdate({ assigned_to: a })}
              className={`rounded px-3 py-1.5 text-[12px] font-medium transition-colors ${
                task.assigned_to === a
                  ? assigneeActive(a)
                  : "border border-ink-10 bg-white text-ink-60 hover:text-ink"
              }`}
            >
              {a || "Unassigned"}
            </button>
          ))}
        </div>
      </div>

      {/* Due date */}
      <div>
        <label className="mb-1.5 block mono-label">Due Date</label>
        <input
          type="date"
          value={task.due_date || ""}
          onChange={(e) => onUpdate({ due_date: e.target.value || null })}
          className="rounded border border-ink-10 bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-terra focus:ring-2 focus:ring-terra/20"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="mb-1.5 block mono-label">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleNotesBlur}
          rows={3}
          placeholder="Add notes..."
          className="w-full resize-y rounded border border-ink-10 bg-white px-3 py-2.5 text-[13px] leading-[1.5] text-ink outline-none focus:border-terra focus:ring-2 focus:ring-terra/20"
        />
      </div>

      {/* Completed banner — renders only when both status=done AND completed_by is set.
          completed_by is currently always null (working-as toggle deferred per spec). */}
      {task.status === "done" && task.completed_by && (
        <div className="flex items-center gap-2 rounded border border-terra/20 bg-terra/[0.07] px-[14px] py-2.5 text-[12px] text-terra">
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>
            Completed by <strong>{task.completed_by}</strong>
            {task.completed_at && (
              <> · {formatTimestamp(task.completed_at)}</>
            )}
          </span>
        </div>
      )}

      {/* Delete */}
      <div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="mono-label hover:text-terra"
        >
          Delete task
        </button>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Task"
          message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
          onConfirm={onDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
```

### Task 23: Phase 4 verification

- [ ] **Step 23.1: Reload the app**

Visual checklist:
- [ ] Category cards: white bg, ink-10 border, rounded-md (less rounded than before), no shadow.
- [ ] Category header: stone-2 background, mono `0/3` style counter pill on the right.
- [ ] Tasks: rows separated by faint ink-06 line. In-progress task has a 3px terra accent border on the left. Hover gives a faint navy-tinted wash.
- [ ] Status indicator: 26px circle. `not_started` = white with ink-20 border. `in_progress` = navy with white dot. `done` = terra with white check.
- [ ] Title: 14px DM Sans. When done, text-ink-40 with line-through.
- [ ] Assignee chip: mono uppercase. Ryan = terra outline, Matt = navy outline, none = dashed "unassigned".
- [ ] Due date: mono 11px. Today = terra-muted. Overdue = terra. Otherwise ink-60.
- [ ] Click a task: expanded panel has bg-paper, mono labels above each field, segmented brand-colored buttons, white inputs with terra focus ring.
- [ ] Click Status → Done. Banner does NOT appear yet because `completed_by` is always null. (This is expected — flagged in spec as out of scope.)
- [ ] Inline-rename a category: terra border + terra ring on the input.

### Task 24: Phase 4 commit

- [ ] **Step 24.1: Surface to user, then commit**

```bash
git add lib/utils.ts components/StatusIndicator.tsx components/AssigneeChip.tsx components/TaskRow.tsx components/CategoryHeader.tsx components/CategorySection.tsx components/TaskExpanded.tsx
git commit -m "$(cat <<'EOF'
Phase 4: Brand-applied body components

Restyle CategorySection (rounded-md, ink-10 border, ink-06 row
separators), CategoryHeader (mono done/total counter, terra inline
edit), TaskRow (3px terra accent for in-progress, brand due-date
colors), StatusIndicator (26px brand fills), AssigneeChip (mono
badges, terra/navy borders), TaskExpanded (bg-paper, mono labels,
segmented brand buttons, terra completed banner). Drop unused
statusColor and statusTextColor utilities.

EOF
)"
```

---

## Phase 5 — Inputs + PasswordScreen

### Task 25: Update `AddTaskInput.tsx` (bg-paper row, plus icon, mono Add button)

**Files:**
- Modify: `components/AddTaskInput.tsx`

- [ ] **Step 25.1: Replace the file**

```tsx
"use client";

import { useState, FormEvent } from "react";

interface AddTaskInputProps {
  onAdd: (title: string) => Promise<void>;
}

export default function AddTaskInput({ onAdd }: AddTaskInputProps) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setTitle("");
    } catch {
      // Error handled by hook
    } finally {
      setSubmitting(false);
    }
  }

  const showAddButton = title.trim().length > 0 && !submitting;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2.5 border-t border-ink-06 bg-paper px-[18px] py-2.5"
    >
      <svg
        className="h-[14px] w-[14px] shrink-0 text-ink-40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
      </svg>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add task..."
        disabled={submitting}
        className="flex-1 bg-transparent text-[13px] text-ink placeholder-ink-40 outline-none disabled:opacity-50"
      />
      {showAddButton && (
        <button
          type="submit"
          className="rounded-[3px] bg-terra px-2 py-[3px] uppercase tracking-[0.06em] text-white hover:bg-terra-muted"
          style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10 }}
        >
          Add ↵
        </button>
      )}
    </form>
  );
}
```

### Task 26: Update `AddCategoryInput.tsx` (dashed collapsed, terra Add button)

**Files:**
- Modify: `components/AddCategoryInput.tsx`

- [ ] **Step 26.1: Replace the file**

```tsx
"use client";

import { useState, FormEvent } from "react";

interface AddCategoryInputProps {
  onAdd: (name: string) => Promise<void>;
}

export default function AddCategoryInput({ onAdd }: AddCategoryInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setName("");
      setIsOpen(false);
    } catch {
      // Error handled by hook
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-4">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full rounded-md border border-dashed border-ink-20 py-3.5 text-[13px] font-medium text-ink-60 transition-colors hover:border-ink-40 hover:text-navy"
        >
          + Add category
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          autoFocus
          disabled={submitting}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsOpen(false);
              setName("");
            }
          }}
          className="flex-1 rounded border border-ink-20 px-3.5 py-2.5 text-[14px] text-ink placeholder-ink-40 outline-none focus:border-terra focus:ring-2 focus:ring-terra/20 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="rounded bg-terra px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-terra-muted disabled:opacity-50"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setName("");
          }}
          className="rounded px-3 py-2.5 text-[14px] text-ink-60 hover:bg-ink-06 hover:text-navy"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
```

### Task 27: Rewrite `PasswordScreen.tsx` (stone bg, decorative triangle, white card, lockup, terra button)

**Files:**
- Modify: `components/PasswordScreen.tsx`

- [ ] **Step 27.1: Replace the file**

```tsx
"use client";

import { useState, FormEvent } from "react";
import { AcuteLockup } from "./Brand";

interface PasswordScreenProps {
  onLogin: (password: string) => boolean;
}

export default function PasswordScreen({ onLogin }: PasswordScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setShaking(true);
      setPassword("");
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone px-4">
      {/* Decorative triangle (8% navy) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 360 360"
        className="pointer-events-none absolute"
        style={{ bottom: -80, right: -80, width: 360, height: 360, opacity: 0.08 }}
      >
        <path d="M360 120 L120 360 L360 360 Z" fill="#0E1E3A" />
      </svg>

      <div
        className={`relative w-full max-w-[380px] rounded-lg border border-ink-10 bg-white px-9 pb-8 pt-9 ${
          shaking ? "animate-shake" : ""
        }`}
      >
        <div className="flex justify-center">
          <AcuteLockup size={26} />
        </div>
        <h1 className="mt-5 text-center text-[18px] font-medium text-ink">
          Acute Deal Tracker
        </h1>
        <p className="mt-1 mono-label text-center">
          Enter password to continue
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            autoFocus
            className={`w-full rounded border px-3.5 py-3 text-[14px] text-ink placeholder-ink-40 outline-none transition-colors focus:ring-2 ${
              error
                ? "border-terra focus:border-terra focus:ring-terra/20"
                : "border-ink-20 focus:border-terra focus:ring-terra/20"
            }`}
          />
          {error && (
            <p className="mt-2 mono-label text-terra">Incorrect password</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded bg-terra py-3 text-[14px] font-medium text-white transition-colors hover:bg-terra-muted"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Task 28: Update `AuthGate.tsx` loading state to match new palette

**Files:**
- Modify: `components/AuthGate.tsx`

- [ ] **Step 28.1: Replace the loading background and text colors**

Find:
```tsx
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }
```

Replace with:
```tsx
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone">
        <div className="text-sm text-ink-40">Loading...</div>
      </div>
    );
  }
```

### Task 29: Phase 5 verification

- [ ] **Step 29.1: Reload the app and walk through every surface**

Visual checklist:
- [ ] Hard reload at the password screen (clear localStorage in devtools or run `localStorage.removeItem('acute_password')` in console). Card centered on stone background. Decorative navy triangle visible bottom-right at low opacity. Lockup at top of card. Title in DM Sans 18/500. Mono "Enter password to continue" subtitle.
- [ ] Submit a wrong password: input border turns terra, mono "Incorrect password" message in terra, card shakes.
- [ ] Submit the correct password: enters the app.
- [ ] AddTaskInput row at the bottom of every category: bg-paper, plus icon, transparent input. Type something — terra "Add ↵" mono button appears. Submit works.
- [ ] AddCategoryInput at the very bottom: dashed ink-20 border, "+ Add category" in ink-60. Click — opens with terra Add button.

- [ ] **Step 29.2: Run a full TypeScript build to catch regressions**

```bash
npx next build
```

Expected: build succeeds. If you see errors about missing exports (e.g., `statusColor`/`statusTextColor`), that means a consumer was missed — search the project (`Grep` for the symbol) and fix the call site.

- [ ] **Step 29.3: Final regression sweep**

In the running dev server:
- [ ] Click status indicators — cycle works (not_started → in_progress → done).
- [ ] Click assignee chips — cycle works (null → Ryan → Matt → null).
- [ ] Add a task, expand it, edit title/notes, change assignee/due date — all updates persist.
- [ ] Apply a Who or Status filter — task list filters correctly; counters in the sidebar reflect filtered counts.
- [ ] Add a new category, then delete it (it must be empty).
- [ ] Open the app in a second browser tab and verify realtime updates still flow (add a task in tab A, watch it appear in tab B).

### Task 30: Phase 5 commit

- [ ] **Step 30.1: Surface to user, then commit**

```bash
git add components/AddTaskInput.tsx components/AddCategoryInput.tsx components/PasswordScreen.tsx components/AuthGate.tsx
git commit -m "$(cat <<'EOF'
Phase 5: Brand-applied inputs and password screen

Restyle AddTaskInput (bg-paper row, plus icon, mono "Add" button),
AddCategoryInput (dashed collapsed state, terra Add button),
PasswordScreen (stone background, decorative triangle, white card
with AcuteLockup, terra primary), and AuthGate loading state.
Completes the visual reskin per the design handoff.

EOF
)"
```

---

## Out of scope / follow-up

- **Working-as user toggle.** Header has a placeholder slot. When the toggle ships, populate it with the pill group from the handoff (`bg-white/8`, `bg-terra` active, etc.) and update `useTasks.updateTask` to set `completed_by` to the current user when status transitions to `done`. The completed banner in `TaskExpanded` will start rendering automatically.
- **180×180 apple-icon.** Phase 1 uses the 64px PNG as a stopgap. If iOS home-screen rendering looks soft, render a 180×180 from `acute-monogram-navy.svg` and overwrite `app/apple-icon.png`.
- **White lockup SVG.** If the CSS-filter white variant shows edge artifacts on low-DPI displays, hand-edit a white SVG and add `Brand.tsx` logic to use it directly when `variant="white"`.
