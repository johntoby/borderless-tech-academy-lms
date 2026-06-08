import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0F1E',
        foreground: '#F1F5F9',
        surface: '#111827',
        'surface-2': '#1E293B',
        card: '#111827',
        primary: '#0EA5E9',
        'primary-bright': '#00D4FF',
        amber: '#F59E0B',
        border: '#1E3A5F',
        'border-bright': '#2D5680',
        muted: '#94A3B8',
      },
      fontFamily: {
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-mono)', 'monospace'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.3), 0 1px 2px -1px rgba(0,0,0,0.3)',
        'card-md': '0 4px 6px -1px rgba(0,0,0,0.35), 0 2px 4px -2px rgba(0,0,0,0.3)',
        'card-lg': '0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -4px rgba(0,0,0,0.35)',
        'glow-cyan': '0 0 0 1px rgba(14,165,233,0.4), 0 0 24px rgba(14,165,233,0.25)',
        'glow-cyan-lg': '0 0 0 1px rgba(14,165,233,0.5), 0 0 40px rgba(14,165,233,0.35)',
        'glow-amber': '0 0 24px rgba(245,158,11,0.18)',
      },
    },
  },
  plugins: [],
}
export default config
