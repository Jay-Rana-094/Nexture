/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
   darkMode: 'class',
  theme: {
    extend: {
       fontFamily: {
      pixel: ['"Press Start 2P"', 'cursive'],
    },
      colors: {
        'neon-blue': '#00f0ff',
        'neon-purple': '#d000ff',
      },
      animation: {
        glow: 'pulse 2s infinite ease-in-out',
        fadeInUp: 'fadeInUp 0.5s ease-out both',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
    fadeInUp: {
      '0%': { opacity: 0, transform: 'translateY(20px)' },
      '100%': { opacity: 1, transform: 'translateY(0)' },
    },
  },
    },
  },
  plugins: [],
};
