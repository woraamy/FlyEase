import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
      // colors: {
      //   background: "var(--background)",
      //   foreground: "var(--foreground)",
      // },
      // Base color
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      
      brand: {
        primary: "#36A1A8",  // Teal 
        secondary: "#F4F9FA", // Light background
        accent: "#E6F4F5",   // Very light teal
        text: "#1A2B3C",     // Dark text color
      },
    },
    animation: {
      "fade-up": "fadeUp 0.5s ease-out forwards",
      "slide-in": "slideIn 0.3s ease-out forwards",
    },
    keyframes: {
      fadeUp: {
        "0%": { opacity: "0", transform: "translateY(20px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
      slideIn: {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(0)" },
      },
    },
  },
  plugins: [],
} satisfies Config;
