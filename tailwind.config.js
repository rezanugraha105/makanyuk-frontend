/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#c599b6",
        "primary-text": "#fff7f3",
        "primary-hover": "#e6b2ba",
        "primary-shadow": "#fad0c4",
        secondary: "#c7d9dd",
        "secondary-text": "#eef1da",
      },
    },
  },
};