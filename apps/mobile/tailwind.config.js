const { colors, spacing } = require('@airport-app/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        congestion: colors.congestion,
        status: colors.status,
      },
    },
  },
  plugins: [],
};
