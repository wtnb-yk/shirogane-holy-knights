module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {
      // Browser support configuration
      overrideBrowserslist: [
        '>= 1%',
        'last 2 versions',
        'not dead',
        'not ie 11',
      ],
      grid: 'autoplace',
    },
  },
}