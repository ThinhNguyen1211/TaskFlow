/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'gradient-spin': 'gradient-spin 2.5s linear infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
      },
      keyframes: {
        'gradient-spin': {
          '0%': { '--tw-gradient-angle': '0deg' },
          '100%': { '--tw-gradient-angle': '360deg' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
      },
      fontFamily: {
        'cursive': ['cursive'],
      },
      spacing: {
        'card-height': '75vh',
        'card-width': 'calc(75vh / 1.5)',
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      screens: {
        'xs': '475px',
        '2xs': '320px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents }) {
      addUtilities({
        '.custom-scrollbar': {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
        },
      });
      
      addComponents({
        '.gradient-border': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '-2px',
            padding: '2px',
            background: 'conic-gradient(from 0deg, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234), rgb(134, 239, 172))',
            borderRadius: 'inherit',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
            zIndex: '-1',
          },
        },
        '.gradient-glow': {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '12.5vh',
            left: '0',
            right: '0',
            zIndex: '-1',
            height: '100%',
            width: '100%',
            margin: '0 auto',
            transform: 'scale(0.8)',
            filter: 'blur(12.5vh)',
            background: 'conic-gradient(from 0deg, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234), rgb(134, 239, 172))',
            opacity: '1',
            transition: 'opacity 0.5s',
          },
        },
      });
    },
  ],
}

