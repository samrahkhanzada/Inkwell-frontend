/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        ink: {
          50: "#f7f7f7",
          100: "#efefef",
          200: "#d9d9d9",
          300: "#b3b3b3",
          400: "#909090",
          500: "#737373",
          700: "#404040",
          900: "#0d0d0d",
        },
        accent: {
          DEFAULT: "#e85d04",
          light: "#f48c06",
          dark: "#c44d00",
        },
        sage: {
          DEFAULT: "#6b9e78",
          light: "#a8c5b0",
          dark: "#4a7a56",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
