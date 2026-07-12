/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: '#FFFFFF',
          bg: '#F8F9FA',
          surface: '#E9ECEF',
          dark: '#212529',
          // Rich, settled variants of logo accents to pop elegantly on white
          green: '#10B981',   // Settled Neon Green
          pink: '#EC4899',    // Settled Pink
          blue: '#06B6D4',    // Settled Electric Blue
          yellow: '#F59E0B'   // Settled Vivid Yellow
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.04)',
        glow: '0 0 15px rgba(16, 185, 129, 0.15)'
      }
    },
  },
  plugins: [],
}
