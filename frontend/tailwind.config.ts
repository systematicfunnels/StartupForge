import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './types/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        brand:         '#00D4FF',
        'brand-purple':'#A78BFA',
        'brand-green': '#34D399',
        'brand-amber': '#F59E0B',
        base:          '#080B14',
        surface:       '#0F1624',
        elevated:      '#131929',
      },
      fontFamily: {
        mono:    ['"JetBrains Mono"', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
