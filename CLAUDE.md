# Acute Deal Tracker

## What This Is
Shared task management web app for the Acute Logistics acquisition. Two users (Ryan and Matt), categorized tasks with assignments, due dates, status tracking, notes. Real-time sync via Supabase.

## Tech Stack
- Next.js 16 (App Router) + React + Tailwind CSS v4
- Supabase (Postgres + realtime subscriptions)
- Hosted on Vercel
- Fonts: DM Sans (sans) and JetBrains Mono (mono labels, counters, due dates) via `next/font/google`

## Project Structure
```
app/            - Next.js App Router (layout, page, globals.css, icon.png, apple-icon.png)
components/     - All React components
hooks/          - Custom hooks (useAuth, useCategories, useTasks, useFilters)
lib/            - Supabase client, types, utility functions
public/brand/   - Acute brand SVGs (mark + lockup, navy + terra + stone variants)
docs/specs/     - Design specs (e.g. 2026-04-26-acute-reskin-design.md)
docs/plans/     - Implementation plans (e.g. 2026-04-26-acute-reskin-plan.md)
```

### Component map
- `AuthGate` → `PasswordScreen` (unauthed) or `AppShell` (authed)
- `AppShell` is the main layout: `Sidebar` (filters) + main column `TopBar` → `SummaryBar` → category list → `AddCategoryInput`
- `CategorySection` wraps `CategoryHeader`, `TaskRow`s, and `AddTaskInput`
- `TaskRow` shows the inline task; clicking expands `TaskExpanded`
- `Brand.tsx` exports `AcuteMark` (monogram only) and `AcuteLockup` (mark + wordmark, with `variant="navy" | "white" | "black"`)

## Brand System

Tailwind v4 tokens are defined in `app/globals.css` under `@theme inline`. They generate utility classes automatically:

| Token | Hex | Tailwind utility examples |
|-------|-----|---------------------------|
| `terra` | `#BF4A20` | `bg-terra`, `text-terra`, `border-terra` (primary brand) |
| `terra-muted` | `#a64018` | hover state for terra |
| `navy` | `#0E1E3A` | `bg-navy`, `text-navy` (top bar, in-progress fill, Matt assignee) |
| `stone` | `#EAE4D6` | `bg-stone` (page bg) |
| `stone-2` | `#f1ecdf` | `bg-stone-2` (sidebar bg, category header bg) |
| `paper` | `#faf7f0` | `bg-paper` (expanded task panel, add-task row) |
| `ink` | `#0E1E3A` | `text-ink` (default body text) |
| `ink-60 / 40 / 20 / 10 / 06` | navy alpha | `text-ink-60`, `border-ink-10`, `bg-ink-06`, etc. |

**Color discipline (Acute-tuned):** terra is the primary call-to-action color. Navy is reserved for: (1) top bar chrome, (2) in_progress status indicator, (3) in_progress segmented button, (4) Matt assignee chip. Everywhere else — active filter pill, due date overdue, primary buttons, accent border — use terra.

The `.mono-label` utility (10px uppercase tracked-out JetBrains Mono in `ink-60`) is the standard for section labels, field labels, and the "PROGRESS" / "Delete task" affordances.

## Key Patterns
- **Auth:** Client-side password gate (no Supabase Auth). Password stored in localStorage.
- **User identity (planned, not yet implemented):** `completed_by` is on the task model but is always `null` because no "Working as: Ryan | Matt" toggle exists yet. The completed banner in `TaskExpanded` is wired up to render once a user is set.
- **Realtime:** Supabase `postgres_changes` subscriptions on both tables.
- **Optimistic UI:** Task mutations update local state first, then sync to Supabase. Rollback on error.
- **Status cycling:** Tap the status dot to cycle `not_started → in_progress → done`.
- **Assignee cycling:** Tap the assignee chip to cycle `null → Ryan → Matt → null`.
- **Timestamps:** All displayed in Pacific Time.

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_PASSWORD
```

## Database
Two tables: `categories` and `tasks`. Migration SQL in `supabase-migration.sql`.
RLS is enabled with permissive policies (anon key access).

## Commands
- `npm run dev` — start dev server
- `npx next build` — production build (also runs TypeScript check)

## Follow-ups
- **Working-as toggle.** Top bar has a placeholder slot at `ml-auto`. When implemented, populate with a Ryan/Matt pill group and update `useTasks.updateTask` to set `completed_by` to the current user when status transitions to `done`. The completed banner in `TaskExpanded` will start rendering automatically.
- **180×180 apple-icon.** Currently a 64px PNG (largest available source); render a 180×180 from `public/brand/acute-mark.svg` if iOS home-screen rendering looks soft.
- **White lockup SVG.** `Brand.AcuteLockup variant="white"` uses CSS `filter: brightness(0) invert(1)` to recolor the navy SVG. If edge artifacts appear on low-DPI displays, ship a hand-edited white SVG and switch the variant logic to use it directly.
