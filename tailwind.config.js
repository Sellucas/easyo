/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        slideFromDownAndFade: {
          "0%": {
            opacity: "0",
            transform: "translateY(12px)",
            visibility: "hidden",
          },
          "1%": { visibility: "visible" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-from-down-and-fade-1":
          "slideFromDownAndFade 0.6s ease-in-out 0.1s both",
        "slide-from-down-and-fade-2":
          "slideFromDownAndFade 0.6s ease-in-out 0.2s both",
        "slide-from-down-and-fade-3":
          "slideFromDownAndFade 0.6s ease-in-out 0.3s both",
        "slide-from-down-and-fade-4":
          "slideFromDownAndFade 0.6s ease-in-out 0.4s both",
        "slide-from-down-and-fade-5":
          "slideFromDownAndFade 0.6s ease-in-out 0.5s both",
        "slide-from-down-and-fade-6":
          "slideFromDownAndFade 0.6s ease-in-out 0.6s both",
      },
      fontFamily: {
        play: ["var(--font-play)"],
        geist: ["var(--font-geist-sans)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
