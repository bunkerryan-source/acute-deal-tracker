# Acute Deal Tracker — Brand Reskin Design Spec

**Date:** 2026-04-26
**Status:** Approved (pending implementation)
**Source:** `design_handoff_acute_reskin/README.md`

---

## Overview

Apply the Acute Logistics brand to the existing `acute-todo` Next.js app. This is a **visual reskin only**. The data model, hooks (`useAuth`, `useCategories`, `useTasks`, `useFilters`), Supabase wiring, and component boundaries stay intact. Colors, typography, chrome, brand mark, and small structural details change.

The deliverable is a brand-aligned UI that matches the high-fidelity hex values, type sizes, and component anatomy specified in the handoff README, adapted for the current app's left-sidebar layout (which postdates the handoff).

## Strategy

**Approach A — Foundation first, top-down.** Five sequential phases. Verify in browser after each phase. Phases 1 and 2 alone produce a usable, partially-branded app, so progress is reversible at any phase boundary.

## Scope

### In scope

- Replace teal palette with Acute brand tokens (terra, navy, stone, paper, ink alphas) in `app/globals.css`.
- Add JetBrains Mono via `next/font` for metadata/labels; preserve DM Sans for body/UI.
- Add a `.mono-label` utility.
- Place provided logo SVGs in `public/brand/` and create `components/Brand.tsx` (`AcuteMark`, `AcuteLockup`).
- Replace `app/favicon.ico` and `app/apple-icon.png` with Acute monogram-derived icons.
- Restyle every existing component to match the handoff's component anatomy:
  - `Sidebar` (kept; brand-applied — replaces handoff's Header + FilterBar)
  - `PasswordScreen`
  - `CategorySection`, `CategoryHeader`
  - `TaskRow`, `TaskExpanded`, `StatusIndicator`, `AssigneeChip`
  - `AddTaskInput`, `AddCategoryInput`
- Add a slim navy top bar above the main content area with the lockup + "Deal Tracker" subtitle.
- Add a new `SummaryBar` component below the top bar (progress count + percentage + 4px terra progress bar).

### Out of scope

- "Working as: Ryan/Matt" toggle. The handoff describes one in the header, but the current code has no current-user identity feature; `useTasks.ts:75` always sets `completed_by: null`. Adding the toggle is a new feature, not a reskin. The "Completed by …" banner in `TaskExpanded` will continue to render its existing display logic but will not appear at runtime until the toggle ships. **Flagged as a follow-up.**
- Any data model, route, or behavior changes (status cycling, optimistic UI, realtime subscriptions, inline edit, filter logic, expand/collapse — all preserved).
- Dark mode.
- Mobile redesign beyond the responsive notes in the handoff (lockup secondary word hides under 480px; filter bar overflow scrolls; task expanded due-date stacks).

## Architecture

The component tree stays the same. Layout shape:

```
AuthGate
├── PasswordScreen (when unauthenticated)
└── AppShell
    ├── Sidebar (brand-applied: stone-2 bg, navy active state, lockup at top)
    └── main
        ├── [NEW] navy top bar — lockup, "Deal Tracker", future user toggle slot
        ├── [NEW] SummaryBar — progress text + terra percentage + progress bar
        ├── CategorySection × N
        │   ├── CategoryHeader (chevron, name, mono done/total counter)
        │   ├── TaskRow × N
        │   │   ├── StatusIndicator
        │   │   ├── title
        │   │   ├── AssigneeChip
        │   │   └── due date
        │   ├── TaskExpanded (when row expanded)
        │   └── AddTaskInput
        └── AddCategoryInput
```

## Design Tokens

Add to `app/globals.css`. **Wholesale replace** the existing teal block.

```css
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
  --color-ink-60: rgba(14, 30, 58, 0.62);
  --color-ink-40: rgba(14, 30, 58, 0.40);
  --color-ink-20: rgba(14, 30, 58, 0.18);
  --color-ink-10: rgba(14, 30, 58, 0.10);
  --color-ink-06: rgba(14, 30, 58, 0.06);
}
```

Plus a `.mono-label` utility:

```css
.mono-label {
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-ink-60);
}
```

`<body>` background changes from `bg-gray-50` to `bg-stone`.

### Find/replace map

| Old | New |
|---|---|
| `bg-teal-600` | `bg-terra` |
| `bg-teal-700` (hover) | `bg-terra-muted` |
| `bg-teal-50` | `bg-terra-tint` |
| `text-teal-700` | `text-terra` |
| `border-teal-500` | `border-terra` |
| `ring-teal-500/20` | `ring-terra/20` |
| `bg-blue-50` (Matt chip) | `bg-navy-tint` |
| `text-blue-700` (Matt chip) | `text-navy` |
| `bg-gray-50` (page bg) | `bg-stone` |

**Color discipline rule (Acute-tuned):** Terra is the **primary brand application** — used for filter active state, in-progress task accent border, completed status fill, primary CTAs (Add Task, Add Category, Sign In), and the Ryan assignee chip. Navy is reserved for: (1) the top bar chrome (dark band with white lockup), (2) the `in_progress` status indicator fill *only* (so it remains visually distinct from `done`, which is terra), (3) the `in_progress` segmented button in TaskExpanded, and (4) the Matt assignee chip. Stone-2 is the secondary surface (sidebar background, category headers).

> **Departure from handoff README:** The handoff specifies navy for filter active state and reserves terra for content meaning. Per Ryan's direction (2026-04-26), terra-on-stone is the primary color application across filter chrome. Navy is retained only where it preserves a critical visual distinction (status `in_progress` vs. `done`).

## Brand Assets

Source files live in `c:\Users\rbunker\claude-workspace\projects\acute\design\`. Copy the SVGs into `public/brand/` with handoff-conventional names:

| Source | Destination |
|---|---|
| `acute-monogram-navy.svg` | `public/brand/acute-mark.svg` |
| `acute-monogram-terracotta.svg` | `public/brand/acute-mark-terra.svg` |
| `acute-lockup-primary-navy.svg` | `public/brand/acute-lockup.svg` |
| `acute-lockup-secondary-stone.svg` | `public/brand/acute-lockup-stone.svg` |

White variants: no white SVGs exist in source. `Brand.tsx` will render a white version by applying `style={{ filter: "brightness(0) invert(1)" }}` to the navy SVG when `variant="white"`.

### Favicon and Apple icon

- `app/favicon.ico` → 32×32 from `acute-monogram-navy-32.png`. Use a small online ICO converter or the existing PNG renamed if Next supports PNG favicons (Next 15+ accepts both — PNG is fine).
- `app/apple-icon.png` → 180×180 PNG rendered from `acute-monogram-navy.svg` at 180×180. (Apple's recommendation is 180×180; Next will serve it for `apple-touch-icon`.) Use ImageMagick or an online SVG-to-PNG converter to render at exact pixel dimensions.

### Brand component (new)

`components/Brand.tsx`:

```tsx
import Image from "next/image";

export function AcuteMark({ size = 24, className = "" }: { size?: number; className?: string }) {
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

export function AcuteLockup({
  size = 22,
  variant = "navy",
  secondary = "logistics",
}: {
  size?: number;
  variant?: LockupVariant;
  secondary?: string;
}) {
  const fg = variant === "white" ? "#fff" : variant === "black" ? "#0B0B0B" : "#0E1E3A";
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

## Typography

`app/layout.tsx` adds JetBrains Mono via `next/font/google`:

```tsx
import { DM_Sans, JetBrains_Mono } from "next/font/google";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["400", "500"] });

// <html className={`${dmSans.variable} ${jetbrainsMono.variable} h-full`}>
```

Body and UI use DM Sans (already in place). Counters, status labels, due dates, mono badges, and `.mono-label` text use JetBrains Mono.

## Phases

### Phase 1 — Foundation

1. Update `app/globals.css`: replace teal block with Acute palette + `.mono-label` utility. Update `<body>` className from `bg-gray-50` to `bg-stone`.
2. Update `app/layout.tsx`: add JetBrains Mono via `next/font`.
3. Copy brand SVGs into `public/brand/`.
4. Replace `app/favicon.ico` and `app/apple-icon.png`.
5. Create `components/Brand.tsx`.

**Verify:** `npm run dev`. Page background should be stone. Favicon/Apple icon should render in tab. Brand SVGs should resolve at `/brand/acute-mark.svg`. No visual regressions in existing components yet (still teal-themed but on stone bg).

### Phase 2 — Sidebar (handoff's "left rail" replacing Header + FilterBar)

`components/Sidebar.tsx`:

- Container: `bg-stone-2` instead of `bg-white`. `border-r border-ink-10`.
- Top section: replace `<h1>Acute Deal Tracker</h1>` with `<AcuteLockup size={22} />` + on the line below, "Deal Tracker" at 13px, weight 450, `text-ink-60`.
- `SectionLabel`: drop the inline classes, apply `.mono-label`.
- `FilterRow` active state: replace `border-teal-600 bg-teal-50 font-medium text-teal-900` with `bg-terra text-white border-terra` (per Acute-tuned color discipline — terra is the primary brand application).
- `FilterRow` count pill (active): `bg-white/20 text-white`. (Inactive: `bg-ink-06 text-ink-60` instead of gray.)
- `FilterRow` inactive: `text-ink-60 hover:bg-ink-06 hover:text-navy`. Drop `border-l-2` accent.
- "Reset filters" link: `text-terra hover:text-terra-muted`.
- Mobile drawer: same color updates; backdrop stays `bg-black/30`.

**Verify:** sidebar fully on-brand; categories/who/status filters readable; active state is navy.

### Phase 3 — Top bar + SummaryBar

`components/AppShell.tsx`:

- Above `<div className="mx-auto w-full max-w-3xl ...">`, mount a new `components/TopBar.tsx`:
  - `bg-navy text-white px-7 py-3.5 sticky top-0 z-20`
  - Decorative triangle SVG bottom-right at 8% white opacity (160×160, positioned `bottom: -30; right: -30`).
  - Left: `<AcuteLockup size={22} variant="white" />` + 1×18px `bg-white/20` divider + "Deal Tracker" 13px weight 450 `text-white/85`.
  - Right: empty placeholder for future "Working as" toggle. Comment: `{/* Working-as user toggle — out of scope this pass */}`.
- Move the mobile menu button onto this top bar (drop the floating `fixed left-3 top-3` button).

`components/SummaryBar.tsx` (new):

- White bg, `border-b border-ink-10`, `px-7 py-4`.
- Computes `{ done, total, pct }` from `tasks` (props: `tasks: Task[]`).
- Top row, flex space-between baseline:
  - Left: `<span className="mono-label">PROGRESS</span> <span><strong>{done}</strong> of <strong>{total}</strong> tasks complete</span>`.
  - Right: `<span style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: 18, fontWeight: 500, color: 'var(--color-terra)', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>`.
- Progress bar: 4px tall, `bg-ink-06`, radius 2. Fill: `bg-terra width: pct%`, `transition: width 500ms ease`.

Mount `<SummaryBar tasks={tasks} />` in `AppShell` between the top bar and the categories list. Pass the unfiltered task list (progress reflects all tasks, not the filtered view).

**Verify:** top bar sticks on scroll; lockup renders white; SummaryBar shows correct counts and percentage; progress bar transitions smoothly.

### Phase 4 — Body components

`components/CategorySection.tsx` + `components/CategoryHeader.tsx`:

- Card: `bg-white border border-ink-10 rounded-md overflow-hidden`. (Remove `rounded-xl shadow-sm`.)
- Header: `bg-stone-2 px-[18px] py-[14px]`, flex, `gap-2.5`, `border-b border-ink-10` when expanded (no border when collapsed).
- Chevron: `text-ink-60`, 14×14, rotate 90° when expanded with 200ms transition.
- Name: 14px weight 600 `text-ink`. Inline-edit input gets `border border-terra` instead of teal.
- Counter pill (right): replace existing gray "{count}" with "{done}/{total}". Style: `bg-white border border-ink-10 text-ink-60`, padding `3px 8px`, font-mono 11px, `font-variant-numeric: tabular-nums`, radius 3.
- Task row separators: `border-b border-ink-06` on each `TaskRow` (remove `divide-y divide-gray-100` wrapper).
- Empty state: `py-6 px-6 text-center mono-label` "No tasks yet".

`components/TaskRow.tsx`:

- Container: `flex items-center gap-3 px-[18px] py-3 cursor-pointer`. Border-left: `3px solid transparent` always; `3px solid var(--color-terra)` when `status === "in_progress"`.
- Hover/expanded: `bg-[rgba(14,30,58,0.03)]`.
- Title: 14px weight 450 `leading-[1.35] truncate`. When done: `text-ink-40 line-through`.
- Right cluster: `flex items-center gap-2.5`.
- Due date: font-mono 11px `text-ink-60 min-w-[50px] text-right tabular-nums`. Overdue + not done: `text-terra font-medium`. Due today: `text-terra-muted font-medium`.

`components/StatusIndicator.tsx`:

- Button 26×26, rounded-full, 1.5px border.
- `not_started`: `bg-white border-ink-20`.
- `in_progress`: `bg-navy border-navy`, contains 7px white dot centered.
- `done`: `bg-terra border-terra`, contains 13px white checkmark SVG.
- Click cycles via existing `cycleStatus`.

`components/AssigneeChip.tsx`:

- Pill `font-mono uppercase text-[10px] tracking-[0.06em] px-2 py-[3px] border rounded-[3px]`.
- Ryan: `border-terra text-terra bg-terra/[0.06]`.
- Matt: `border-navy text-navy bg-navy/[0.05]`.
- Unassigned: `border-dashed border-ink-20 text-ink-40` showing "unassigned".

`components/TaskExpanded.tsx`:

- Container: `border-t border-ink-10 bg-paper px-[22px] py-[18px] flex flex-col gap-4`.
- Title input: `bg-white border border-ink-10 rounded px-3 py-2.5 text-sm font-medium`.
- Each field group: `.mono-label` label + control beneath.
- Status segmented buttons (3): active = `done` terra / `in_progress` navy / `not_started` ink-dark. Inactive: white bg, `border-ink-10`, `text-ink-60`. Padding `6px 12px`, fontSize 12, radius 4.
- Assignee segmented buttons (3): Ryan terra, Matt navy, Unassigned ink-60. Same shape.
- Due date input: `bg-white border-ink-10 rounded px-3 py-2 text-[13px]`.
- Notes textarea: `bg-white border-ink-10 rounded px-3 py-2.5 text-[13px] leading-[1.5]` min 3 rows.
- Completed banner (conditional, won't render until working-as toggle ships): `bg-terra/[0.07] border border-terra/20 rounded px-[14px] py-2.5 text-[12px] text-terra` with terra checkmark icon + "Completed by **{completed_by}** · {timestamp}".
- Delete: `mono-label text-ink-40 hover:text-terra` plain button.

### Phase 5 — Inputs + PasswordScreen

`components/AddTaskInput.tsx`:

- Container: `px-[18px] py-2.5 bg-paper border-t border-ink-06 flex items-center gap-2.5`.
- Plus icon: 14px `text-ink-40`.
- Input: transparent, borderless, `text-[13px] placeholder:text-ink-40 flex-1`.
- "Add ↵" button (visible only when input non-empty): `bg-terra text-white text-[10px] uppercase tracking-[0.06em] font-mono px-2 py-[3px] rounded-[3px]`.

`components/AddCategoryInput.tsx`:

- Collapsed button: `w-full py-3.5 px-4 border border-dashed border-ink-20 rounded-md text-ink-60 text-[13px] font-medium hover:border-ink-40 hover:text-navy`.
- Open: flex row — input (`flex-1 px-3.5 py-2.5 border border-ink-20 rounded`) + terra Add button + ghost Cancel (`text-ink-60 hover:text-navy`).

`components/PasswordScreen.tsx`:

- Background: `bg-stone min-h-screen`. Decorative SVG triangle bottom-right at 8% navy opacity (360×360 viewBox, `<path d="M360 120 L120 360 L360 360 Z" fill="#0E1E3A" />`, positioned absolutely `bottom: -80; right: -80`).
- Card: `bg-white w-[380px] p-9 pb-8 border border-ink-10 rounded-lg` (no shadow).
- Top: centered `<AcuteLockup size={26} />`.
- Title: "Acute Deal Tracker", `text-[18px] font-medium text-center`.
- Subtitle: `mono-label text-center` "Enter password to continue".
- Input: full-width, `px-3.5 py-3 border border-ink-20 rounded text-[14px]`. On error: `border-terra` + error message in `text-terra mono-label` below.
- Button: full-width, `bg-terra hover:bg-terra-muted text-white font-medium rounded py-3`.
- Preserve `animate-shake` keyframe on error (already in `globals.css`).

## Verification

After each phase:

1. `npm run dev`.
2. Walk through:
   - Password screen (logout to view): card, lockup, terra button, error state if password wrong.
   - Authenticated app: sidebar styling, top bar, summary bar, categories, tasks.
   - Click a status indicator: cycles through states with correct fills.
   - Click an assignee chip: cycles through Ryan/Matt/null.
   - Expand a task: bg-paper, segmented buttons, mono labels.
   - Add a task and a category: terra primary, dashed collapsed state.
   - Filter by Who and Status: navy active state on sidebar rows.
   - Resize to mobile: sidebar drawer opens, top bar stays, lockup `secondary=""` under 480px.
3. After Phase 5: full type-check via `npx next build` to confirm no TypeScript regressions.

## Out of Scope / Follow-up

- **Working-as user toggle.** Requires a new hook (`useCurrentUser`) backed by localStorage, a UI control in the top bar, and updating `useTasks.updateTask` to set `completed_by` to the current user when status transitions to `done`. Ship as a separate feature after the reskin lands.
- **Endorsement / stacked logos** in the design folder are not used. They're available for marketing surfaces (decks, email signatures) — not the app.
- **Brand pack rules** (clear space = triangle cutout height; minimum 16px monogram, 22px lockup; never recolor; never apply effects). These constrain *future* uses of the brand mark; current uses (handoff-specified sizes and CSS-filter white variant) comply.

## Risks

- **CSS filter white variant** can produce slight edge artifacts on low-DPI displays. If the navy lockup looks off when filtered to white in the top bar, we drop in a hand-edited white SVG — easy follow-up, not a blocker.
- **Tailwind v4 token names.** Existing `globals.css` uses `@theme inline` Tailwind v4 syntax. The new tokens follow the same shape. Verify after Phase 1 that `bg-terra`, `text-navy`, etc. compile via Tailwind v4's auto-generated utility classes.
- **Sidebar mobile drawer** retains its layout but the new colors must work on the dark backdrop. Phase 2 verification covers this.
