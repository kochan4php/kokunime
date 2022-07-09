/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      padding: 16,
      center: true,
    },
    extend: {
      colors: {
        danger: "#dc2626",
        success: "#16a34a",
        warning: "#eab308",
        primary: "#2563eb",
        dark: "#171717",
        light: "#ffffff",
      },
    },
  },
  plugins: [],
};
