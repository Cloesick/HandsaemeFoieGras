/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./components/**/*.html"
  ],
  theme: {
    extend: {
      // ADD THIS 'colors' OBJECT
      colors: {
        'brand-cream': '#F9F6F2',
        'brand-dark-brown': '#3D2B1F',
        'brand-light-brown': '#4a4238',
        'brand-gold': '#e0c9a6',
        'brand-muted-brown': '#6a554a',
      },
      // You can also extend other things like fonts
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}