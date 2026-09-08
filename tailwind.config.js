/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        critical: '#DC3B33',
        warning: '#D98C1F',
        normal: '#1E9E63',
        info: '#2F6FBF',
        ink: '#12181F',
        sub: '#6B7684',
        line: '#EBEEF1',
        'dark-bg': '#10151D',
        'dark-card': '#171E29'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        numeral: ['Manrope', 'sans-serif']
      }
    },
  },
  plugins: [],
}
