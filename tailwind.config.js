/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F7F1FF',
          100: '#E7F1FF', 
          200: '#D0E3FF',
          300: '#A5C4F0',
          400: '#7098D1',
          500: '#4B78C5',
          600: '#334EAC',
          700: '#1F3A99',
          800: '#162C7A',
          900: '#031F5C',
        },
        secondary: {
          50: '#F5F7FF',
          100: '#EBF0FE',
          200: '#D7E2FD',
          300: '#B3C8FB',
          400: '#8FAEF9',
          500: '#6B94F7',
          600: '#4A7AF5',
          700: '#3561F3',
          800: '#1E48E0',
          900: '#1537B0',
        },
        accent: {
          50: '#FFF5F5',
          100: '#FFEAEA',
          200: '#FFC6C6',
          300: '#FF9E9E',
          400: '#FF7575',
          500: '#FF4C4C',
          600: '#FF2323',
          700: '#FA0000',
          800: '#D10000',
          900: '#A80000',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};