import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'lab-black': '#050505',
        'lab-dark': '#080808',
        'lab-surface': '#111111',
        'lab-elevated': '#171717',
        'lab-border': '#1f1f1f',
        'lab-text': '#ffffff',
        'lab-text-secondary': '#E5E7EB',
        'lab-text-muted': '#9CA3AF',
        'accent-blue': '#38BDF8',
        'accent-yellow': '#FACC15',
        'accent-red': '#EF4444',
        'accent-orange': '#F97316',
        'accent-green': '#22C55E',
        'accent-purple': '#A855F7',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        ui: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise': "url('/noise.png')",
      },
    },
  },
  plugins: [],
}

export default config
