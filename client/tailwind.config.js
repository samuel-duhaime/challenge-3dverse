const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{js,jsx,ts,tsx}', 'node_modules/daisyui/dist/**/*.js'],
  plugins: [daisyui],
  daisyui: {
    themes: ['winter'],
  },
};
