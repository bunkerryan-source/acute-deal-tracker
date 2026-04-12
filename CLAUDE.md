# Acute Deal Tracker

## What This Is
Shared task management web app for the Acute Logistics acquisition. Two users (Ryan and Matt), categorized tasks with assignments, due dates, status tracking, notes. Real-time sync via Supabase.

## Tech Stack
- Next.js 16 (App Router) + React + Tailwind CSS v4
- Supabase (Postgres + realtime subscriptions)
- Hosted on Vercel

## Project Structure
```
app/            - Next.js App Router (layout, page, globals.css)
components/     - All React components (AuthGate, AppShell, TaskRow, etc.)
hooks/          - Custom hooks (useAuth, useCategories, useTasks, useFilters)
lib/            - Supabase client, types, utility functions
```

## Key Patterns
- **Auth:** Client-side password gate (no Supabase Auth). Password stored in localStorage.
- **User identity:** "Working as: Ryan | Matt" toggle in localStorage. Not real accounts.
- **Realtime:** Supabase postgres_changes subscriptions on both tables.
- **Optimistic UI:** Task mutations update local state first, then sync to Supabase. Rollback on error.
- **Status cycling:** Tap status dot to cycle not_started -> in_progress -> done.
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
- `npm run dev` -- start dev server
- `npx next build` -- production build
