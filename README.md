# WashEase

**Laundry, on your time.** See a free washer or dryer, reserve it, unlock it with your phone and choose your program on the machine. You pay a flat price when it starts. Building managers run machines, residents, payments and rules from a web admin.

- **Live Admin Portal (Vercel):** [https://washease-nine.vercel.app](https://washease-nine.vercel.app)
- **Design (Figma):** [Figma link](https://www.figma.com/design/mzyeC2vl9LCiSYcfpBcaKD/Washing-Machine-Booking-App)
- **Product spec:** [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md)
- **Design system:** [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
- **Tokens:** [`design/tokens.json`](design/tokens.json), [`design/tokens.css`](design/tokens.css)
- **Illustrations:** [`assets/illustrations/`](assets/illustrations)

## Status
- **Monorepo & Phase 1 Scaffold:** Complete (`apps/admin`, `apps/mobile`, `packages/shared`, `scripts/simulate.mjs`).
- **Shared State Machine:** Complete (`packages/shared/src/reservation.ts`) with unit tests covering atomic hold, quiet hours, auto-refund, and max reservations.
- **Admin Web App:** Live Next.js app running on Vercel at [washease-nine.vercel.app](https://washease-nine.vercel.app), supporting Light/Dark mode and all 7 management tabs.

## Repo Layout
```
apps/
  admin/         Next.js (App Router, Tailwind CSS, Admin Web)
  mobile/        Expo / React Native (resident app)
packages/
  shared/        types, reservation state machine, tokens export
scripts/
  simulate.mjs   machine simulator (unlock, cycle start, progress, finish)
design/          tokens.json, tokens.css
docs/            PRODUCT_SPEC.md, DESIGN_SYSTEM.md
assets/          illustrations
```

## Commands
- `npm run dev:admin` — Start Next.js admin web portal
- `npm run dev:mobile` — Start mobile resident app
- `npm run test` — Run state machine unit tests
- `npm run simulate` — Run machine simulator
- `npm run build` — Build admin web portal for production

> **Tip for Windows PowerShell users:** If PowerShell reports `npm.ps1 cannot be loaded because running scripts is disabled`, either run `npm.cmd` / `npx.cmd` or enable local script execution once:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

## GitHub & Vercel
The repository is deployed automatically on push to `main` via Vercel:
```bash
git add .
git commit -m "feat: <description>"
git push origin main
```
To ensure Git credentials always authenticate automatically without prompting, use GitHub CLI:
```bash
gh auth setup-git
```
