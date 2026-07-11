import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF8',
        paper2: '#F2F1EC',
        ink: '#111111',
        ink2: '#3A3A3A',
        muted: '#6B6B6B',
        line: 'rgba(17,17,17,0.10)',
        line2: 'rgba(17,17,17,0.16)',
        red: {
          DEFAULT: '#E4141C',
          600: '#C90F16',
          50: '#FDECEC',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        wrap: '1440px',
      },
      borderRadius: {
        xl2: '20px',
      },
      boxShadow: {
        card: '0 18px 50px -28px rgba(17,17,17,0.28)',
        soft: '0 8px 30px -18px rgba(17,17,17,0.22)',
      },
      transitionTimingFunction: {
        sanger: 'cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
};
export default config;
