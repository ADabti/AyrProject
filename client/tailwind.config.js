//tailWind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Extend the backgroundImage utility
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #cebfaa, #cfbfab, #cdbea9, #e1d7c7, #DCD7C4, #e3d8c7, #e3d8c7, #dbd0be, #d6c8b4, #d6c7b3, #C4B5A2)',
        'custom-gradient-business-profile': 'linear-gradient(135deg, #a7f3d0 25%, #6ee7b7 50%)',

      },
      // You can also extend colors if you plan to reuse these specific colors

    },
  },
  plugins: [],
}

