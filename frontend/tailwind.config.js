/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Coklat soft utama
        primary: {
          50: '#fdf7f2',
          100: '#f7e9dd',
          200: '#ebcfb4',
          300: '#dfb58b',
          400: '#d49b62',
          500: '#c98249', // utama (coklat soft hangat)
          600: '#a8663a',
          700: '#864d2d',
          800: '#653620',
          900: '#422215',
        },
        // Aksen krem / beige
        accent: {
          50: '#fdfaf5',
          100: '#f6ecdd',
          200: '#ead5b5',
          300: '#ddbe8f',
          400: '#d1a769',
          500: '#b98c4f',
          600: '#946d3d',
          700: '#71512e',
          800: '#4c361f',
          900: '#2b1e12',
        },
      },
    },
  },
  plugins: [],
}

