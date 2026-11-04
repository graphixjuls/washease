# WashEase design system — “Fresh Aqua”

Figma page **06 — Design System** is the source. Tokens are in `design/tokens.json` and `design/tokens.css`.

## Colour (Light / Dark)
| Token | Light | Dark | Use |
|---|---|---|---|
| bg/canvas | #F6F9FF | #0B1220 | App background |
| bg/surface | #FFFFFF | #131C2E | Cards, sheets |
| bg/subtle | #EEF3FC | #1C2740 | Disabled fills, table headers |
| text/primary | #0E1B3D | #EEF2FB | Main text |
| text/secondary | #55607A | #A9B3C8 | Supporting text |
| text/disabled | #A3ABBE | #5B6680 | Disabled text |
| text/on-brand | #FFFFFF | #0B1220 | Text on brand/primary |
| brand/primary | #2F5BEA | #7C9BFF | Primary buttons, active nav, links |
| brand/strong | #1F43C2 | #A3B8FF | Pressed / hover |
| brand/tint | #E8EFFF | #1D2A4D | Active nav background, illustration backdrop |
| brand/accent | #3CC8C8 | #5ED9D9 | Progress, highlights (never for text on white) |
| border/default | #DDE4F0 | #2A3654 | Borders and dividers |
| border/strong | #2F5BEA | #7C9BFF | Secondary button border, focus |
| status/success (+ -tint) | #0F7A55 / #E1F6EE | #5DD6A4 / #11302A | Available, done, paid |
| status/warning (+ -tint) | #F5A524 / #FFF4E0 | #F7B955 / #3A2C14 | In use, reserved: bars, rings, dots and fills only |
| status/warning-text | #8A5A0F | #F5C978 | Orange **text** (e.g. “12 min left”). The light amber fails contrast as text, so always use this token for words |
| status/danger (+ -tint) | #C2343F / #FDE8EA | #F38C93 / #3D1C22 | Out of order, refunds, errors |
| status/info | #1F6FB2 | #82B8F1 | Info |

## Typography
| Style | Font | Size / line height |
|---|---|---|
| Display/Hero | Plus Jakarta Sans Bold | 36 / 44 |
| Heading/H1 | Plus Jakarta Sans Bold | 28 / 36 |
| Heading/H2 | Plus Jakarta Sans SemiBold | 24 / 32 |
| Heading/H3 | Plus Jakarta Sans SemiBold | 20 / 28 |
| Body/Large | Inter Regular | 16 / 24 |
| Body/Medium | Inter Regular | 14 / 21 |
| Label/Button | Inter SemiBold | 14 / 20 |
| Label/Medium | Inter Medium | 12 / 16 |

## Spacing and radius
- Spacing is on a 4-pt grid: 4, 8, 12, 16, 24, 32, 48. Screen side padding is 24 on mobile and 32 on admin.
- Radius: sm 8, md 12, lg 18, xl 24, full 999. Buttons use md, cards lg, hero cards xl.
- Shadow (card): `0 4px 14px rgba(0,0,0,0.06)`.

## Components
| Component | Variants / props | Notes |
|---|---|---|
| StatusBar | time | 390 × 56: time on the left; signal, Wi-Fi and battery on the right. Uses text/primary. On device, use the native status bar (Expo `StatusBar`), styled to match |
| Button | Primary, Secondary × Default, Disabled · label | **56 px tall**, label centred, radius md. One Primary per screen |
| StatusBadge | Available, In use, Out of order | Always a dot plus a word |
| MachineCard | title, details, price, status, action, image | Resident machine list |
| StepRow | number, title, text | “How it works” |
| TabBar | active: Home, My laundry, Profile | **Floating pill**: white, radius full, 8 px padding, soft shadow, 24 px above the bottom edge (plus the safe area), with a short canvas-colour fade behind it. Active item = brand pill (48 px tall) with a white **filled** icon and its label. Inactive items = 48 px bg/subtle circles with text/secondary outline icons (only the active pill is blue). Screens need 106 px bottom padding so content never sits under the bar. Give inactive items an accessibility label |
| IconButton | icon | 44 px round |
| DetailRow | label, value | Receipts, details |
| Toggle | on, off | Settings, rules |
| AdminSidebar | 7 items | Active item = **filled icon** on a brand/tint background |
| StatTile | label, value, note, icon | KPIs |
| MachineRow | machine, type, room, status, price, signal | Admin tables |
| ResidentRequest | initials, name, detail, approve/decline | Approvals |

## Icons
24 px line icons with a 2 px stroke (Lucide-style; `lucide-react` / `lucide-react-native` match closely). Navigation icons also have a **filled** version that is used only for the active state: grid, washer, users, clock, euro, building, settings, home, user.

## Illustrations
Soft 3D clay style in cobalt and aqua on a pale sky (#E8EFFF) background. The files are `assets/illustrations/hero.png`, `washer.png`, `dryer.png` and `empty-state.png`. Show them on brand/tint, with radius lg or xl.

## Copy
Use plain words: Reserve, In use, Out of order, Join the line, My laundry. Show the price before any commitment. Errors say what happened and what to do next.
