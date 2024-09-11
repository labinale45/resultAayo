/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        medium: "#293245",
        dark: "#232A3C",
      },
      animation: {
        fly: 'fly 40s linear infinite',
        fly1: 'fly1 50s ease-in-out infinite',
        fly2: 'fly2 55s ease-in-out infinite',
        fly3: 'fly3 65s ease-in-out infinite',
      },
      keyframes: {
        fly: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(100vw, 25vh)' },
          '50%': { transform: 'translate(50vw, 75vh)' },
          '75%': { transform: 'translate(25vw, 50vh)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        fly1: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(100vw, 50vh)' },
          '50%': { transform: 'translate(50vw, 100vh)' },
          '75%': { transform: 'translate(25vw, 25vh)' },
        },
        fly2: {
          '0%, 100%': { transform: 'translate(100vw, 0)' },
          '33%': { transform: 'translate(0, 75vh)' },
          '66%': { transform: 'translate(75vw, 25vh)' },
        },
        fly3: {
          '0%, 100%': { transform: 'translate(50vw, 100vh)' },
          '33%': { transform: 'translate(100vw, 50vh)' },
          '66%': { transform: 'translate(0, 0)' },
        },
      }
    },
  },
  plugins: [],
};
