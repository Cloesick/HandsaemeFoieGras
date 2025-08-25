/** @type {import('tailwindcss').Config} */
module.exports = {
  // This 'content' array is now specifically tailored to your folder structure.
  content: [
      './index.html',
    './components/**/*.html', // Scans all HTML files in the components folder
    './src/**/*.js',          // Scans all JS files in the src folder
  ],

  theme: {
    extend: {
      // Your vibrant and earthy color palette
      colors: {
        'parchment': '#FDFBF5',
        'vibrant-orange': '#FF7D00',
        'forest-green': '#28502E',
        'coffee-brown': '#432818',
        'earthy-olive': '#A6A15E',
        'lime-green': '#85CB33',
      },
      // Your chosen artisanal font pairing
      fontFamily: {
        'sans': ['Lato', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      }
    },
  },

  plugins: [],
}