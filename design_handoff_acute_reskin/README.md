# Handoff: Acute Deal Tracker — Brand Reskin

## Overview

This package is a **visual reskin** of the existing `acute-deal-tracker` Next.js app, applying the Acute Logistics brand. The app's structure, data model, hooks, and component tree are preserved — only colors, typography, chrome, and a few small layout details change.

Source repo: `bunkerryan-source/acute-deal-tracker`
Branch: `main`

---

## About the Design Files

The HTML/JSX files in this bundle are **design references**, not production code. They were built as a static prototype to communicate the intended look. Your job is to translate the visual decisions into the existing Next.js + Tailwind codebase, preserving all current behavior, hooks (`useCategories`, `useTasks`, `useFilters`), Supabase wiring, and component boundaries.

**Do not** copy the JSX from this bundle into the app verbatim — the real components in `components/` already exist and are correctly wired. Update **their** styling and small structural details to match this design.

---

## Fidelity

**High-fidelity.** Exact hex values, type sizes, spacing, and component anatomy are specified below.

---

## Files in this bundle

| File | Purpose |
|---|---|
| `Acute Deal Tracker Reskin.html` | Open in a browser to see the live prototype (canvas with both screens) |
| `styles.css` | Brand tokens (CSS variables) and base styles — port these to `app/globals.css` |
| `brand.jsx` | `AcuteMark` (monogram SVG) + `AcuteLockup` (mark + wordmark) — port to a `Brand.tsx` component |
| `tracker-shell.jsx` | Reference renderings of `Header`, `SummaryBar`, `FilterBar`, `CategorySection`, `AddTaskInput`, `AddCategoryInput`, `PasswordScreen` |
| `tracker-rows.jsx` | Reference renderings of `StatusIndicator`, `AssigneeChip`, `TaskRow`, `TaskExpanded` |
| `data.jsx` | Sample seed data (matches the SQL migration) |
| `Acute Branding.pdf` | Source brand pack — logo usage, clear space, color rules |

---

## Design Tokens

Add these to `app/globals.css`. Replace the existing teal palette wholesale.

```css
@theme inline {
  --font-sans: var(--font-dm-sans);

  /* Brand */
  --color-terra: #BF4A20;       /* primary accent — buttons, Ryan, completed, progress */
  --color-terra-muted: #a64018; /* hover/pressed */
  --color-terra-tint: #fbeee8;  /* 10% tint, soft backgrounds */

  --color-navy: #0E1E3A;        /* header chrome, Matt, secondary buttons, text */
  --color-navy-2: #1a2c4d;
  --color-navy-tint: #e7eaf0;

  --color-stone: #EAE4D6;       /* page background */
  --color-stone-2: #f1ecdf;     /* category headers, filter rail */
  --color-paper: #faf7f0;       /* expanded task panel, add-task row */

  --color-black: #0B0B0B;
  --color-ink-60: rgba(14, 30, 58, 0.62);
  --color-ink-40: rgba(14, 30, 58, 0.40);
  --color-ink-20: rgba(14, 30, 58, 0.18);
  --color-ink-10: rgba(14, 30, 58, 0.10);
  --color-ink-06: rgba(14, 30, 58, 0.06);
}
```

**Find/replace map** (Tailwind classes used today → new):

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

---

## Typography

- Body / UI: **DM Sans** (already loaded via `next/font` per repo). Weights used: 400, 450, 500, 600.
- Metadata / labels / numbers: **JetBrains Mono** at 10–11px, uppercase, letter-spacing `0.06–0.12em`. Add via Google Fonts in `app/layout.tsx`.

`.mono-label` utility:
```css
font-family: "JetBrains Mono", ui-monospace, monospace;
font-size: 10px;
letter-spacing: 0.12em;
text-transform: uppercase;
color: var(--color-ink-60);
```

---

## Logo / Brand Mark

The user has logo files. Create `components/Brand.tsx` with two exports:

