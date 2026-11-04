export type MachineType = 'washer' | 'dryer';

export type MachineStatus = 'available' | 'reserved' | 'running' | 'done' | 'out_of_order';

export type ResidentMachineStatus = 'available' | 'in_use' | 'out_of_order';

export type ReservationStatus =
  | 'held'
  | 'unlocked'
  | 'running'
  | 'done'
  | 'collected'
  | 'expired'
  | 'cancelled'
  | 'interrupted';

export type PaymentStatus = 'none' | 'paid' | 'failed' | 'refunded';

export type QueueStatus = 'waiting' | 'offered' | 'claimed' | 'left' | 'expired';

export type UserRole = 'resident' | 'manager' | 'owner' | 'technician';

export type MembershipStatus = 'pending' | 'active' | 'paused';

export interface BuildingSettings {
  hold_minutes: number;
  queue_hold_minutes: number;
  max_active_reservations: number;
  price_washer_cents: number;
  price_dryer_cents: number;
  max_cycle_minutes: number;
  collect_reminder_minutes: number;
  quiet_hours: string; // e.g. "22:00-06:00"
  require_manager_approval: boolean;
  auto_refund_on_fault: boolean;
}

export const DEFAULT_BUILDING_SETTINGS: BuildingSettings = {
  hold_minutes: 10,
  queue_hold_minutes: 5,
  max_active_reservations: 1,
  price_washer_cents: 300,
  price_dryer_cents: 200,
  max_cycle_minutes: 180,
  collect_reminder_minutes: 15,
  quiet_hours: '22:00-06:00',
  require_manager_approval: true,
  auto_refund_on_fault: true,
};

export interface Building {
  id: string;
  name: string;
  address: string;
  city: string;
  invite_code: string;
  settings: BuildingSettings;
  created_at: string;
}

export interface Room {
  id: string;
  building_id: string;
  name: string;
  floor: string;
}

export interface Machine {
  id: string;
  room_id: string;
  name: string;
  type: MachineType;
  model: string;
  capacity_kg: number;
  status: MachineStatus;
  last_signal_at: string | null;
  gateway_id: string | null;
  created_at: string;
}

export interface ResidentProfile {
  id: string;
  building_id: string;
  flat: string;
  full_name: string;
  role: UserRole;
  membership: MembershipStatus;
  created_at: string;
}

export interface Reservation {
  id: string;
  machine_id: string;
  resident_id: string;
  status: ReservationStatus;
  held_until: string;
  unlocked_at: string | null;
  started_at: string | null;
  program_name: string | null;
  expected_end_at: string | null;
  ended_at: string | null;
  amount_cents: number;
  payment_status: PaymentStatus;
  payment_intent_id: string | null;
  created_at: string;
}

export interface QueueEntry {
  id: string;
  building_id: string;
  room_id: string | null;
  machine_type: MachineType;
  resident_id: string;
  status: QueueStatus;
  offered_machine_id: string | null;
  offer_expires_at: string | null;
  created_at: string;
}

export interface MachineEventRecord {
  id: string;
  machine_id: string;
  type: 'unlocked' | 'started' | 'progress' | 'finished' | 'fault' | 'offline' | 'online';
  payload: Record<string, unknown>;
  created_at: string;
}

export interface FaultRecord {
  id: string;
  machine_id: string;
  reported_by: string;
  description: string;
  photo_url: string | null;
  status: 'open' | 'fixed';
  created_at: string;
}

export interface PayoutRecord {
  id: string;
  building_id: string;
  period: string;
  amount_cents: number;
  status: 'pending' | 'processing' | 'paid';
  paid_at: string | null;
}

/**
 * Format integer cents in EUR. E.g. 300 -> "€3.00"
 */
export function formatEuros(cents: number): string {
  const euros = (cents / 100).toFixed(2);
  return `€${euros}`;
}

/**
 * Map machine status to resident visible status
 */
export function toResidentMachineStatus(status: MachineStatus): ResidentMachineStatus {
  if (status === 'available') return 'available';
  if (status === 'out_of_order') return 'out_of_order';
  return 'in_use';
}

