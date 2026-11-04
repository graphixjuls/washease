# WashEase — Product spec (v2)

Figma: https://www.figma.com/design/mzyeC2vl9LCiSYcfpBcaKD/Washing-Machine-Booking-App
Market: shared residential buildings, pilot in Freiburg im Breisgau (DE). Currency: EUR. Access: verified residents only.

---

## 1. Problem → insights → solutions

**Problem:** Residents can't tell if a machine is free, or keep one while they walk down. Building managers can't see, price or fix their laundry rooms without being on site.

| # | Insight (assumption until validated in interviews) | What we built | Where |
|---|---|---|---|
| 1 | The first question is “is one free right now?”, not “when can I book?” | Live availability first: a banner like “10 of 20 machines free now” and a status on every machine | Home |
| 2 | Laundry doesn't fit a slot: programs run 30 min–3 h and people decide at the machine | **No time slots.** Reserve now; program and duration are chosen on the machine | Reserve, Unlock |
| 3 | The walk downstairs is the risk: the machine gets taken, or clothes get moved | A 10-minute hold that only you can unlock, plus a collection reminder | Reserved, Done |
| 4 | Payment is friction (coins, cards, price confusion) | One flat price per cycle, charged automatically at start | Reserve, Payments |
| 1+3 | Evenings are busy | Join the line: the next free machine is held for you for 5 minutes | All busy, In line |
| 5 | Managers manage exceptions, not calendars | A dashboard of what needs attention, live activity, and automatic refunds on faults | Admin |

---

## 2. The booking model (no time slots)

| Step | Who | What happens |
|---|---|---|
| 1. Reserve | App | Resident reserves a **free** machine. It is held for `hold_minutes` (default 10). Nothing is charged. |
| 2. Unlock | App → machine | Next to the machine, the resident taps **Unlock** (Bluetooth). Fallback: a 6-digit code typed on the machine panel, valid only during this hold. |
| 3. Choose program | Machine | Resident chooses program, temperature and options **on the machine panel** and presses Start. |
| 4. Charge | Backend | When the machine reports `started`, the flat price is charged to the saved payment method. If the payment fails, the machine stays locked and the resident is asked to change the method. |
| 5. Running | Machine → app | The machine reports program name, expected duration and progress. The app shows the time left. |
| 6. Done | App | A push notification is sent when the cycle finishes, then a collection reminder after `collect_reminder_minutes` (default 15), repeated every 10 min. |

### Rules (per building, editable in Admin → Building & rules)
| Setting | Default | Notes |
|---|---|---|
| `hold_minutes` | 10 | Walk-down hold. When it expires, the machine is released with no charge, and the next person in line is notified. |
| `queue_hold_minutes` | 5 | When a machine becomes free, the first resident in line gets it for this long. |
| `max_active_reservations` | 1 | Per resident, counting holds and running cycles. |
| `price_washer_cents` | 300 | Flat per cycle, any program, VAT included. |
| `price_dryer_cents` | 200 | |
| `max_cycle_minutes` | 180 | The machine stops automatically after this. |
| `collect_reminder_minutes` | 15 | |
| `quiet_hours` | 22:00–06:00 | Machines can't be started during quiet hours. |
| `require_manager_approval` | true | New residents wait in “Pending approvals”. |
| `auto_refund_on_fault` | true | |

Cancellation is free while the machine is held. A cycle can't be cancelled after it starts.

---

## 3. State machines

### Reservation
```
held ──unlock──▶ unlocked ──machine:started + payment ok──▶ running ──machine:finished──▶ done ──door opened / resident confirms──▶ collected
 │                 │                       └─payment failed──▶ unlocked (machine stays locked, ask for new method)
 │                 └─hold expired──▶ expired
 ├─resident cancels──▶ cancelled
 └─hold expired──▶ expired
running ──machine:fault / offline──▶ interrupted (auto refund)
```

### Machine status (shown everywhere)
`available` → `reserved` → `running` → `done` (until collected) → `available`.
Also `out_of_order`, which an admin sets manually, or which is set automatically on a fault or when the machine goes offline. Residents see it as: **Available**, **In use** (reserved/running/done), and **Out of order**.

### Queue entry
`waiting` → `offered` (machine held for `queue_hold_minutes`) → `claimed` (becomes a reservation in `held`). Other exits: `left`, or `expired`, after which the offer moves to the next person in line.

---

## 4. Data model (Supabase / Postgres)

```
buildings(id, name, address, city, invite_code, settings jsonb, created_at)
rooms(id, building_id, name, floor)
machines(id, room_id, name, type 'washer'|'dryer', model, capacity_kg,
         status, last_signal_at, gateway_id, created_at)
profiles(id → auth.users, building_id, flat, full_name,
         role 'resident'|'manager'|'owner'|'technician',
         membership 'pending'|'active'|'paused', created_at)
reservations(id, machine_id, resident_id, status, held_until, unlocked_at,
             started_at, program_name, expected_end_at, ended_at,
             amount_cents, payment_status 'none'|'paid'|'failed'|'refunded',
             payment_intent_id, created_at)
queue_entries(id, building_id, room_id null, machine_type, resident_id, status,
              offered_machine_id null, offer_expires_at null, created_at)
machine_events(id, machine_id, type 'unlocked'|'started'|'progress'|'finished'|'fault'|'offline'|'online',
               payload jsonb, created_at)
faults(id, machine_id, reported_by, description, photo_url, status 'open'|'fixed', created_at)
payouts(id, building_id, period, amount_cents, status, paid_at)
```

Row-level security:
- Residents can read their own building's machines and rooms, and their own reservations and queue entries.
- Managers, owners and technicians can read everything in their buildings. Only managers and owners can write settings.

