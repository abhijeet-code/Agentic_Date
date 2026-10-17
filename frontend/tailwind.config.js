/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0b0b0f",
          card: "#14141c",
          border: "#252538",
          gold: "#f5c542",
          crimson: "#ff3366",
          accent: "#7928ca",
        },
      },
    },
  },
  plugins: [],
};
