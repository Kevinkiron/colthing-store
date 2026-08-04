import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#f7f3ec",
        cream: "#efe8db",
        charcoal: "#1c1815",
        espresso: "#2b2118",
        sage: "#8f9b7d",
        rose: "#c99a95",
        gold: "#b08d4f",
        "gold-light": "#d9bc84",
      },
      fontFamily: {
        serif: ["var(--font-playfair)"],
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};

export default config;
