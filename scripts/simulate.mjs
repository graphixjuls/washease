#!/usr/bin/env node

/**
 * WashEase Machine Simulator
 * Simulates BLE unlock, machine start, progress ticks, cycle finish, and occasional faults.
 */

const PROGRAMS = [
  { name: 'Eco 40°C', durationMin: 45 },
  { name: 'Cotton 60°C', durationMin: 60 },
  { name: 'Quick 30', durationMin: 30 },
  { name: 'Delicates 30°C', durationMin: 35 },
  { name: 'Cupboard Dry', durationMin: 40 },
];

console.log('🧺 WashEase Machine Simulator started');
console.log('Listening for gateway events... Press Ctrl+C to stop.');

function simulateCycle(machineName) {
  const prog = PROGRAMS[Math.floor(Math.random() * PROGRAMS.length)];
  console.log(`\n[EVENT: UNLOCKED] ${machineName} unlocked by resident.`);
  console.log(`[EVENT: STARTED] ${machineName} started program "${prog.name}" (${prog.durationMin} min).`);

  let elapsed = 0;
  const interval = setInterval(() => {
    elapsed += 10;
    if (elapsed < prog.durationMin) {
      console.log(`[PROGRESS] ${machineName}: ${elapsed}/${prog.durationMin} min remaining: ${prog.durationMin - elapsed} min`);
    } else {
      clearInterval(interval);
      console.log(`[EVENT: FINISHED] ${machineName} finished cycle. Notification sent to resident.`);
    }
  }, 1000);
}

// Demo run
simulateCycle('Washer 01 (Room A)');

