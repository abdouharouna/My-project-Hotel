/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lagoon: {
          50: '#EAF3F8',
          100: '#D2E6F0',
          200: '#A6CDE2',
          300: '#79B4D3',
          400: '#4D9BC4',
          500: '#2A7AA8',
          600: '#155F8B',
          700: '#0B4F6C',
          800: '#083E55',
          900: '#052D40',
        },
        sand: {
          50: '#FBF7F0',
          100: '#F4EBD9',
          200: '#E9D8B8',
          300: '#DDC597',
          400: '#D2B276',
          500: '#C7A055',
          600: '#A88444',
          700: '#7E6335',
          800: '#554223',
          900: '#2B2112',
        },
        coral: {
          50: '#FCEEE9',
          100: '#F9DDD2',
          200: '#F4BCA5',
          300: '#EF9B78',
          400: '#E8785A',
          500: '#D85F41',
          600: '#B84C33',
          700: '#913926',
          800: '#6A2B1D',
          900: '#421C12',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(11, 79, 108, 0.18)',
        card: '0 6px 24px -8px rgba(11, 79, 108, 0.22)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
