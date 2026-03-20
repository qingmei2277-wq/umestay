import type { Config } from "tailwindcss";

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0096a0",
          50: "#e6f7f8",
          100: "#cceff1",
          200: "#99dfe3",
          300: "#66cfd5",
          400: "#33bfc7",
          500: "#0096a0",
          600: "#007880",
          700: "#005a60",
          800: "#003c40",
          900: "#001e20",
        },
        accent: {
          DEFAULT: "#f5a623",
          50: "#fef8ec",
          100: "#fdf1d9",
          200: "#fbe3b3",
          300: "#f9d58d",
          400: "#f7c767",
          500: "#f5a623",
          600: "#c4851c",
          700: "#936415",
          800: "#62420e",
          900: "#312107",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        card:  "0 2px 12px rgba(0,0,0,0.08)",
        hover: "0 6px 24px rgba(0,0,0,0.14)",
        modal: "0 20px 60px rgba(0,0,0,0.20)",
      },
    },
  },
  plugins: [],
};

export default config;
