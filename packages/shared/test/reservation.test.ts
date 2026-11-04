import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  createReservation,
  transitionReservation,
  isWithinQuietHours,
} from '../src/reservation.ts';
import { DEFAULT_BUILDING_SETTINGS, formatEuros } from '../src/types.ts';

describe('Reservation State Machine & Rules', () => {
  const settings = { ...DEFAULT_BUILDING_SETTINGS, quiet_hours: '22:00-06:00' };

  test('formatEuros formats integer cents correctly', () => {
    assert.equal(formatEuros(300), '€3.00');
    assert.equal(formatEuros(200), '€2.00');
    assert.equal(formatEuros(50), '€0.50');
  });

  test('quiet hours detection works correctly', () => {
    // 23:30 is in quiet hours
    const lateNight = new Date('2026-11-04T23:30:00');
    assert.equal(isWithinQuietHours(lateNight, '22:00-06:00'), true);

    // 03:00 is in quiet hours
    const earlyMorning = new Date('2026-11-04T03:00:00');
    assert.equal(isWithinQuietHours(earlyMorning, '22:00-06:00'), true);

    // 14:00 is not in quiet hours
    const daytime = new Date('2026-11-04T14:00:00');
    assert.equal(isWithinQuietHours(daytime, '22:00-06:00'), false);
  });

  test('happy path: held -> unlocked -> running -> done -> collected', () => {
    const midday = new Date('2026-11-04T12:00:00');

    // 1. Reserve washer
    const created = createReservation({
      id: 'res-1',
      machineId: 'm-1',
      machineType: 'washer',
      machineStatus: 'available',
      residentId: 'resident-1',
      activeReservationsCount: 0,
      settings,
      now: midday,
    });

    assert.equal(created.success, true);
    if (!created.success) return;

    assert.equal(created.reservation.status, 'held');
    assert.equal(created.reservation.amountCents, 300); // €3.00 from settings
    assert.equal(created.machineStatus, 'reserved');

    // 2. Unlock at machine
    const unlocked = transitionReservation(created.reservation, {
      type: 'UNLOCK',
      now: new Date('2026-11-04T12:03:00'),
    });
    assert.equal(unlocked.success, true);
    assert.equal(unlocked.reservation.status, 'unlocked');
    assert.equal(unlocked.machineStatus, 'reserved');

    // 3. Choose program & Start with payment success
    const started = transitionReservation(unlocked.reservation, {
      type: 'START_CYCLE',
      programName: 'Cotton 40°C',
      durationMinutes: 60,
      paymentSuccess: true,
      paymentIntentId: 'pi_test123',
      now: new Date('2026-11-04T12:05:00'),
    });
    assert.equal(started.success, true);
    assert.equal(started.reservation.status, 'running');
    assert.equal(started.reservation.paymentStatus, 'paid');
    assert.equal(started.machineStatus, 'running');

    // 4. Machine reports finished
    const finished = transitionReservation(started.reservation, {
      type: 'FINISH_CYCLE',
      now: new Date('2026-11-04T13:05:00'),
    });
    assert.equal(finished.success, true);
    assert.equal(finished.reservation.status, 'done');
    assert.equal(finished.machineStatus, 'done');

    // 5. Resident collects laundry
    const collected = transitionReservation(finished.reservation, {
      type: 'COLLECT',
      now: new Date('2026-11-04T13:15:00'),
    });
    assert.equal(collected.success, true);
    assert.equal(collected.reservation.status, 'collected');
    assert.equal(collected.machineStatus, 'available');
  });

  test('cancellation: allowed only while held', () => {
    const midday = new Date('2026-11-04T12:00:00');
    const created = createReservation({
      id: 'res-2',
      machineId: 'm-2',
      machineType: 'dryer',
      machineStatus: 'available',
      residentId: 'resident-2',
      activeReservationsCount: 0,
      settings,
      now: midday,
    });
    assert.equal(created.success, true);
    if (!created.success) return;

    // Can cancel while held
    const cancelled = transitionReservation(created.reservation, {
      type: 'CANCEL',
      now: new Date('2026-11-04T12:02:00'),
    });
    assert.equal(cancelled.success, true);
    assert.equal(cancelled.reservation.status, 'cancelled');
    assert.equal(cancelled.machineStatus, 'available');

    // Cannot cancel after start
    const runningRes = {
      ...created.reservation,
      status: 'running' as const,
      paymentStatus: 'paid' as const,
    };
    const cancelRunning = transitionReservation(runningRes, { type: 'CANCEL' });
    assert.equal(cancelRunning.success, false);
  });

  test('payment failure at start keeps machine locked and state unlocked', () => {
    const midday = new Date('2026-11-04T12:00:00');
    const created = createReservation({
      id: 'res-3',
      machineId: 'm-3',
      machineType: 'washer',
      machineStatus: 'available',
      residentId: 'resident-3',
      activeReservationsCount: 0,
      settings,
      now: midday,
    });
    assert.equal(created.success, true);
    if (!created.success) return;

    const unlocked = transitionReservation(created.reservation, { type: 'UNLOCK', now: midday });
    assert.equal(unlocked.success, true);

    const startFail = transitionReservation(unlocked.reservation, {
      type: 'START_CYCLE',
      programName: 'Quick 30',
      durationMinutes: 30,
      paymentSuccess: false,
    });
    assert.equal(startFail.success, false);
    assert.equal(startFail.reservation.status, 'unlocked');
    assert.equal(startFail.reservation.paymentStatus, 'failed');
    assert.equal(startFail.machineStatus, 'reserved');
  });

  test('machine fault mid-cycle interrupts cycle, triggers auto-refund, sets machine out_of_order', () => {
    const runningRes = {
      id: 'res-4',
      machineId: 'm-4',
      residentId: 'resident-4',
      status: 'running' as const,
      heldUntil: new Date(),
      unlockedAt: new Date(),
      startedAt: new Date(),
      programName: 'Delicates 30',
      expectedEndAt: new Date(),
      endedAt: null,
      amountCents: 300,
      paymentStatus: 'paid' as const,
      paymentIntentId: 'pi_test999',
    };

    const fault = transitionReservation(runningRes, {
      type: 'FAULT',
      reason: 'Drain error E20',
      autoRefund: true,
    });
    assert.equal(fault.success, true);
    assert.equal(fault.reservation.status, 'interrupted');
    assert.equal(fault.reservation.paymentStatus, 'refunded');
    assert.equal(fault.machineStatus, 'out_of_order');
    assert.equal(fault.refundTriggered, true);
  });

  test('enforces max active reservations per resident', () => {
    const midday = new Date('2026-11-04T12:00:00');
    const blocked = createReservation({
      id: 'res-5',
      machineId: 'm-5',
      machineType: 'washer',
      machineStatus: 'available',
      residentId: 'resident-5',
      activeReservationsCount: 1, // already has 1 active reservation
      settings,
      now: midday,
    });
    assert.equal(blocked.success, false);
    if (!blocked.success) {
      assert.match(blocked.error, /already have 1 active reservation/);
    }
  });

  test('prevents reserving busy or out of order machines', () => {
    const midday = new Date('2026-11-04T12:00:00');
    const busy = createReservation({
      id: 'res-6',
      machineId: 'm-6',
      machineType: 'washer',
      machineStatus: 'running',
      residentId: 'resident-6',
      activeReservationsCount: 0,
      settings,
      now: midday,
    });
    assert.equal(busy.success, false);

    const outOfOrder = createReservation({
      id: 'res-7',
      machineId: 'm-7',
      machineType: 'dryer',
      machineStatus: 'out_of_order',
      residentId: 'resident-7',
      activeReservationsCount: 0,
      settings,
      now: midday,
    });
    assert.equal(outOfOrder.success, false);
  });
});
