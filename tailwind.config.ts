import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#f7f4ef",
        charcoal: "#161513",
        espresso: "#2a2621",
        beige: "#e8ddce",
        gold: "#c6a15b",
        "gold-light": "#e4c98a",
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
