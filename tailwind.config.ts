/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: " #f9fafb",
        primary: " #10b981",
        text: "#111827",
        secondary: "#6b7280",
        accent: "#3b82f6",
        darkBackground: "#111827",
        darkBackground200: "#1f2937",
        darkText: "#f9fafb",
          darkSecondary: '#444',
          darkPrimary: '#81C784',
          dmuaccent: '#9c0a31',
      },
    },
  },
  extend: {
    keyframes: {
      typing: {
        "0%": {
          width: "0%",
          visibility: "hidden"
        },
        "100%": {
          width: "100%"
        }
      },
      blink: {
        "50%": {
          borderColor: "transparent"
        },
        "100%": {
          borderColor: "white"
        }
      }
    },
    animation: {
      typing: "typing 2s steps(20) infinite alternate, blink .7s infinite"
    }
  },
  plugins: [],
};
