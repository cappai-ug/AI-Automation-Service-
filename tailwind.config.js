/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          500: '#2563EB',
          600: '#2563EB',
          700: '#1d47bb',
          900: '#0F172A',
        },
        navy: '#0F172A',
        accent: '#2563EB',
        secondary: '#06B6D4',
        'soft-white': '#F8FAFC',
      },
    },
  },
  plugins: [],
}
