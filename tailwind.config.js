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
      }
    },
    colors: {
      'text': '#050505',
      'background': '#fafafa',
      'background-darker': '#cacaca',
      'primary': '#d2ccc4',
      'primary-darker': '#c2bcb4',
      'secondary': '#E3E5E8',
      'secondary-darker': '#D3D5D8',
      'accent': '#151821',
      'accent-lighter': "#252831",
    }
  },
  plugins: [
    require("tailwindcss-animation-delay"),
  ],
  darkMode: "class",
}
