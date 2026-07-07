/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './src/scripts/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#E67E22',
        secondary: '#8B4513',
        accent: '#D35400',
        'bg-light': '#FDF6E3',
        'bg-cream': '#FAF0E6',
        'text-dark': '#2C3E50',
        'text-light': '#7F8C8D',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        card: '0 5px 15px rgba(139, 69, 19, 0.1)',
        'card-hover': '0 10px 30px rgba(139, 69, 19, 0.2)',
        popup: '0 5px 20px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        pill: '30px',
      },
    },
  },
  plugins: [],
};
