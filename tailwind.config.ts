import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F1133',
          navyLight: '#181B4A',
          navyDark: '#090A21',
          gold: '#B4892F',
          goldDark: '#7A5813',
          goldLight: '#FBF7EE',
          orange: '#F7941D',
          orangeHover: '#E07F0B',
          neutral: '#F7F7FA',
          body: '#303344',
          muted: '#5E6278',
          border: '#E2E4EE',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        corporate: '0 4px 20px -2px rgba(15, 17, 51, 0.06)',
        corporateHover: '0 12px 32px -4px rgba(15, 17, 51, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
