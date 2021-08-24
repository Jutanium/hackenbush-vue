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
      },
      colors: {
        red: {
          player: "#EF4444",
        },
        blue: {
          player: "#3B82F6"
        },
        green: {
          ground: "#059669"
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
