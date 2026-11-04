import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Smartphone, LayoutDashboard, ArrowRight, CheckCircle2, Sparkles, Disc } from 'lucide-react';

export default function GatewayPage() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col justify-between selection:bg-brand-tint">
      {/* Top Header */}
      <header className="px-6 sm:px-12 py-5 border-b border-border-default/80 flex items-center justify-between bg-surface/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-brand-primary flex items-center justify-center text-text-on-brand font-bold text-base shadow">
            W
          </div>
          <div>
            <div className="font-heading font-bold text-lg text-text-primary leading-tight">
              WashEase
            </div>
            <div className="text-xs text-text-secondary">Laundry, on your time.</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <Link
            href="/app"
            className="px-3.5 py-2 rounded-full bg-subtle text-text-secondary hover:text-text-primary transition-colors"
          >
            Resident App
          </Link>
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-full bg-brand-primary text-text-on-brand hover:bg-brand-strong transition-colors shadow"
          >
            Admin Dashboard
          </Link>
        </div>
      </header>

      {/* Main Hero & Split Portal Cards */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 sm:py-16 flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-tint text-brand-primary">
            <Sparkles className="w-3.5 h-3.5" />
            Designed directly from Figma (Pages 06, 07 & 08)
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-text-primary leading-tight">
            Select Your WashEase Experience
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            WashEase provides two separate, dedicated products: the resident mobile app for tenants
            reserving washers and dryers, and the web management dashboard for property managers.
          </p>
        </div>

        {/* Two Dedicated Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Card 1: Resident App */}
          <Link
            href="/app"
            className="group relative p-8 rounded-2xl bg-surface border-2 border-border-default hover:border-brand-primary shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-brand-tint text-brand-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Smartphone className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-tint px-3 py-1 rounded-full">
                  Figma Page 07
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold font-heading text-text-primary group-hover:text-brand-primary transition-colors">
                  Resident App
                </h2>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                  For apartment residents reserving machines on their phones. Features live availability,
                  10-minute walk-down holds, Bluetooth unlock, and real-time cycle progress rings.
                </p>
              </div>

              <div className="space-y-2 text-xs text-text-secondary pt-2 border-t border-border-default/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
                  <span>Reserve free machines now (no time slots)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
                  <span>10-minute hold timer & Bluetooth unlock</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
                  <span>Floating pill tab bar & clean native mobile UI</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-brand-primary group-hover:translate-x-1 transition-transform">
              <span>Open Resident App</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Building Manager Admin Web */}
          <Link
            href="/admin"
            className="group relative p-8 rounded-2xl bg-surface border-2 border-border-default hover:border-brand-primary shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-status-success-tint text-status-success flex items-center justify-center group-hover:scale-105 transition-transform">
                  <LayoutDashboard className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-status-success bg-status-success-tint px-3 py-1 rounded-full">
                  Figma Page 08
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-bold font-heading text-text-primary group-hover:text-brand-primary transition-colors">
                  Admin Dashboard
                </h2>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                  For property and building managers. Monitor 20 machines across Room A & B,
                  review live activity, approve residents, configure building rules and flat prices.
                </p>
              </div>

              <div className="space-y-2 text-xs text-text-secondary pt-2 border-t border-border-default/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
                  <span>Full 1440px desktop building management portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
                  <span>Interactive rules (hold minutes, quiet hours, prices)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success flex-shrink-0" />
                  <span>Residents management, Stripe payouts & live activity</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-brand-primary group-hover:translate-x-1 transition-transform">
              <span>Open Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-border-default/80 text-center text-xs text-text-secondary">
        <div>WashEase · Wilhelmstr. 12, 79098 Freiburg · Built from Figma Design Specs</div>
      </footer>
    </div>
  );
}