```tsx
// Brand.tsx
export function AcuteMark({ size = 24, className = "" }) {
  return <Image src="/brand/acute-mark.svg" alt="" width={size} height={size} className={className} />;
}

export function AcuteLockup({
  size = 22,
  variant = "navy",  // "navy" | "white" | "black"
  secondary = "logistics", // word shown after "acute" at 55% opacity. Pass "" to hide.
}) {
  const fg = variant === "white" ? "#fff" : variant === "black" ? "#0B0B0B" : "#0E1E3A";
  const src = variant === "white" ? "/brand/acute-mark-white.svg" : "/brand/acute-mark.svg";
  return (
    <span className="inline-flex items-center gap-2">
      <Image src={src} alt="Acute Logistics" width={size} height={size} />
      <span style={{ color: fg, fontSize: Math.round(size * 0.72) }} className="font-medium tracking-tight lowercase leading-none">
        acute{secondary && <span className="ml-1 opacity-55">{secondary}</span>}
      </span>
    </span>
  );
}
```

**Place provided logo files** under `public/brand/`:
- `acute-mark.svg` (navy on transparent — for light backgrounds)
- `acute-mark-white.svg` (white on transparent — for navy/dark backgrounds)
- `acute-lockup.svg` (full lockup, navy)
- `acute-lockup-white.svg` (full lockup, white)

If only one navy SVG is available, use a CSS filter (`filter: brightness(0) invert(1)`) for the white version, or apply `currentColor` if the SVG is single-path.

**Per the brand pack:** never recolor the monogram, never apply effects, honor clear space (= height of the triangle cutout), and minimum sizes are 16px digital for the monogram, 22px mark-height for the lockup.

---

## Screens

### 1. Password Gate (`PasswordScreen.tsx`)

- **Background:** `--color-stone`. Add a decorative SVG triangle in the bottom-right at 8% opacity (`<path d="M360 120 L120 360 L360 360 Z" fill="#0E1E3A" />` inside a 360×360 viewBox, positioned `bottom: -80; right: -80`).
- **Card:** white, 380px wide, padding `36px 36px 32px`, border `1px solid var(--color-ink-10)`, radius `8px`, no shadow.
- **Top of card:** centered `<AcuteLockup size={26} />`.
- **Title:** "Acute Deal Tracker", 18px, weight 500, centered.
- **Subtitle:** "Enter password to continue" — `.mono-label` style.
- **Input:** full-width, `12px 14px` padding, `1px solid var(--color-ink-20)` border, radius 4. On error: border becomes `var(--color-terra)`, error message in Terra below.
- **Button:** full-width, `bg-terra hover:bg-terra-muted`, white text, weight 500, radius 4.
- **Shake animation:** keep the existing `animate-shake` keyframe.

### 2. Task Board

#### Header (`Header.tsx`)

- **Container:** `bg-navy text-white`, `px-7 py-3.5`, `position: sticky top-0 z-20`. Add a decorative triangle SVG at 8% white opacity in the bottom-right (same shape as password gate, scale 160×160, positioned `bottom: -30; right: -30`).
- **Left:** `<AcuteLockup size={22} variant="white" />`, then a 1px × 18px white-20% divider, then `"Deal Tracker"` at 13px, weight 450, color `rgba(255,255,255,0.85)`.
- **Right (UserSelector):** label "Working as" in `.mono-label` (color `rgba(255,255,255,0.5)`), then a pill group with `padding: 3px`, `bg-white/8`, radius 4. Active state: `bg-terra` white text. Inactive: transparent, `text-white/70`. Pills: `padding: 5px 14px`, fontSize 12, weight 500.

#### Summary Bar (`SummaryBar.tsx`)

