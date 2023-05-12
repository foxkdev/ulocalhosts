/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{svelte,html}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
    "./index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'class'
}

