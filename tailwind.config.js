/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/forms')]
};
