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
          white: 'var(--brand-white)',
          bg: 'var(--brand-bg)',
          surface: 'var(--brand-surface)',
          dark: 'var(--brand-dark)',
          green: 'var(--brand-green)',
          pink: 'var(--brand-pink)',
          blue: 'var(--brand-blue)',
          yellow: 'var(--brand-yellow)'
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
