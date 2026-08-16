/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F5F1',
        ink: '#12151A',
        mute: '#5E6670',
        line: '#E4E0D8',
        primary: {
          50: '#FDECEC',
          500: '#C8102E',
          600: '#C8102E',
          700: '#A00D25',
        },
        accent: {
          500: '#A66B3A',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
