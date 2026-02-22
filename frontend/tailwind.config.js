/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // StarCraft Style Colors
        primary: {
          DEFAULT: '#00D4FF',
          dark: '#0088AA',
        },
        secondary: '#FF6B35',
        success: '#00C853',
        warning: '#FFD600',
        error: '#FF1744',
        info: '#2979FF',
        // Background colors
        'bg-primary': '#0A0E17',
        'bg-secondary': '#141B2D',
        'bg-tertiary': '#1E2746',
        'bg-hover': '#2A3655',
        // Text colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#8B9DC3',
        'text-muted': '#5A6A8A',
        // Border
        'border-color': '#2A3655',
      },
      fontFamily: {
        heading: ['Inter', 'SF Pro Display', 'sans-serif'],
        body: ['Inter', 'SF Pro Text', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
