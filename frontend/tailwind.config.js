/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'site-tile': "url('/assets/images/studyjuche - background - fullsize.png')"
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
