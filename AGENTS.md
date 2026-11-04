# AGENTS.md — rules for coding agents (Antigravity, Claude Code, Cursor, …)

## Project in one paragraph
WashEase lets residents of a shared apartment building see free washers and dryers, reserve one for 10 minutes, unlock it with their phone and choose the program on the machine. They pay a flat price per cycle when the machine starts. Building managers use a web admin to run machines, residents, payments and rules.

## Non-negotiables
1. **No time slots, no calendar booking, no time picker.** Residents reserve *now*; the machine owns program and duration.
2. Read `docs/PRODUCT_SPEC.md` before changing behaviour, and `docs/DESIGN_SYSTEM.md` before changing UI.
3. Use design tokens only (`design/tokens.json` / `tokens.css`). No hard-coded colours, spacing or radii in components.
4. Every screen must work in Light and Dark mode.
5. Reservation state changes happen **only** through the shared state machine (`packages/shared/src/reservation.ts`) and the matching Postgres functions. UI code never sets a status directly.
6. Reserving a machine must be atomic on the server: one active hold per machine, one active reservation per resident (configurable).
7. Money is stored in integer cents (EUR). Prices come from the building settings, never from the client.
8. Never commit secrets. Use `.env` locally and keep `.env.example` up to date.
9. Write tests for every new state transition or rule.
10. Copy rules: plain words — “Reserve”, “In use”, “Out of order”, “Join the line”. Always show the price before reserving: “€3.00 per wash · charged when it starts”.

## Repo layout (target)
```
apps/
  mobile/        Expo + React Native (resident app)
  admin/         Next.js (admin web)
packages/
  shared/        types, reservation state machine, tokens export
supabase/
  migrations/    SQL schema + RLS
  functions/     edge functions (machine events, simulator, payments)
  seed.sql
design/          tokens.json, tokens.css
docs/            PRODUCT_SPEC.md, DESIGN_SYSTEM.md
assets/          illustrations
```

## Commands (to be created in phase 1)
- `npm run dev:mobile` / `npm run dev:admin`
- `npm run test` — unit tests (shared logic) + component tests
- `npm run lint` / `npm run typecheck`
- `npm run simulate` — start the machine simulator

## Git
- Small commits with clear messages (e.g. `feat(mobile): reserve screen`).
- Default branch `main`. Never force-push to `main`.
