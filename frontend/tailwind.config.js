/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- ESTO ES LO MÁS IMPORTANTE
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}