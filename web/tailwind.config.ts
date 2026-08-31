import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        paper: "#FFFFFF",
        tech: "#111111",
        hairline: "rgb(var(--hairline) / <alpha-value>)",

        border: "rgb(var(--hairline) / 0.14)",
        input: "rgb(var(--hairline) / 0.14)",
        ring: "#FFFFFF",
        background: "#000000",
        foreground: "#FFFFFF",
        primary: { DEFAULT: "#FFFFFF", foreground: "#000000" },
        secondary: { DEFAULT: "#111111", foreground: "#FFFFFF" },
        muted: { DEFAULT: "#111111", foreground: "rgb(255 255 255 / 0.56)" },
        accent: { DEFAULT: "#111111", foreground: "#FFFFFF" },
        destructive: { DEFAULT: "#111111", foreground: "#FFFFFF" },
        card: { DEFAULT: "#111111", foreground: "#FFFFFF" },
        popover: { DEFAULT: "#111111", foreground: "#FFFFFF" },
      },
      borderRadius: {
        // Brutalism: no soft corners anywhere.
        lg: "0px",
        md: "0px",
        sm: "0px",
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      maxWidth: {
        shell: "1280px",
      },
      keyframes: {
        "beam-pulse": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.85" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "beam-pulse": "beam-pulse 4s ease-in-out infinite",
        scan: "scan 6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
