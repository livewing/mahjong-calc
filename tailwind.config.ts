import forms from '@tailwindcss/forms';
import type { TailwindConfig } from 'tailwindcss/tailwind-config';

const config: TailwindConfig = {
  darkMode: 'class',
  content: ['./src/**/*.{html,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [forms]
};
module.exports = config;
