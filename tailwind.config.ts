import type { Config } from "tailwindcss";

// Tailwind v4 reads tokens from globals.css via @theme.
// This config exists for content scanning + plugin compatibility.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};

export default config;
