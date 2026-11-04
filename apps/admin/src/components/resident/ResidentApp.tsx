'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FloatingTabBar, ResidentTab } from './FloatingTabBar';
import { StepRow } from './StepRow';
import { StatusBadge } from '../StatusBadge';
import {
  ArrowLeft,
  Disc,
  Clock,
  Bluetooth,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  RotateCcw,
  Receipt,
  ShieldAlert,
} from 'lucide-react';

export type ScreenState =
  | 'welcome'
  | 'verify'
  | 'home'
  | 'all-machines'
  | 'reserve'
  | 'reserved'
  | 'unlock'
  | 'running'
  | 'done';

interface ActiveCycle {
  machineId: string;
  machineName: string;
  machineType: 'washer' | 'dryer';
  room: string;
  price: string;
  program: string;
  minutesRemaining: number;
  totalMinutes: number;
}

interface ResidentAppProps {
  onSwitchToAdmin?: () => void;
}

export function ResidentApp({ onSwitchToAdmin }: ResidentAppProps) {
  const [screen, setScreen] = useState<ScreenState>('home');
  const [activeTab, setActiveTab] = useState<ResidentTab>('home');
  const [selectedMachine, setSelectedMachine] = useState<{
    id: string;
    name: string;
    type: 'washer' | 'dryer';
    room: string;
    price: string;
  }>({
    id: 'w01',
    name: 'Washer 01',
    type: 'washer',
    room: 'Room A (Ground floor)',
    price: '€3.00',
  });

  // Hold timer countdown (seconds)
  const [holdSecondsLeft, setHoldSecondsLeft] = useState<number>(600); // 10 minutes

  // Active running cycle state
  const [activeCycle, setActiveCycle] = useState<ActiveCycle | null>(null);

  // Filter tabs for All Machines
  const [machineTypeTab, setMachineTypeTab] = useState<'washer' | 'dryer'>('washer');

  // Countdown effect when in 'reserved' state
  useEffect(() => {
    if (screen !== 'reserved') return;
    const interval = setInterval(() => {
      setHoldSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setScreen('home');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [screen]);

  // Running cycle progress tick
  useEffect(() => {
    if (screen !== 'running' || !activeCycle) return;
    const interval = setInterval(() => {
      setActiveCycle((prev) => {
        if (!prev) return null;
        if (prev.minutesRemaining <= 1) {
          clearInterval(interval);
          setScreen('done');
          return { ...prev, minutesRemaining: 0 };
        }
        return { ...prev, minutesRemaining: prev.minutesRemaining - 1 };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [screen, activeCycle]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartReservation = () => {
    setHoldSecondsLeft(600);
    setScreen('reserved');
  };

  const handleUnlockSuccess = () => {
    setActiveCycle({
      machineId: selectedMachine.id,
      machineName: selectedMachine.name,
      machineType: selectedMachine.type,
      room: selectedMachine.room,
      price: selectedMachine.price,
      program: selectedMachine.type === 'washer' ? 'Cotton 60°C' : 'Cupboard Dry',
      minutesRemaining: selectedMachine.type === 'washer' ? 45 : 35,
      totalMinutes: selectedMachine.type === 'washer' ? 45 : 35,
    });
    setScreen('running');
  };

  const handleCollect = () => {
    setActiveCycle(null);
    setScreen('home');
  };

  return (
    <div className="relative min-h-screen bg-canvas text-text-primary flex flex-col items-center">
      {/* Mobile container viewport */}
      <div className="w-full max-w-md min-h-screen bg-canvas flex flex-col relative pb-32">
        {/* Top Native-style Bar */}
        <div className="h-11 px-6 flex items-center justify-between text-xs text-text-secondary select-none">
          <span className="font-semibold text-text-primary">09:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono">5G</span>
            <div className="w-5 h-2.5 rounded-sm border border-text-secondary flex items-center p-0.5">
              <div className="w-full h-full bg-text-primary rounded-2xs" />
            </div>
          </div>
        </div>

        {/* ========================================================
            SCREEN 1: WELCOME
           ======================================================== */}
        {screen === 'welcome' && (
          <div className="flex-1 flex flex-col justify-between p-6 animate-fadeIn">
            <div className="pt-6 text-center space-y-4">
              <div className="relative w-64 h-64 mx-auto rounded-2xl bg-brand-tint p-4 flex items-center justify-center overflow-hidden">
                <Image
                  src="/illustrations/hero.png"
                  alt="WashEase Hero"
                  width={256}
                  height={256}
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-3xl font-extrabold font-heading text-text-primary leading-tight pt-2">
                Laundry, on your time.
              </h1>
              <p className="text-sm text-text-secondary max-w-xs mx-auto leading-relaxed">
                See free washers and dryers, reserve one for 10 minutes, unlock with your phone,
                and choose your program on the machine.
              </p>
            </div>

            <div className="space-y-3 pt-8">
              <button
                onClick={() => setScreen('verify')}
                className="w-full h-14 rounded-md bg-brand-primary text-text-on-brand font-semibold text-base shadow hover:bg-brand-strong transition-colors flex items-center justify-center"
              >
                Get started
              </button>
              <button
                onClick={() => setScreen('home')}
                className="w-full h-14 rounded-md bg-subtle text-text-secondary font-semibold text-base hover:bg-border-default/50 transition-colors flex items-center justify-center"
              >
                I already have an account
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 2: VERIFY BUILDING
           ======================================================== */}
        {screen === 'verify' && (
          <div className="flex-1 flex flex-col justify-between p-6 animate-fadeIn">
            <div>
              <button
                onClick={() => setScreen('welcome')}
                className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="pt-4 space-y-2">
                <h1 className="text-2xl font-bold font-heading text-text-primary">
                  Find your building
                </h1>
                <p className="text-sm text-text-secondary">
                  Enter the 6-digit invite code provided by your building manager.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                    6-digit invite code
                  </label>
                  <input
                    type="text"
                    defaultValue="482913"
                    className="w-full tracking-widest text-center text-3xl font-bold font-mono py-3.5 rounded-md bg-surface border-2 border-brand-primary text-text-primary focus:outline-none"
                    maxLength={6}
                  />
                </div>

                <div className="p-4 rounded-lg bg-surface border border-border-default shadow-sm flex items-start gap-3">
                  <div className="p-2 rounded-md bg-status-success-tint text-status-success flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-status-success uppercase">
                      Building found
                    </div>
                    <div className="text-base font-bold text-text-primary">Wilhelmstr. 12</div>
                    <div className="text-xs text-text-secondary">
                      79098 Freiburg · 20 Miele machines (Room A & B)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setScreen('home')}
              className="w-full h-14 rounded-md bg-brand-primary text-text-on-brand font-semibold text-base shadow hover:bg-brand-strong transition-colors"
            >
              Join building
            </button>
          </div>
        )}

        {/* ========================================================
            SCREEN 3: HOME
           ======================================================== */}
        {screen === 'home' && (
          <div className="flex-1 p-6 space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-text-secondary font-medium">Your building</span>
                <h2 className="text-lg font-bold font-heading text-text-primary flex items-center gap-1.5">
                  Wilhelmstr. 12
                  <span className="text-xs font-normal text-text-secondary">· Freiburg</span>
                </h2>
              </div>
              <button
                onClick={() => setScreen('welcome')}
                className="text-xs font-semibold text-brand-primary bg-brand-tint px-3 py-1.5 rounded-full hover:bg-brand-primary hover:text-white transition-colors"
              >
                Change
              </button>
            </div>

            {/* Availability Banner */}
            <div className="p-5 rounded-xl bg-surface border border-border-default shadow-card flex items-center justify-between gap-4">
              <div>
                <div className="text-xl font-extrabold font-heading text-text-primary leading-tight">
                  10 of 20 machines free now
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  5 washers & 5 dryers ready · No wait time
                </div>
              </div>
              <button
                onClick={() => setScreen('all-machines')}
                className="px-3.5 py-2 rounded-md bg-brand-tint text-brand-primary text-xs font-bold whitespace-nowrap hover:bg-brand-primary hover:text-white transition-colors flex-shrink-0"
              >
                View all
              </button>
            </div>

            {/* Quick Action Cards (Room A & Room B) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-heading text-text-primary">
                  Room A (Ground floor)
                </h3>
                <span className="text-xs text-status-success font-semibold">5 free</span>
              </div>

              {/* Washer 01 Card */}
              <div className="p-4 rounded-xl bg-surface border border-border-default shadow-card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-lg bg-brand-tint flex items-center justify-center p-1.5 flex-shrink-0">
                    <Image
                      src="/illustrations/washer.png"
                      alt="Washer"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary text-base">Washer 01</span>
                      <StatusBadge status="available" />
                    </div>
                    <div className="text-xs text-text-secondary mt-0.5">
                      Miele PWM 507 · 8 kg
                    </div>
                    <div className="text-xs font-semibold text-brand-primary mt-1">
                      €3.00 per wash · charged at start
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedMachine({
                      id: 'w01',
                      name: 'Washer 01',
                      type: 'washer',
                      room: 'Room A (Ground floor)',
                      price: '€3.00',
                    });
                    setScreen('reserve');
                  }}
                  className="px-4 py-2.5 rounded-md bg-brand-primary text-text-on-brand text-xs font-bold hover:bg-brand-strong transition-colors flex-shrink-0 shadow"
                >
                  Reserve
                </button>
              </div>

              {/* Dryer 01 Card */}
              <div className="p-4 rounded-xl bg-surface border border-border-default shadow-card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-lg bg-brand-tint flex items-center justify-center p-1.5 flex-shrink-0">
                    <Image
                      src="/illustrations/dryer.png"
                      alt="Dryer"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary text-base">Dryer 01</span>
                      <StatusBadge status="available" />
                    </div>
                    <div className="text-xs text-text-secondary mt-0.5">
                      Miele PDR 507 · 8 kg
                    </div>
                    <div className="text-xs font-semibold text-brand-primary mt-1">
                      €2.00 per dry · charged at start
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedMachine({
                      id: 'd01',
                      name: 'Dryer 01',
                      type: 'dryer',
                      room: 'Room A (Ground floor)',
                      price: '€2.00',
                    });
                    setScreen('reserve');
                  }}
                  className="px-4 py-2.5 rounded-md bg-brand-primary text-text-on-brand text-xs font-bold hover:bg-brand-strong transition-colors flex-shrink-0 shadow"
                >
                  Reserve
                </button>
              </div>

              {/* Washer 02 (In use example) */}
              <div className="p-4 rounded-xl bg-surface border border-border-default opacity-90 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-lg bg-subtle flex items-center justify-center p-1.5 flex-shrink-0">
                    <Image
                      src="/illustrations/washer.png"
                      alt="Washer in use"
                      width={48}
                      height={48}
                      className="object-contain opacity-75"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary text-base">Washer 02</span>
                      <StatusBadge status="running" labelOverride="In use" />
                    </div>
                    <div className="text-xs text-status-warning-text font-medium mt-0.5">
                      Cotton 60°C · ~25 min left
                    </div>
                    <div className="text-xs text-text-disabled mt-0.5">
                      €3.00 · Finishes at 10:15
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Notification set! We will notify you when Washer 02 is free.')}
                  className="px-3.5 py-2 rounded-md bg-subtle text-text-secondary text-xs font-semibold hover:bg-border-default/50 transition-colors flex-shrink-0"
                >
                  Notify me
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 3b: ALL MACHINES (BY TYPE)
           ======================================================== */}
        {screen === 'all-machines' && (
          <div className="flex-1 p-6 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setScreen('home')}
                className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base font-bold font-heading text-text-primary">
                All Machines
              </h2>
              <div className="w-8" />
            </div>

            {/* Type tabs (Washers / Dryers) */}
            <div className="flex bg-subtle p-1 rounded-lg border border-border-default">
              <button
                onClick={() => setMachineTypeTab('washer')}
                className={`flex-1 py-2.5 rounded-md text-xs font-bold transition-all ${
                  machineTypeTab === 'washer'
                    ? 'bg-surface text-brand-primary shadow-sm'
                    : 'text-text-secondary'
                }`}
              >
                Washers · 5 free
              </button>
              <button
                onClick={() => setMachineTypeTab('dryer')}
                className={`flex-1 py-2.5 rounded-md text-xs font-bold transition-all ${
                  machineTypeTab === 'dryer'
                    ? 'bg-surface text-brand-primary shadow-sm'
                    : 'text-text-secondary'
                }`}
              >
                Dryers · 5 free
              </button>
            </div>

            {/* Free Now Buttons */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                Free now ({machineTypeTab === 'washer' ? '5 washers' : '5 dryers'})
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 3, 5, 6, 8].map((num) => {
                  const mName = `${machineTypeTab === 'washer' ? 'Washer' : 'Dryer'} ${num
                    .toString()
                    .padStart(2, '0')}`;
                  const room = num <= 5 ? 'Room A' : 'Room B';
                  const price = machineTypeTab === 'washer' ? '€3.00' : '€2.00';
                  return (
                    <button
                      key={num}
                      onClick={() => {
                        setSelectedMachine({
                          id: `${machineTypeTab[0]}${num}`,
                          name: mName,
                          type: machineTypeTab,
                          room: `${room} (${num <= 5 ? 'Ground' : 'Basement'})`,
                          price,
                        });
                        setScreen('reserve');
                      }}
                      className="p-3.5 rounded-xl bg-surface border border-border-default shadow-card hover:border-brand-primary transition-all text-left flex flex-col justify-between h-24"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-text-primary">{mName}</span>
                        <span className="w-2 h-2 rounded-full bg-status-success" />
                      </div>
                      <div className="text-xs text-text-secondary">{room}</div>
                      <div className="text-xs font-bold text-brand-primary">{price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In Use List */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3">
                In use (Next frees in ~12 min)
              </div>
              <div className="space-y-2.5">
                {[2, 4, 7].map((num) => {
                  const mName = `${machineTypeTab === 'washer' ? 'Washer' : 'Dryer'} ${num
                    .toString()
                    .padStart(2, '0')}`;
                  const remaining = num * 7;
                  return (
                    <div
                      key={num}
                      className="p-3.5 rounded-xl bg-surface border border-border-default flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-sm text-text-primary">{mName}</div>
                        <div className="text-xs text-status-warning-text font-medium mt-0.5">
                          ~{remaining} min left
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`We will notify you when ${mName} finishes.`)}
                        className="px-3 py-1.5 rounded-md bg-subtle text-text-secondary text-xs font-semibold hover:bg-border-default/50"
                      >
                        Notify me
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 4: RESERVE MACHINE
           ======================================================== */}
        {screen === 'reserve' && (
          <div className="flex-1 flex flex-col justify-between p-6 animate-fadeIn">
            <div className="space-y-6">
              <button
                onClick={() => setScreen('home')}
                className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="text-center space-y-3">
                <div className="relative w-40 h-40 mx-auto rounded-2xl bg-brand-tint p-3 flex items-center justify-center">
                  <Image
                    src={
                      selectedMachine.type === 'washer'
                        ? '/illustrations/washer.png'
                        : '/illustrations/dryer.png'
                    }
                    alt={selectedMachine.name}
                    width={140}
                    height={140}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold font-heading text-text-primary">
                    Reserve {selectedMachine.name}
                  </h1>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {selectedMachine.room} · Miele 8 kg
                  </p>
                </div>
              </div>

              {/* 3 Step Explanation */}
              <div className="bg-surface rounded-xl p-5 border border-border-default shadow-card space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1">
                  How it works (No time slots)
                </div>
                <StepRow
                  number={1}
                  title="10-minute walk-down hold"
                  text="Machine is reserved now while you walk down. No one else can claim it."
                />
                <StepRow
                  number={2}
                  title="Unlock at the machine"
                  text="Tap Unlock in the app via Bluetooth, or enter the 6-digit backup code."
                />
                <StepRow
                  number={3}
                  title="Pick program & duration on the machine"
                  text="Choose temperature and cycle on the machine panel. Flat price is charged when it starts."
                />
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-xl bg-brand-tint/60 border border-brand-primary/20 text-center">
                <div className="text-lg font-bold font-heading text-brand-primary">
                  {selectedMachine.price} per {selectedMachine.type === 'washer' ? 'wash' : 'dry'}
                </div>
                <div className="text-xs text-text-secondary mt-0.5">
                  Charged automatically when the machine starts · Free cancellation while held
                </div>
              </div>
            </div>

            <button
              onClick={handleStartReservation}
              className="w-full h-14 rounded-md bg-brand-primary text-text-on-brand font-semibold text-base shadow hover:bg-brand-strong transition-colors mt-6"
            >
              Reserve {selectedMachine.name}
            </button>
          </div>
        )}

        {/* ========================================================
            SCREEN 5: RESERVED (COUNTDOWN)
           ======================================================== */}
        {screen === 'reserved' && (
          <div className="flex-1 flex flex-col justify-between p-6 animate-fadeIn">
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-status-warning-tint text-status-warning-text">
                  <span className="w-2 h-2 rounded-full bg-status-warning animate-pulse" />
                  Reserved for you
                </span>
                <h1 className="text-2xl font-bold font-heading text-text-primary">
                  {selectedMachine.name} is held
                </h1>
                <p className="text-xs text-text-secondary">
                  {selectedMachine.room} · Walk down to unlock
                </p>
              </div>

              {/* Big Countdown Timer */}
              <div className="p-8 rounded-2xl bg-surface border border-border-default shadow-card text-center space-y-2">
                <div className="text-xs text-text-secondary uppercase tracking-widest font-semibold">
                  Hold expires in
                </div>
                <div className="text-5xl font-extrabold font-mono tracking-tight text-brand-primary">
                  {formatTimer(holdSecondsLeft)}
                </div>
                <div className="text-xs text-text-secondary">
                  Release after 10 min if not unlocked
                </div>
              </div>

              <div className="p-4 rounded-xl bg-canvas border border-border-default text-xs text-text-secondary leading-relaxed">
                💡 <span className="font-semibold text-text-primary">Next step:</span> Bring your
                laundry to {selectedMachine.room}. Tap Unlock when standing in front of the machine.
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setScreen('unlock')}
                className="w-full h-14 rounded-md bg-brand-primary text-text-on-brand font-semibold text-base shadow hover:bg-brand-strong transition-colors flex items-center justify-center gap-2"
              >
                <Bluetooth className="w-5 h-5" />
                I&apos;m at the machine — Unlock
              </button>
              <button
                onClick={() => {
                  setHoldSecondsLeft(600);
                  setScreen('home');
                }}
                className="w-full h-14 rounded-md bg-subtle text-status-danger font-semibold text-sm hover:bg-status-danger-tint transition-colors flex items-center justify-center"
              >
                Cancel reservation
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 6: UNLOCK
           ======================================================== */}
        {screen === 'unlock' && (
          <div className="flex-1 flex flex-col justify-between p-6 animate-fadeIn">
            <div className="space-y-6 pt-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-brand-tint text-brand-primary flex items-center justify-center relative">
                <Bluetooth className="w-10 h-10 animate-bounce" />
                <span className="absolute inset-0 rounded-full border-2 border-brand-primary animate-ping opacity-25" />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold font-heading text-text-primary">
                  Unlocking {selectedMachine.name}
                </h1>
                <p className="text-xs text-text-secondary">
                  Hold your phone near the machine display panel
                </p>
              </div>

              {/* Fallback Code */}
              <div className="p-6 rounded-xl bg-surface border border-border-default shadow-card space-y-2">
                <div className="text-xs text-text-secondary font-semibold uppercase">
                  Bluetooth fallback code
                </div>
                <div className="text-3xl font-bold font-mono tracking-widest text-text-primary">
                  739-204
                </div>
                <div className="text-xs text-text-secondary">
                  Type this code on the machine keypad if Bluetooth doesn&apos;t connect
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleUnlockSuccess}
                className="w-full h-14 rounded-md bg-status-success text-white font-semibold text-base shadow hover:opacity-90 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Simulate: Unlocked & Program Started
              </button>
              <button
                onClick={() => setScreen('reserved')}
                className="w-full h-12 text-xs font-semibold text-text-secondary hover:text-text-primary"
              >
                Back to hold countdown
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 7: RUNNING
           ======================================================== */}
        {screen === 'running' && activeCycle && (
          <div className="flex-1 flex flex-col justify-between p-6 animate-fadeIn">
            <div className="space-y-6 pt-4 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-tint text-brand-primary">
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                Cycle in progress
              </span>

              {/* Progress Ring Simulation */}
              <div className="relative w-56 h-56 mx-auto rounded-full border-8 border-brand-tint flex flex-col items-center justify-center shadow-inner">
                <div className="text-4xl font-extrabold font-heading text-text-primary">
                  {activeCycle.minutesRemaining}
                  <span className="text-lg font-normal text-text-secondary"> min</span>
                </div>
                <div className="text-xs text-text-secondary mt-1">Remaining</div>
                <div className="text-xs font-bold text-brand-primary mt-2">
                  {activeCycle.program}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-border-default shadow-card text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border-default">
                  <span className="text-text-secondary">Machine</span>
                  <span className="font-semibold text-text-primary">{activeCycle.machineName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-default">
                  <span className="text-text-secondary">Selected program</span>
                  <span className="font-semibold text-text-primary">{activeCycle.program}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-default">
                  <span className="text-text-secondary">Amount charged</span>
                  <span className="font-semibold text-status-success">{activeCycle.price} (Paid)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-secondary">Push Notification</span>
                  <span className="font-semibold text-brand-primary">Enabled for finish</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setScreen('done')}
                className="w-full h-14 rounded-md bg-brand-primary text-text-on-brand font-semibold text-base shadow hover:bg-brand-strong transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Simulate: Machine Finished
              </button>
              <button
                onClick={() => alert('Support team notified. If the machine faulted, you will receive an automatic refund.')}
                className="w-full h-12 rounded-md bg-subtle text-status-danger text-xs font-semibold hover:bg-status-danger-tint transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" />
                Report a problem
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            SCREEN 8: DONE
           ======================================================== */}
        {screen === 'done' && (
          <div className="flex-1 flex flex-col justify-between p-6 animate-fadeIn">
            <div className="space-y-6 pt-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-status-success-tint text-status-success flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h1 className="text-2xl font-bold font-heading text-text-primary">
                  Your laundry is ready!
                </h1>
                <p className="text-xs text-text-secondary mt-1">
                  Please collect from {selectedMachine.name} ({selectedMachine.room})
                </p>
              </div>

              {/* Receipt Card */}
              <div className="p-5 rounded-xl bg-surface border border-border-default shadow-card text-left space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-border-default pb-2">
                  <span className="font-bold text-text-primary flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-brand-primary" /> Receipt
                  </span>
                  <span className="text-[11px] text-text-secondary">Today, 10:15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Washer 01 (Cotton 60°C)</span>
                  <span className="font-semibold text-text-primary">€3.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Payment Method</span>
                  <span className="font-semibold text-text-primary">Visa ···· 4242</span>
                </div>
                <div className="flex justify-between border-t border-border-default pt-2 font-bold text-sm">
                  <span>Total Paid</span>
                  <span className="text-brand-primary">€3.00</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCollect}
                className="w-full h-14 rounded-md bg-brand-primary text-text-on-brand font-semibold text-base shadow hover:bg-brand-strong transition-colors"
              >
                I&apos;ve collected it
              </button>
              <button
                onClick={() => {
                  setSelectedMachine({
                    id: 'd01',
                    name: 'Dryer 01',
                    type: 'dryer',
                    room: 'Room A (Ground floor)',
                    price: '€2.00',
                  });
                  setScreen('reserve');
                }}
                className="w-full h-14 rounded-md bg-subtle text-text-primary font-semibold text-base hover:bg-border-default/50 transition-colors"
              >
                Reserve a dryer
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: MY LAUNDRY
           ======================================================== */}
        {activeTab === 'laundry' && screen !== 'running' && screen !== 'reserved' && (
          <div className="flex-1 p-6 space-y-6 animate-fadeIn">
            <h1 className="text-2xl font-bold font-heading text-text-primary">My Laundry</h1>

            {activeCycle ? (
              <div
                onClick={() => setScreen('running')}
                className="p-5 rounded-xl bg-surface border-2 border-brand-primary shadow-card cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-primary uppercase">Active Cycle</span>
                  <span className="text-xs font-semibold text-status-warning-text bg-status-warning-tint px-2 py-0.5 rounded-full">
                    {activeCycle.minutesRemaining} min left
                  </span>
                </div>
                <div className="font-bold text-lg text-text-primary">{activeCycle.machineName}</div>
                <div className="text-xs text-text-secondary">{activeCycle.program} · {activeCycle.room}</div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-surface border border-border-default text-center space-y-4 shadow-card">
                <div className="w-32 h-32 mx-auto rounded-2xl bg-brand-tint flex items-center justify-center p-3">
                  <Image
                    src="/illustrations/empty-state.png"
                    alt="Empty laundry"
                    width={110}
                    height={110}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-base text-text-primary">No active laundry</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Reserve a washer or dryer to see your live progress here.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setScreen('home');
                  }}
                  className="px-5 py-2.5 rounded-md bg-brand-primary text-text-on-brand text-xs font-semibold shadow"
                >
                  Find a free machine
                </button>
              </div>
            )}

            {/* Past Cycles */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Recent receipts
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border-default shadow-sm flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-text-primary">Washer 02 (Room A)</div>
                  <div className="text-text-secondary">Nov 2, 2026 · Cotton 60°C</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-text-primary">€3.00</div>
                  <div className="text-status-success font-medium">Paid</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: PROFILE
           ======================================================== */}
        {activeTab === 'profile' && (
          <div className="flex-1 p-6 space-y-6 animate-fadeIn">
            <h1 className="text-2xl font-bold font-heading text-text-primary">Profile</h1>

            <div className="p-5 rounded-xl bg-surface border border-border-default shadow-card flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-tint text-brand-primary font-bold text-lg flex items-center justify-center flex-shrink-0">
                LM
              </div>
              <div>
                <div className="font-bold text-base text-text-primary">Lukas Meyer</div>
                <div className="text-xs text-text-secondary">Flat 4A · Wilhelmstr. 12</div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-status-success-tint text-status-success">
                  Verified Resident
                </span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-surface border border-border-default shadow-card space-y-3 text-xs">
              <div className="font-bold text-text-primary text-sm mb-1">Building & Room</div>
              <div className="flex justify-between py-1 border-b border-border-default">
                <span className="text-text-secondary">Address</span>
                <span className="font-semibold text-text-primary">Wilhelmstr. 12, 79098 Freiburg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-default">
                <span className="text-text-secondary">Total Available Machines</span>
                <span className="font-semibold text-text-primary">20 (10 Washers, 10 Dryers)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-secondary">Quiet Hours</span>
                <span className="font-semibold text-text-primary">22:00 – 06:00</span>
              </div>
            </div>

            {onSwitchToAdmin && (
              <button
                onClick={onSwitchToAdmin}
                className="w-full p-4 rounded-xl bg-brand-tint text-brand-primary text-xs font-bold hover:bg-brand-primary hover:text-white transition-all text-center border border-brand-primary/20 shadow"
              >
                Switch to Building Manager Admin Web →
              </button>
            )}
          </div>
        )}

        {/* Floating Pill Tab Bar for Resident screens */}
        {screen !== 'welcome' && screen !== 'verify' && (
          <FloatingTabBar
            activeTab={activeTab}
            onSelectTab={(t) => {
              setActiveTab(t);
              if (t === 'home') setScreen('home');
            }}
            hasActiveCycle={!!activeCycle}
          />
        )}
      </div>
    </div>
  );
}
