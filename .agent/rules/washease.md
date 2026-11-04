# WashEase workspace rules

Follow `AGENTS.md` at the repository root. The most important rules are:

- There are no time slots. Residents reserve a free machine now (10-minute hold), unlock it at the machine and choose program and duration on the machine. Never build a time picker or calendar booking.
- `docs/PRODUCT_SPEC.md` and `docs/DESIGN_SYSTEM.md` are the source of truth.
- Use only design tokens from `design/tokens.json`, and support Light and Dark mode.
- All reservation status changes go through the shared state machine plus the Postgres functions.
- Money is stored in integer cents (EUR). Never commit secrets.
