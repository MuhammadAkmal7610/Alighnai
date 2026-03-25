import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#05142B",
        "deep-blue": "#0A1F44",
        "mid-blue": "#0D2A5E",
        cyan: "#00F0FF",
        slate: "#94A3B8",
        "light-slate": "#CBD5E1",
        "off-white": "#F8FAFC",
        white: "#FFFFFF",
      },
      fontFamily: {
        heading: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
        prose: "680px",
      },
      letterSpacing: {
        heading: "-0.03em",
      },
      lineHeight: {
        body: "1.65",
      },
      borderRadius: {
        btn: "4px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