### Server functions (all atomic, all tested)
- `reserve_machine(machine_id)` locks the row, checks status, rules and quiet hours, creates a `held` reservation, and sets the machine to `reserved`.
- `cancel_reservation(id)` is allowed only while the reservation is `held`.
- `unlock_machine(id)` returns a BLE token plus the fallback code, and sets the reservation to `unlocked`.
- `handle_machine_event(machine_id, type, payload)` is the gateway/simulator webhook that drives the state transitions above.
- `expire_holds()` runs on a cron every minute. It expires holds and queue offers, and calls `offer_next`.
- `join_line(type, room_id?)`, `leave_line(id)`, `offer_next(machine_id)`.

---

## 5. Screens

### Resident app (Figma page 07)
1. **Welcome:** hero illustration, value proposition, “Get started” and “I already have an account”.
2. **Verify building:** 6-digit invite code or QR, a “building found” confirmation, and “Join building”. Without a code, the resident asks the manager for access.
3. **Home:** location, availability banner (“10 of 20 machines free now”), and machine cards by room. Each card shows status, price, and either **Reserve** (when free) or **Notify me** (when in use, with an estimate like “Free in about 25 min” taken from the machine timer).
3b. **All machines (by type):** tabs for Washers · N free and Dryers · N free. Each tab shows:
   - A ring summary (free / in use / out of order) with “Next one frees up in X min”.
   - **Free now** buttons, one per free machine; tap one to reserve it.
   - A **Busy** list sorted by soonest finish, with progress bars, plus “+ N more” when the list is long.
   - Out-of-order machines.
   - “Reserve a free washer/dryer”.
   It opens on the last tab the resident used. When nothing is free, “Free now” becomes a **Join the line** button. Example building: 10 washers + 10 dryers.
4. **Reserve machine:** image and status, “How it works” in 3 steps, price (“€3.00 per wash · charged when it starts”), and the **Reserve** button.
5. **Reserved:** countdown (e.g. 09:42), room and floor, “I'm at the machine — Unlock” and “Cancel reservation”.
6. **Unlock:** time left on the hold, Bluetooth hint, “Unlock Washer 01”, and the fallback code.
7. **Running:** progress ring with time left, program “set on the machine”, details, the notification note, and “Report a problem”.
8. **Done:** success state, receipt, “I've collected it” and “Reserve a dryer”.
9. **All busy:** warning banner, machine list with estimated wait, “Join the line”.
10. **In line:** position in line, estimate, explanation of the 5-minute hold, “Leave the line”.
11. **My laundry:** “Now” card (running, reserved or done) and earlier cycles with receipts.
12. **My laundry (empty):** illustration and “Find a free machine”.

Buttons are 56 px tall throughout.

Tabs: Home · My laundry · Profile, shown in a floating pill bar. The active tab expands into a brand-coloured pill with a filled icon and its label. Inactive tabs are grey outline icons in soft grey circles.

### Admin web (Figma page 08), 1440 px desktop
1. **Dashboard:** KPIs (cycles today, utilisation, revenue, machines offline), machines right now, live activity, “Needs attention”.
2. **Activity:** every reservation and cycle, with filters, the program and duration reported by the machine, and status chips.
3. **Machines:** filterable table, plus the rule cards for hold, queue and collection.
4. **Machine detail:** right now, usage over the last 7 days, settings, fault history, “Set out of order”.
5. **Residents:** pending approvals (approve or decline) and all residents.
6. **Payments:** revenue, refunds, next payout, transactions, payouts and prices.
7. **Building & rules:** reservation rules (every setting in §2), prices, laundry rooms, and resident access (invite code, approval toggle).
8. **Settings:** team and roles, notifications, payout account.

Sidebar: Dashboard · Machines · Residents · Activity · Payments · Building & rules · Settings. The active item uses the filled icon on a tinted background.

---

## 6. Edge cases
| Case | Resident sees | System |
|---|---|---|
| Two residents reserve the same machine | The second resident sees “Washer 01 was just taken — Washer 03 is free.” | Atomic reserve; the first write wins |
| Hold about to expire | Push at 2 min left | Released at `hold_minutes`; the next person in line is notified |
| Payment fails at Start | “Payment didn't go through. Change method to start.” | The machine stays locked and nothing is charged |
| Bluetooth unavailable | Fallback code on the Unlock screen | The code is valid only during this hold |
| Machine offline or fault mid-cycle | Banner and push: “Washer 01 stopped. You've been refunded.” | Auto refund; admin alert; machine set to `out_of_order` |
| Laundry not collected | Reminder at 15 min, then every 10 min | Admin sees “Done · not collected” |
| All machines busy | “Join the line” with an estimated wait | Queue per room and machine type |
| No internet | Cached status with “last updated”; Reserve is disabled and the reason is shown | Retry on reconnect |
| Quiet hours | “Machines can be started again at 06:00.” | `reserve_machine` rejects the request |

---

## 7. Notifications (copy)
- Hold expiring soon: “Washer 01 is held for 2 more minutes.”
- Queue offer: “Washer 02 is free — it's held for you for 5 minutes.”
- Done: “Your laundry in Washer 01 is ready.”
- Collect reminder: “Please collect your laundry from Washer 01 so the next neighbour can wash.”
- Refund: “Washer 01 stopped. You've been refunded €3.00.”

---

## 8. Success metrics (pilot targets, not results)
- Under 30 s to reserve a free machine
- At least 85% of reservations become a cycle
- Under 10% of holds expire unused
- 50% fewer manager complaints

## 9. Out of scope for v1
Scheduling ahead, dynamic pricing, detergent dosing, multi-building portfolio reports, and an open API.
