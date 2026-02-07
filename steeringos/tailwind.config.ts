import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7ff",
          100: "#d7e6ff",
          200: "#a9c8ff",
          300: "#7aa9ff",
          400: "#4b8aff",
          500: "#256bff",
          600: "#1d54cc",
          700: "#153d99",
          800: "#0d2766",
          900: "#051033"
        }
      }
    }
  },
  plugins: []
};

export default config;
