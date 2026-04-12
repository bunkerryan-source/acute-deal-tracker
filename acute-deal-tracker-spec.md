# Acute Deal Tracker — Project Spec

## Overview

Build a shared task management web app for managing an M&A transaction (acquisition of Acute Logistics). Two users — Ryan and Matt — need to collaborate on categorized tasks with assignments, due dates, status tracking, and notes. No login accounts; access is controlled by a simple shared password on a single URL.

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend/DB:** Supabase (Postgres + Row Level Security)
- **Hosting:** Vercel
- **Auth:** Simple shared password gate (no user accounts — just a single password stored as an environment variable that unlocks the app). Once entered, store in localStorage so they don't re-enter each visit. Each user picks "Ryan" or "Matt" from a toggle/selector after unlocking — this is how assignment and "completed by" attribution works. No Supabase Auth needed.

## Design Direction

- Clean, light, professional. White/light gray background, crisp typography, subtle borders.
- Mobile-first and responsive — must work well on phone screens. Tap-friendly targets.
- No dark mode needed for v1.
- Use a professional sans-serif font (e.g. DM Sans, Outfit, or similar from Google Fonts — avoid Inter/Roboto).
- Minimal color: use one accent color (blue or teal) for interactive elements. Status chips get their own muted colors.
- No animations beyond basic transitions. Substance over flash.

## Data Model

### Tables (Supabase / Postgres)

#### `categories`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK, default gen_random_uuid()) | |
| name | text (not null) | e.g. "Due Diligence", "SBA Financing" |
| sort_order | integer (default 0) | Controls display order |
| created_at | timestamptz (default now()) | |

#### `tasks`
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK, default gen_random_uuid()) | |
| category_id | uuid (FK → categories.id, ON DELETE CASCADE) | |
| title | text (not null) | Task name |
| notes | text (nullable) | Freeform notes field |
| status | text (default 'not_started') | Enum: 'not_started', 'in_progress', 'done' |
| assigned_to | text (nullable) | 'Ryan' or 'Matt' or null (unassigned) |
| due_date | date (nullable) | Target completion date |
| completed_by | text (nullable) | 'Ryan' or 'Matt' — set when status → done |
| completed_at | timestamptz (nullable) | Set when status → done |
| sort_order | integer (default 0) | Controls display order within category |
| created_at | timestamptz (default now()) | |
| updated_at | timestamptz (default now()) | Auto-update via trigger |

**Supabase trigger:** Create a trigger on `tasks` that auto-sets `updated_at` to `now()` on every UPDATE.

### Row Level Security

Since there are no user accounts, RLS should be configured to allow all operations when a valid request comes through. The password gate is client-side only. For v1 this is acceptable — the app URL and password are only shared between Ryan and Matt. Use Supabase anon key with permissive RLS policies (or disable RLS on these two tables if simpler).

## App Structure

### Password Gate (Landing Screen)

- Single centered input: "Enter password to continue"
- On correct entry, save to localStorage, show the app
- On incorrect entry, shake the input with a brief error message
- Password checked against `NEXT_PUBLIC_APP_PASSWORD` env var (client-side check is fine for this use case)

### User Selector

- After password entry (or on each visit if already stored), show a small persistent toggle or dropdown in the header: **"Working as: Ryan | Matt"**
- Stored in localStorage. This determines who tasks get assigned to and who gets credit for completions.
- Must be easy to switch (e.g. if Matt borrows Ryan's phone).

### Main View — Task Board

The primary view. Shows all categories and their tasks.

**Layout:**
- **Header:** App title ("Acute Deal Tracker"), user selector (Ryan/Matt toggle), and a summary bar showing total tasks, completed count, and overall % complete.
- **Filter bar:** Filter by assignee (All / Ryan / Matt), filter by status (All / Not Started / In Progress / Done). Simple pill buttons or dropdown.
- **Category sections:** Each category is a collapsible card/section. Category name as header with task count. Tasks listed beneath.
- **Add category button:** At bottom of the page. Inline text input that appears on click — type name, hit Enter, category is created.

**Task rows within each category:**
- Checkbox on the left (tapping it cycles: not_started → in_progress → done, or provide a dropdown/segmented control for status)
- Task title (tap to expand/edit)
- Assigned-to chip (Ryan / Matt / Unassigned) — tappable to reassign
- Due date shown if set — just the date in a compact format (e.g. "May 15")
- Visual indicator if task is done (strikethrough or muted styling)

**Expanded task view (inline or slide-out panel on mobile):**
- Editable title
- Status selector (Not Started / In Progress / Done)
- Assignee selector (Ryan / Matt / Unassigned)
- Due date picker
- Notes textarea (supports multi-line freeform text)
- "Completed by" and "Completed at" shown (read-only) if status is Done
- Delete task button (with confirmation)

**Add task:** A persistent "+ Add task" input row at the bottom of each category section. Type title, hit Enter, task is created in that category with default status "not_started" and no assignee. User can then expand to add details.

### Category Management

- **Add:** Button at page bottom, inline input.
- **Rename:** Click/tap category name to edit inline.
- **Delete:** Only allowed if category has zero tasks (show warning). Or: offer to move tasks to another category before deleting.
- **Reorder:** For v1, sort_order can be edited by drag (if easy to implement) or just alphabetical. Don't over-engineer this — alphabetical or creation order is fine for v1.

### Summary / Progress

- A small summary bar at the top (below header) showing:
  - Total tasks: X
  - Completed: Y
  - Progress: Y/X (with a thin progress bar)
- This updates in real-time as tasks are checked off.

## Functional Requirements

1. **Real-time sync:** Use Supabase real-time subscriptions so that when Ryan adds/edits a task, Matt sees it update without refreshing (and vice versa).
2. **Optimistic UI:** When a user changes a task status or adds a task, update the UI immediately, then sync to Supabase. Roll back on error.
3. **Mobile responsive:** The entire app must be usable on a phone. Category sections should stack vertically. Task expand/edit should work as an inline accordion or a bottom sheet — whichever is cleaner on mobile.
4. **No notifications for v1.**
5. **No file attachments for v1.**
6. **Timestamps:** All timestamps in Pacific Time for display purposes.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=<supabase project url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase anon key>
NEXT_PUBLIC_APP_PASSWORD=<shared password>
```

## Deployment

- Deploy to Vercel from a GitHub repo.
- Supabase project: use Ryan's existing Supabase account. Create a new project named `acute-deal-tracker` (or add tables to an existing project if preferred).
- Domain: Can use the default Vercel URL for v1, or connect a custom subdomain later.

## What to Build First (Suggested Order)

1. Supabase setup: Create tables, trigger, and RLS policies.
2. Next.js project scaffold with Tailwind.
3. Password gate + user selector.
4. Category CRUD (add, rename, delete).
5. Task CRUD (add, edit status, assign, due date, notes, delete).
6. Real-time subscriptions.
7. Filter bar and summary/progress bar.
8. Mobile polish and responsive testing.

## Out of Scope for v1

- User accounts / real authentication
- Notifications (email, push, or browser)
- File attachments
- Activity log / audit trail
- Drag-and-drop reordering
- Multiple projects (this is purpose-built for one deal)
- Dark mode
