/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E293B',
        accent: '#6366F1',
        bgLight: '#F8FAFC',
        bgDark: '#0F172A',
        textMain: '#1E293B',
        textLight: '#E2E8F0',
      },
    },
  },
  plugins: [],
}
