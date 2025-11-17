/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          100: "rgb(242, 237, 230)",
          200: "rgb(204, 200, 194)",
          250: "rgb(179, 167, 152)",
          300: "rgb(153, 143, 130)",
          350: "rgb(128, 119, 108)",
          400: "rgb(102, 95, 86)",
          450: "rgb(31, 29, 29)",
          500: "rgb(20, 19, 19)",
        },
        background: "#f1f1f1",
        backgroundDark: "#212121",
        primary: "#0057ff",
        secondary: "#ff17d9",
        marquee: "#004d43",
        about: "#cdea68",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        mono: ["DM Mono", "monospace"],
        DurkItalic: ["DurkItalic", "sans-serif"],
        DurkBold: ["DurkBold", "sans-serif"],
        DurkBoldItalic: ["DurkBoldItalic", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "scale-in": "scaleIn 1s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(1.1)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
