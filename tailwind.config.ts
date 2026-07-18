import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F1ECE1',
        bgDeep: '#E6DCC5',
        surface: '#FBF8F2',
        surfaceAlt: '#F3EDE0',
        border: '#DFD2B4',
        ink: '#2B2419',
        muted: '#71675A',
        accent: '#82652F',
        onAccent: '#FBF6EA',
        alert: '#AD5F49',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
