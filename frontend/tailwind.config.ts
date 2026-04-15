import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#fbef00',
          dark: '#e0d600',
          light: '#fffde6',
          50: '#fffef5',
        },
        cta: {
          DEFAULT: '#1793e7',
          dark: '#1279c4',
          light: '#e8f4fd',
          hover: '#1586d4',
        },
        surface: '#f5f6f8',
        'nav-dark': '#1a1a2e',
        'nav-mid': '#2d2d44',
        'text-primary': '#1a1a2e',
        'text-secondary': '#555770',
        'text-muted': '#8e8ea0',
        star: '#f59e0b',
        success: '#10b981',
        danger: '#ef4444',
        accent: '#7c3aed',
        'border-color': '#e2e4e9',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04)',
        card: '0 4px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.08)',
        nav: '0 1px 3px rgba(0, 0, 0, 0.08)',
        glow: '0 0 20px rgba(23, 147, 231, 0.15)',
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.35s ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
