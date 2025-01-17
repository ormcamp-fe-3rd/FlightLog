import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)"],
      },
      fontSize: {
        xl: "1.125rem", // 18px
        "2xl": "1.625rem", // 26px
        "3xl": "1.875rem", // 30px
      },
      screens: {
        lg: { max: "1024px" },
        md: { max: "744px" },
        sm: { max: "375px" },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["lofi"],
    base: false,
  },
} satisfies Config;