- **Container:** white, `border-bottom: 1px solid var(--color-ink-10)`, `px-7 py-4`. (Wider gutter than current `max-w-3xl`. Use the same container the rest of the page uses.)
- **Top row (flex space-between, baseline):**
  - Left: `.mono-label` "Progress" + body text "<strong>{completed}</strong> of <strong>{total}</strong> tasks complete"
  - Right: percentage in **JetBrains Mono**, 18px, weight 500, color Terra, `font-variant-numeric: tabular-nums`.
- **Progress bar:** 4px tall, `bg-ink-06`, radius 2. Fill: `bg-terra`, transitions `width 500ms ease`.

#### Filter Bar (`FilterBar.tsx`)

- **Container:** `bg-stone-2`, `border-bottom: 1px solid var(--color-ink-10)`, `px-7 py-3`, flex with `gap-6`.
- **Pills:** `padding: 5px 12px`, fontSize 12, weight 500, radius 3.
  - Inactive: white bg, `border: 1px solid var(--color-ink-10)`, `text-ink-60`.
  - **Active: `bg-navy text-white border-navy`** — Note: filter pills use Navy active, NOT Terra. This keeps Terra reserved for content meaning (Ryan / completed / accent).
- **Section labels** ("Who", "Status"): `.mono-label`.
- **Divider:** 1px × 18px `var(--color-ink-10)`.

#### Category Section (`CategorySection.tsx` + `CategoryHeader.tsx`)

- **Card:** `bg-white border border-ink-10 rounded-md overflow-hidden`. (Down from `rounded-xl shadow-sm` — flatter, more architectural.)
- **Header:** `bg-stone-2`, `px-4.5 py-3.5`, flex gap-2.5, `border-bottom: 1px solid var(--color-ink-10)` (no border when collapsed).
  - Chevron: 14×14, `text-ink-60`, rotates 90° when expanded (200ms transition).
  - Name: 14px, weight 600, `text-ink`. Click to inline-edit; editing state has `1px solid var(--color-terra)` border.
  - **Counter pill (right):** `<count_done>/<count_total>` in JetBrains Mono 11px, padding `3px 8px`, white bg, `border: 1px solid var(--color-ink-10)`, radius 3, `text-ink-60`, tabular-nums. (Replaces the current "12" gray pill — much more informative.)
- **Task list:** rows separated by `1px solid var(--color-ink-06)` (lighter than current `divide-gray-100`). No `divide-y` wrapper needed.
- **Empty state:** `padding: 24px`, centered, `.mono-label` "No tasks yet".

#### Task Row (`TaskRow.tsx`)

- **Container:** `display: flex; align-items: center; gap: 12px; padding: 12px 18px`. Cursor pointer.
- **Left border accent:** when `status === "in_progress"`, add `border-left: 3px solid var(--color-terra)`. Otherwise transparent (still 3px to avoid layout shift).
- **Hover/expanded:** `background: rgba(14,30,58,0.03)` (a Navy-tinted faint wash, not gray).
- **StatusIndicator (`StatusIndicator.tsx`):** 26×26 round button, `border: 1.5px solid`. States:
  - `not_started`: white bg, `border-color: var(--color-ink-20)`
  - `in_progress`: `bg-navy border-navy`, with a 7px white dot centered
  - `done`: `bg-terra border-terra`, with 13px white checkmark
- **Title:** 14px, weight 450, line-height 1.35, truncate. When done: `text-ink-40 line-through`.
- **Right cluster (flex gap-2.5):**
  - **AssigneeChip:** JetBrains Mono 10px, uppercase, letter-spacing 0.06em, `padding: 3px 8px`, radius 3, `border: 1px solid`.
    - Ryan: `border-terra text-terra bg-terra/6%`
    - Matt: `border-navy text-navy bg-navy/5%`
    - Unassigned: `border-dashed border-ink-20 text-ink-40` showing "unassigned"
  - **Due date:** JetBrains Mono 11px, `text-ink-60`, min-width 50px, right-aligned. If overdue and not done: `text-terra` weight 500. If due today: `text-terra-muted` weight 500.

