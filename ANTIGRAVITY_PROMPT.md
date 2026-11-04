# Build WashEase — prompt for Google Antigravity

Copy everything below the line into a new Antigravity agent task, with this folder open as the workspace.

---

You are building **WashEase**, a laundry-room app for shared apartment buildings. Residents see which washers/dryers are free, reserve one, unlock it with their phone and choose the program on the machine itself. Building managers run everything from a web admin.

**Read these files first, in this order, and treat them as the source of truth:**

1. `AGENTS.md` — rules for how to work in this repo
2. `docs/PRODUCT_SPEC.md` — the booking model, rules, screens, data model and edge cases
3. `docs/DESIGN_SYSTEM.md` — colours, type, spacing, components
4. `design/tokens.json` and `design/tokens.css` — design tokens (Light + Dark)
5. `assets/illustrations/` — the 4 illustrations to use in the UI

Figma (visual reference for every screen): https://www.figma.com/design/mzyeC2vl9LCiSYcfpBcaKD/Washing-Machine-Booking-App
- Page 07 = resident app (13 screens), page 08 = admin web (8 screens), page 06 = design system.

## Most important rule

**There are no time slots.** Never build a calendar or a time picker. The flow is:
reserve a free machine now → it is held for 10 minutes → resident unlocks it at the machine → resident picks program and duration **on the machine** → the flat price is charged when the machine reports it has started → the app shows remaining time reported by the machine → push notification when done.

## Tech stack

- Monorepo with npm workspaces:
  - `apps/mobile` — Expo (React Native) + TypeScript + Expo Router
  - `apps/admin` — Next.js (App Router) + TypeScript + Tailwind CSS
  - `packages/shared` — TypeScript types, the reservation state machine, tokens export
  - `supabase/` — SQL migrations, seed data, Edge Functions
- Backend: Supabase (Postgres, Auth, Realtime, Edge Functions, cron)
- Payments: Stripe in **test mode** only
- Machines: there is no real hardware yet. Build a `MachineGateway` interface and a **machine simulator** (an Edge Function or Node script) that fakes unlock, start (with a random program and duration), progress, finish and fault events. The real Bluetooth/gateway integration will replace it later.

## Build in phases — stop and show me a summary after each one

1. **Scaffold:** monorepo, lint, prettier, TypeScript strict, `.env.example`, root README scripts (`npm run dev:mobile`, `npm run dev:admin`, `npm run test`).
2. **Design tokens & UI kit:** load `design/tokens.json` into both apps (CSS variables on web, a theme object on mobile, Light + Dark). Build the shared components listed in `docs/DESIGN_SYSTEM.md` (Button, StatusBadge, MachineCard, StepRow, TabBar, IconButton, DetailRow, Toggle, StatTile, AdminSidebar, MachineRow, ResidentRequest). Use the fonts Plus Jakarta Sans (headings) and Inter (body).
3. **Database:** Supabase migrations for the tables in the spec, row-level security (residents only see their building; managers only their buildings), and seed data: building “Wilhelmstr. 12, 79098 Freiburg”, rooms A and B, 10 washers and 10 dryers (Washer 01–10 and Dryer 01–10, five of each per room; Miele PWM 507 / PDR 507, 8 kg), invite code 482913. Prices: €3.00 per wash, €2.00 per dry.
4. **Reservation logic** in `packages/shared` + Postgres functions: `reserve_machine`, `cancel_reservation`, `unlock_machine`, `handle_machine_event`, `expire_holds` (cron, every minute), queue `join_line` / `offer_next`. Reserving must be atomic: two people can never hold the same machine. Write unit tests for every state transition in the spec.
5. **Resident app:** all 13 screens from Figma page 07 (welcome, verify building, home, all machines by type with Washers/Dryers tabs, reserve, reserved, unlock, running, done, all busy, in line, my laundry, empty). The tab bar is the floating pill described in `docs/DESIGN_SYSTEM.md`, and buttons are 56 px tall. Live status through Supabase Realtime. Push notifications through Expo Notifications.
6. **Admin web app:** all 8 screens from Figma page 08 (dashboard, activity, machines, machine detail, residents, payments, building & rules, settings). Every rule in “Building & rules” must be editable and must change the backend behaviour.
7. **Payments:** Stripe test mode. Save a card on sign-up; create the charge when the machine reports “started”. If the payment fails, the machine stays locked. Refund automatically on a machine fault.
8. **Polish:** empty, loading and error states from the spec, accessibility checks (contrast, touch targets of at least 44 px, screen-reader labels), and a README that explains setup step by step for a beginner.

## Definition of done

- `npm run test` passes and covers the reservation state machine and its edge cases.
- With the simulator running, I can go through the full resident flow and see the same activity live in the admin dashboard.
- No time picker exists anywhere in the product.
- Colours and spacing come only from the tokens, with no hard-coded hex values in components.
- Secrets live only in `.env` (never committed). `.env.example` lists every variable.
