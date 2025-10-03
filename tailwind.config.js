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
          purple: "#a855f7",
          blue: "#3b82f6",
        },
      },
      boxShadow: {
        neon: "0 0 25px rgba(168, 85, 247, 0.8)",
      },
    },
  },
  plugins: [],
};
