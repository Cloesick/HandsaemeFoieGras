/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"], // Scans all HTML and JS files in the public folder
  theme: {
    extend: {
      colors: {
        'brand-cream': '#F9F6F2',
        'brand-dark-brown': '#3D2B1F',
        'brand-muted-brown': '#6A554A',
        'brand-gold': '#B8860B',
      },
      fontFamily: {
        'sans': ['Lato', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}