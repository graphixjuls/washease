import type {
  MachineStatus,
  ReservationStatus,
  PaymentStatus,
  BuildingSettings,
  MachineType,
} from './types.ts';

export interface ReservationState {
  id: string;
  machineId: string;
  residentId: string;
  status: ReservationStatus;
  heldUntil: Date;
  unlockedAt: Date | null;
  startedAt: Date | null;
  programName: string | null;
  expectedEndAt: Date | null;
  endedAt: Date | null;
  amountCents: number;
  paymentStatus: PaymentStatus;
  paymentIntentId: string | null;
}

export type ReservationAction =
  | { type: 'UNLOCK'; now?: Date }
  | {
      type: 'START_CYCLE';
      programName: string;
      durationMinutes: number;
      paymentSuccess: boolean;
      paymentIntentId?: string;
      now?: Date;
    }
  | { type: 'FINISH_CYCLE'; now?: Date }
  | { type: 'COLLECT'; now?: Date }
  | { type: 'CANCEL'; now?: Date }
  | { type: 'EXPIRE'; now?: Date }
  | { type: 'FAULT'; reason: string; autoRefund?: boolean; now?: Date }
  | { type: 'OFFLINE'; autoRefund?: boolean; now?: Date };

export interface TransitionResult {
  success: boolean;
  reservation: ReservationState;
  machineStatus: MachineStatus;
  error?: string;
  refundTriggered?: boolean;
}

/**
 * Check if the given time falls within quiet hours (e.g., "22:00-06:00")
 */
export function isWithinQuietHours(now: Date, quietHours: string): boolean {
  if (!quietHours || !quietHours.includes('-')) return false;

  const [startStr, endStr] = quietHours.split('-');
  const [startH, startM] = startStr.split(':').map(Number);
  const [endH, endM] = endStr.split(':').map(Number);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes > endMinutes) {
    // Overnight range (e.g. 22:00 to 06:00)
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  } else {
    // Same-day range
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
}

/**
 * Creates an initial held reservation adhering to building rules.
 */
export function createReservation(params: {
  id: string;
  machineId: string;
  machineType: MachineType;
  machineStatus: MachineStatus;
  residentId: string;
  activeReservationsCount: number;
  settings: BuildingSettings;
  now?: Date;
}): { success: true; reservation: ReservationState; machineStatus: MachineStatus } | { success: false; error: string } {
  const now = params.now ?? new Date();

  // 1. Check machine availability
  if (params.machineStatus !== 'available') {
    return {
      success: false,
      error: `Machine is ${params.machineStatus === 'out_of_order' ? 'Out of order' : 'In use'}.`,
    };
  }

  // 2. Check quiet hours
  if (isWithinQuietHours(now, params.settings.quiet_hours)) {
    return {
      success: false,
      error: 'Machines cannot be started during quiet hours.',
    };
  }

  // 3. Check resident limit
  if (params.activeReservationsCount >= params.settings.max_active_reservations) {
    return {
      success: false,
      error: `You already have ${params.activeReservationsCount} active reservation(s).`,
    };
  }

  // 4. Calculate hold duration and price from building settings (never client)
  const holdMinutes = params.settings.hold_minutes;
  const heldUntil = new Date(now.getTime() + holdMinutes * 60 * 1000);
  const amountCents =
    params.machineType === 'washer'
      ? params.settings.price_washer_cents
      : params.settings.price_dryer_cents;

  const reservation: ReservationState = {
    id: params.id,
    machineId: params.machineId,
    residentId: params.residentId,
    status: 'held',
    heldUntil,
    unlockedAt: null,
    startedAt: null,
    programName: null,
    expectedEndAt: null,
    endedAt: null,
    amountCents,
    paymentStatus: 'none',
    paymentIntentId: null,
  };

  return {
    success: true,
    reservation,
    machineStatus: 'reserved',
  };
}

/**
 * Transitions reservation status strictly according to the state machine.
 */