#### Task Expanded (`TaskExpanded.tsx`)

- **Container:** `border-top: 1px solid var(--color-ink-10)`, `bg-paper`, `padding: 18px 22px`, flex column gap 4.
- **Title input:** white bg, `1px solid var(--color-ink-10)`, radius 4, `padding: 10px 12px`, fontSize 14, weight 500.
- **Each field group:** `.mono-label` label above, then control.
- **Status buttons:** segmented row of 3. Active state colored by status: `done` → Terra, `in_progress` → Navy, `not_started` → `var(--color-ink)` dark. Inactive: white bg, ink-10 border, ink-60 text. Padding `6px 12px`, fontSize 12, radius 4.
- **Assignee buttons:** same shape. Active: Ryan = Terra, Matt = Navy, Unassigned = ink-60. Inactive: white.
- **Due date:** native date input, white bg, ink-10 border, radius 4, padding `8px 12px`, fontSize 13.
- **Notes:** white textarea, 3 rows min, ink-10 border, radius 4, padding `10px 12px`, fontSize 13, line-height 1.5.
- **Completed banner** (only if `status === "done" && completed_by`):
  - `bg-terra/7%`, `border: 1px solid rgba(191,74,32,0.20)`, radius 4, padding `10px 14px`, fontSize 12, `text-terra`.
  - Content: Terra checkmark icon + "Completed by **{completed_by}** · {formatTimestamp(completed_at)}"
- **Delete:** plain text button, `.mono-label`, `text-ink-40`, no background.

#### Add Task Input (`AddTaskInput.tsx`)

- **Container:** `padding: 10px 18px`, `bg-paper`, `border-top: 1px solid var(--color-ink-06)`, flex gap-2.5.
- Plus icon (14px, `text-ink-40`), then transparent borderless input "Add task…" at 13px.
- When input has a value, show a small mono "Add ↵" button on the right: Terra bg, white text, fontSize 10, padding `3px 8px`, radius 3, uppercase, letter-spacing 0.06em.

#### Add Category Input (`AddCategoryInput.tsx`)

- **Collapsed:** full-width button, 14px padding, `1px dashed var(--color-ink-20)`, radius 6, `text-ink-60`, fontSize 13 weight 500. "+ Add category".
- **Open:** flex row — input (flex 1, padding `10px 14px`, ink-20 border, radius 4) + Terra "Add" button + ghost "Cancel" button.

---

## Interactions & Behavior (preserve existing)

All current behavior from the repo stays intact:
- Clicking the StatusIndicator cycles `not_started → in_progress → done → not_started` (`cycleStatus` in `lib/utils`).
- Clicking the AssigneeChip cycles `null → Ryan → Matt → null`.
- Clicking the task row toggles the expanded panel.
- Clicking the category name inline-edits.
- Real-time Supabase subscriptions, optimistic UI, and the `completed_by` / `completed_at` auto-set on status → done all stay as-is.
- Filter bar applies on `assigneeFilter` and `statusFilter`. Categories with zero matching tasks hide while filtering (existing behavior).

---

## Responsive notes

The repo's `max-w-3xl` constraint and `px-4` mobile gutter still apply. On mobile:
- Header: lockup secondary word ("logistics") can be hidden under 480px to save space — pass `secondary=""` to `AcuteLockup`.
- Filter bar: keep `overflow-x-auto` so pills can scroll horizontally.
- Task row right cluster: AssigneeChip + DueDate stack into the same row — already truncates correctly.
- Task expanded: due-date field becomes full-width instead of half.

---

## Out of scope for this reskin

- Component structure changes
- New routes or views
- Data model changes
- Adding/removing fields
- Dark mode

---

## Open question for the developer

The user mentioned they have **logo files** to add. Drop them in `public/brand/` with the names listed in the "Logo / Brand Mark" section above. If file names differ, update `Brand.tsx` `src` paths accordingly. Confirm with the user which background variant each provided file is intended for.
