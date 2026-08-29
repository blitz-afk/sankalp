/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          '"Plus Jakarta Sans"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },

      colors: {
        ink: {
          50: "#f6f8f7",
          100: "#ecefed",
          200: "#d4dad7",
          300: "#aab3ae",
          400: "#7a847f",
          500: "#56615c",
          600: "#3f4a45",
          700: "#2f3833",
          800: "#1f2622",
          900: "#141815",
        },

        brand: {
          50: "#eefaf2",
          100: "#d6f2de",
          200: "#aee4c0",
          300: "#7bcf99",
          400: "#48b473",
          500: "#229a57",
          600: "#157d47",
          700: "#116439",
          800: "#0f4e30",
          900: "#0c3d25",
        },

        accent: {
          50: "#eef6ff",
          100: "#d9ecff",
          200: "#bcdcff",
          300: "#8ec5ff",
          400: "#59a4ff",
          500: "#3484f5",
          600: "#1f6ae0",
          700: "#1a55b4",
          800: "#1a4a91",
          900: "#1a4076",
        },
      },

      boxShadow: {
        card:
          "0 1px 2px rgba(20,24,21,.04), 0 8px 24px -12px rgba(20,24,21,.10)",
        lift:
          "0 2px 4px rgba(20,24,21,.06), 0 18px 40px -16px rgba(20,24,21,.18)",
      },
    },
  },
  plugins: [],
};