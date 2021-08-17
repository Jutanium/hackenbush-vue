module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        "sans": ["Lato", "sans-serif"]
      },
      strokeWidth: {
        '3': '3',
        '4': '4',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
