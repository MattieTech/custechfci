import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF6F3',
          100: '#F0E8E0',
          200: '#E0CCBA',
          300: '#D4B494',
          400: '#C49A6C',
          500: '#A37B52',
          600: '#7A5A42',
          700: '#6B4D38',
          800: '#4A3526',
          900: '#2D1F15',
          950: '#1A1614',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '22px',
      },
      maxWidth: {
        'container': '1280px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'icon-bounce': 'iconBounce 1.5s ease-in-out infinite',
        'icon-wiggle': 'iconWiggle 1.2s ease-in-out infinite',
        'icon-float': 'iconFloat 3s ease-in-out infinite',
        'icon-pulse-glow': 'iconPulse 2s ease-in-out infinite',
        'icon-bell-ring': 'iconBellRing 2s ease-in-out infinite',
        'icon-sparkle': 'iconSparkle 2.5s ease-in-out infinite',
        'icon-spin-slow': 'iconSpinSlow 8s linear infinite',
        'flaticon-slide': 'flaticonLetterSlide 2.6s ease-in-out infinite',
        'flaticon-page': 'flaticonPageFlip 3s ease-in-out infinite',
        'flaticon-blink': 'flaticonBlink 3.5s ease-in-out infinite',
        'flaticon-radar': 'flaticonRadar 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        iconBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        iconWiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-9deg)' },
          '75%': { transform: 'rotate(9deg)' },
        },
        iconFloat: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-5px) scale(1.03)' },
        },
        iconPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.12)', opacity: '0.85' },
        },
        iconBellRing: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%, 30%': { transform: 'rotate(-14deg)' },
          '20%, 40%': { transform: 'rotate(14deg)' },
          '50%': { transform: 'rotate(0deg)' },
        },
        iconSparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.2) rotate(180deg)' },
        },
        iconSpinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        flaticonLetterSlide: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        flaticonPageFlip: {
          '0%, 100%': { transform: 'scaleX(1)' },
          '50%': { transform: 'scaleX(0.7) skewY(-2deg)' },
        },
        flaticonBlink: {
          '0%, 88%, 100%': { transform: 'scaleY(1)' },
          '93%': { transform: 'scaleY(0.1)' },
        },
        flaticonRadar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
