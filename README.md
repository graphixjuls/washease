# WashEase

**Laundry, on your time.** See a free washer or dryer, reserve it, unlock it with your phone and choose your program on the machine. You pay a flat price when it starts. Building managers run machines, residents, payments and rules from a web admin.

- Design (Figma): https://www.figma.com/design/mzyeC2vl9LCiSYcfpBcaKD/Washing-Machine-Booking-App
- Product spec: [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md)
- Design system: [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
- Tokens: [`design/tokens.json`](design/tokens.json), [`design/tokens.css`](design/tokens.css)
- Illustrations: [`assets/illustrations/`](assets/illustrations)

## Status
Design is complete. Code has not been started yet. To build it, follow **[ANTIGRAVITY_PROMPT.md](ANTIGRAVITY_PROMPT.md)**.

## What's in this folder
```
ANTIGRAVITY_PROMPT.md   ← paste this into Google Antigravity to start the build
AGENTS.md               ← rules every coding agent must follow
.agent/rules/           ← the same rules, as an Antigravity workspace rule
docs/                   ← product spec + design system
design/                 ← design tokens (JSON + CSS, Light/Dark)
assets/illustrations/   ← hero, washer, dryer, empty-state (PNG)
.env.example            ← the environment variables the app will need
```

## Build it with Antigravity
1. Open Antigravity and choose **Open Folder**, then select this folder (`Washing Machine Booking App`).
2. Open `ANTIGRAVITY_PROMPT.md`, copy everything below the line, and paste it into a new agent task.
3. Let it work one phase at a time, and review its summary after each phase before saying “continue”.

## GitHub
This folder is on GitHub at https://github.com/graphixjuls/washease (private).

After Antigravity finishes a phase, commit and push from its terminal (**Terminal → New Terminal**):
```bash
git add .
git commit -m "feat: <what this phase added>"
git push
```

> Never commit your real `.env` file. It is already listed in `.gitignore`.
