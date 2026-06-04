// frontend/tailwind.config.cjs
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d4a873',
        'primary-dark': '#a67c42',
        neutral: '#f5f3f0',
        brand: {
          green: '#1a6b53',
          'green-dark': '#0d4a3a',
          gold: '#d4a873',
          'gold-dark': '#a67c42',
        },
      },
    },
  },
  plugins: [],
};
