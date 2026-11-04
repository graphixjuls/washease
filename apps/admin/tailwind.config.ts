import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--we-bg-canvas)',
        surface: 'var(--we-bg-surface)',
        subtle: 'var(--we-bg-subtle)',
        'text-primary': 'var(--we-text-primary)',
        'text-secondary': 'var(--we-text-secondary)',
        'text-disabled': 'var(--we-text-disabled)',
        'text-on-brand': 'var(--we-text-on-brand)',
        brand: {
          primary: 'var(--we-brand-primary)',
          strong: 'var(--we-brand-strong)',
          tint: 'var(--we-brand-tint)',
          accent: 'var(--we-brand-accent)',
        },
        border: {
          default: 'var(--we-border-default)',
          strong: 'var(--we-border-strong)',
        },
        status: {
          success: 'var(--we-status-success)',
          'success-tint': 'var(--we-status-success-tint)',
          warning: 'var(--we-status-warning)',
          'warning-text': 'var(--we-status-warning-text)',
          'warning-tint': 'var(--we-status-warning-tint)',
          danger: 'var(--we-status-danger)',
          'danger-tint': 'var(--we-status-danger-tint)',
          info: 'var(--we-status-info)',
        },
      },
      borderRadius: {
        sm: 'var(--we-radius-sm)',
        md: 'var(--we-radius-md)',
        lg: 'var(--we-radius-lg)',
        xl: 'var(--we-radius-xl)',
        full: 'var(--we-radius-full)',
      },
      boxShadow: {
        card: 'var(--we-shadow-card)',
      },
      fontFamily: {
        heading: ['var(--we-font-heading)'],
        body: ['var(--we-font-body)'],
      },
    },
  },
  plugins: [],
};

export default config;

