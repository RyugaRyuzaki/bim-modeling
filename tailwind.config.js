/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss-animate";
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        white: "#F2F2F2",
        black: "#0D0D0D",
        halfBlack: "#2a2a2a",
        error: "#FF5252",
        warning: "#FB8C00",
        success: "#4CAF50",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderWidth: {
        1: "1px",
      },
      fontSize: {
        xs: ["12px", {lineHeight: "1rem"}],
        sm: ["14px", {lineHeight: "1.25rem"}],
        base: ["16px", {lineHeight: "1.5rem"}],
        lg: ["18px", {lineHeight: "1.75rem"}],
        xl: ["20px", {lineHeight: "1.75rem"}],
        "2xl": ["22px", {lineHeight: "2rem"}],
        "3xl": ["24px", {lineHeight: "2.25rem"}],
        "4xl": ["26px", {lineHeight: "2.5rem"}],
        "5xl": ["28px", {lineHeight: "1"}],
        "6xl": ["30px", {lineHeight: "1"}],
        "7xl": ["32px", {lineHeight: "1"}],
        "8xl": ["34px", {lineHeight: "1"}],
        "9xl": ["36px", {lineHeight: "1"}],
      },
      zIndex: {
        2: "2",
        3: "3",
        100: "100",
        200: "200",
        1000: "1000",
        2000: "2000",
        3000: "3000",
        4000: "4000",
        5000: "5000",
        6000: "6000",
        7000: "7000",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {height: "0"},
          to: {height: "var(--radix-accordion-content-height)"},
        },
        "accordion-up": {
          from: {height: "var(--radix-accordion-content-height)"},
          to: {height: "0"},
        },
      },
      animationDelay: {
        275: "275ms",
        5000: "5s",
      },
      animationDuration: {
        2000: "2s",
        long: "10s",
        "very-long": "20s",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [plugin],
};
