/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

const colors = {
  primary: {
    50: "#f6f5fd",
    100: "#efedfa",
    200: "#e1ddf7",
    300: "#cbc1f1",
    400: "#b19ee7",
    500: "#9676dc",
    600: "#7f50cc",
    700: "#7546bb",
    800: "#623a9d",
    900: "#513181",
    950: "#331e57",
  },
  secondary: {
    50: "#f6f6f6",
    100: "#e7e7e7",
    200: "#d1d1d1",
    300: "#b0b0b0",
    400: "#888888",
    500: "#6d6d6d",
    600: "#5c5c5c",
    700: "#4f4f4f",
    800: "#454545",
    900: "#3d3d3d",
    950: "#262626",
  },
  danger: {
    50: "#fef2f2",
    100: "#fde3e3",
    200: "#fccccc",
    300: "#f8a9a9",
    400: "#f27777",
    500: "#e84b4b",
    600: "#d42e2e",
    700: "#b52323",
    800: "#942020",
    900: "#7b2121",
    950: "#430c0c",
  },
  warning: {
    50: "#fafcea",
    100: "#f1f8c9",
    200: "#e7f296",
    300: "#deea5a",
    400: "#dae22d",
    500: "#d6d620",
    600: "#b5a919",
    700: "#917d17",
    800: "#79631a",
    900: "#67521c",
    950: "#3c2d0c",
  },
  info: {
    50: "#eefdfd",
    100: "#d5f7f8",
    200: "#b0edf1",
    300: "#79dfe7",
    400: "#3bc8d5",
    500: "#23bfd0",
    600: "#1d8a9d",
    700: "#1e7080",
    800: "#215b69",
    900: "#1f4d5a",
    950: "#0f323d",
  },
  success: {
    50: "#f3f9ec",
    100: "#e4f2d5",
    200: "#c9e7af",
    300: "#a7d680",
    400: "#87c358",
    500: "#6cac3c",
    600: "#50852b",
    700: "#3f6625",
    800: "#355222",
    900: "#2e4621",
    950: "#16260d",
  },
  dark: "#1f232f",
  light: "#f5f6f7",
};

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  safelist: [
    { pattern: /grid-cols-\d+/ }, // Permite qualquer classe grid-cols-{N}
  ],
  theme: {
    extend: {
      colors: { ...colors },

      animation: {
        "fade-in": "fadeIn 0.5s ease-in forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "fade-slide-in-left":
          "fadeSlideInLeft 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards",
        "fade-slide-in-top":
          "fadeSlideInTop 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },

        slideInLeft: {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },

        fadeSlideInLeft: {
          "0%": {
            transform: "translateX(-80px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },

        fadeSlideInTop: {
          "0%": {
            transform: "translateY(-80px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({});
    }),
  ],
};
