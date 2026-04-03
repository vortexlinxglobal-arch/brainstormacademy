// frontend/tailwind.config.cjs
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      colors: {
        primary: '#D2B48C',
        'primary-dark': '#8B4513',
        neutral: '#F5F5DC',
      },
    },
  },
  plugins: [],
};
