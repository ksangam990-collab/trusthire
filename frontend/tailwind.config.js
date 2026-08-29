/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef2f8',
          100: '#d5e0ef',
          200: '#aac0df',
          300: '#7fa0cf',
          400: '#4d7dbf',
          500: '#2d5fa7',
          600: '#1a3c5e',   // primary brand
          700: '#142f4a',
          800: '#0e2236',
          900: '#071522',
        },
        trust: {
          green:  '#16a34a',   // verified
          amber:  '#d97706',   // unverified / warning
          red:    '#dc2626',   // fraud / danger
          blue:   '#2563eb',   // info
        },
        surface: {
          DEFAULT: '#f8fafc',
          card:    '#ffffff',
          muted:   '#f1f5f9',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.10)',
      },
    },
  },
  plugins: [],
};
