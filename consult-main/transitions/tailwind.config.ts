import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F4E5F",
          light: "#E8F3F5"
        },
        accent: "#B36A2E"
      }
    }
  },
  plugins: []
};

export default config;
