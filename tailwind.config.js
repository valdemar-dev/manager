/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animationDelay: {
        1600: "1600ms",
        1800: "1800ms",
        2000: "2000ms",
      },
      colors: {
        "background-color": "var(--background-color)",
        "text": "var(--text)",
        "primary-text": "var(--primary-text)",
        "primary-100": "var(--primary-100)",
        "primary-200": "var(--primary-200)",
        "primary-300": "var(--primary-300)",
        "primary-400": "var(--primary-400)",
        "primary-500": "var(--primary-500)",
        "primary-600": "var(--primary-600)",
        "secondary-100": "var(--secondary-100)",
        "secondary-200": "var(--secondary-200)",
        "secondary-300": "var(--secondary-300)",
        "secondary-400": "var(--secondary-400)",
        "secondary-500": "var(--secondary-500)",
        "secondary-600": "var(--secondary-600)",
        "accent-100": "var(--accent-100)",
        "accent-200": "var(--accent-200)",
        "accent-300": "var(--accent-300)",
        "accent-400": "var(--accent-400)",
        "accent-500": "var(--accent-500)",
        "accent-600": "var(--accent-600)",
        "warning-100": "var(--warning-100)",
      }
    },
  },
  plugins: [
    require("tailwindcss-animation-delay"),
  ],
}
