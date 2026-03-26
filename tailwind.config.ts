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
        navy: "var(--color-navy, #0C1E39)",
        "deep-blue": "var(--color-deep-blue, #274185)",
        "mid-blue": "var(--color-mid-blue, #407BB7)",
        cyan: "var(--color-cyan, #63BCE7)",
        slate: "var(--color-slate, #84899A)",
        "light-slate": "var(--color-light-slate, #C8CDD8)",
        "off-white": "var(--color-off-white, #F4F6F9)",
        "footer-bg": "var(--color-footer-bg, #08162e)",
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
  plugins: [],
};

export default config;
