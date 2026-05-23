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
        primary: '#D2B48C',
        'primary-dark': '#8B4513',
        neutral: '#F5F5DC',
        brand: {
          green: '#0A6C3F',
          'green-dark': '#084d2e',
          gold: '#D4AF37',
          'gold-dark': '#A67C00',
        },
      },
    },
  },
  plugins: [],
};
