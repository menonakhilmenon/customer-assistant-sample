/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      maxWidth: {
        '128': '32rem',
      },
      width: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}

