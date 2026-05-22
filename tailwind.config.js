/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/CurtainToggle.js',
    './components/WordCycler.js',
    './components/HeroSection.js',
    './components/InteractiveHouse.js',
    './context/ThemeContext.js',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        gold:        '#C8961E',
        'gold-lt':   '#E8B84B',
        dark:        '#0F1923',
        'dark-mid':  '#1A2736',
        'dark-card': '#1E2F40',
        'off-white': '#F5F3EF',
        muted:       '#D4CFC8',
        steel:       '#8A9BAA',
      },
      fontFamily: {
        barlow:    ['Barlow', 'sans-serif'],
        condensed: ['Barlow Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
