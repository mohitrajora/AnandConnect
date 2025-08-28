/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // Sky/blue variant (used as main color now)
        secondary: "#1E40AF", // A deeper blue for hover & contrast
        accent: "#FBBF24", // Highlight color stays same
      },
    },
  },
  plugins: [],
};
