/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        '1/2': '50%',
      },
      colors: {
        'bg-basic-color': '#DFF7F9',
      },
    },
  },
  plugins: [],
};