export function transitionReservation(
  currentState: ReservationState,
  action: ReservationAction
): TransitionResult {
  const now = action.now ?? new Date();
  const res = { ...currentState };

  switch (action.type) {
    case 'UNLOCK': {
      if (res.status !== 'held') {
        return {
          success: false,
          reservation: res,
          machineStatus: 'reserved',
          error: `Cannot unlock reservation in status '${res.status}'.`,
        };
      }
      if (now > res.heldUntil) {
        return {
          success: false,
          reservation: { ...res, status: 'expired' },
          machineStatus: 'available',
          error: 'Hold has expired.',
        };
      }
      res.status = 'unlocked';
      res.unlockedAt = now;
      return {
        success: true,
        reservation: res,
        machineStatus: 'reserved',
      };
    }

    case 'START_CYCLE': {
      if (res.status !== 'unlocked') {
        return {
          success: false,
          reservation: res,
          machineStatus: 'reserved',
          error: `Cannot start cycle from status '${res.status}'. Must be unlocked.`,
        };
      }

      if (!action.paymentSuccess) {
        // Machine stays locked, resident is asked to change payment method
        res.paymentStatus = 'failed';
        return {
          success: false,
          reservation: res,
          machineStatus: 'reserved',
          error: 'Payment failed. Please update payment method to start.',
        };
      }

      res.status = 'running';
      res.startedAt = now;
      res.programName = action.programName;
      res.expectedEndAt = new Date(now.getTime() + action.durationMinutes * 60 * 1000);
      res.paymentStatus = 'paid';
      if (action.paymentIntentId) {
        res.paymentIntentId = action.paymentIntentId;
      }

      return {
        success: true,
        reservation: res,
        machineStatus: 'running',
      };
    }

    case 'FINISH_CYCLE': {
      if (res.status !== 'running') {
        return {
          success: false,
          reservation: res,
          machineStatus: 'running',
          error: `Cannot finish cycle from status '${res.status}'.`,
        };
      }
      res.status = 'done';
      res.endedAt = now;
      return {
        success: true,
        reservation: res,
        machineStatus: 'done',
      };
    }

    case 'COLLECT': {
      if (res.status !== 'done') {
        return {
          success: false,
          reservation: res,
          machineStatus: 'done',
          error: `Cannot collect laundry from status '${res.status}'.`,
        };
      }
      res.status = 'collected';
      return {
        success: true,
        reservation: res,
        machineStatus: 'available',
      };
    }

    case 'CANCEL': {
      // Cancellation is free and allowed ONLY while held
      if (res.status !== 'held') {
        return {
          success: false,
          reservation: res,
          machineStatus: res.status === 'running' ? 'running' : 'reserved',
          error: 'Reservations can only be cancelled while held before starting.',
        };
      }
      res.status = 'cancelled';
      return {
        success: true,
        reservation: res,
        machineStatus: 'available',
      };
    }

    case 'EXPIRE': {
      if (res.status !== 'held' && res.status !== 'unlocked') {
        return {
          success: false,
          reservation: res,
          machineStatus: res.status === 'running' ? 'running' : 'reserved',
          error: `Cannot expire reservation in '${res.status}' state.`,
        };
      }
      res.status = 'expired';
      return {
        success: true,
        reservation: res,
        machineStatus: 'available',
      };
    }

    case 'FAULT':
    case 'OFFLINE': {
      if (res.status === 'running') {
        res.status = 'interrupted';
        const shouldRefund = action.autoRefund ?? true;
        let refundTriggered = false;
        if (shouldRefund && res.paymentStatus === 'paid') {
          res.paymentStatus = 'refunded';
          refundTriggered = true;
        }
        return {
          success: true,
          reservation: res,
          machineStatus: 'out_of_order',
          refundTriggered,
        };
      }
      return {
        success: false,
        reservation: res,
        machineStatus: 'out_of_order',
        error: `Machine fault occurred while reservation was in '${res.status}'.`,
      };
    }

    default:
      return {
        success: false,
        reservation: res,
        machineStatus: 'reserved',
        error: 'Unknown action.',
      };
  }
}
