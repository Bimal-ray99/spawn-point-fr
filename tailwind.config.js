/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
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
      fontSize: {
        // Fluid responsive sizes
        "fluid-xs": "clamp(0.75rem, 1.5vw, 0.875rem)",
        "fluid-sm": "clamp(0.875rem, 2vw, 1rem)",
        "fluid-base": "clamp(1rem, 2.5vw, 1.125rem)",
        "fluid-lg": "clamp(1.125rem, 3vw, 1.5rem)",
        "fluid-xl": "clamp(1.25rem, 3.5vw, 2rem)",
        "fluid-2xl": "clamp(1.5rem, 4vw, 2.5rem)",
        "fluid-3xl": "clamp(2rem, 5vw, 3rem)",
        "fluid-4xl": "clamp(2.5rem, 6vw, 4rem)",
        "fluid-5xl": "clamp(3rem, 8vw, 5rem)",
        "fluid-6xl": "clamp(3.5rem, 10vw, 6rem)",
        "fluid-7xl": "clamp(4rem, 12vw, 8rem)",
        "fluid-8xl": "clamp(5rem, 15vw, 10rem)",
      },
      spacing: {
        "section-xs": "3rem",
        "section-sm": "4rem",
        "section-md": "6rem",
        "section-lg": "8rem",
        "section-xl": "10rem",
      },
      maxWidth: {
        content: "65ch",
        prose: "75ch",
        card: "28rem",
        "card-lg": "32rem",
        "container-sm": "640px",
        "container-md": "768px",
        "container-lg": "1024px",
        "container-xl": "1280px",
        "container-2xl": "1400px",
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
