/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neo-Brutalist Command Center Core Palette
        canvas: '#F7F3EB',
        panel: '#FFFFFF',
        'panel-warm': '#FFF9F0',
        'primary-blue': '#315FE8',
        'primary-blue-hover': '#244BC2',
        ink: '#171717',
        'surface-grey': '#F0EEEE',
        'alert-orange': '#FF5638',
        'alert-orange-dark': '#D9381E',
        'warning-yellow': '#FFD983',
        'warning-yellow-dark': '#E5B842',
        'muted-blue': '#DCE5FF',
        'muted-blue-dark': '#B8CBFF',
        'success-green': '#15803D',
        'success-green-bg': '#E6F4EA',

        // Secondary / accent tokens
        border: '#171717',
        subtle: '#6E6E6E',
        disabled: '#A3A3A3'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px #171717',
        'brutal': '3px 3px 0px #171717',
        'brutal-md': '4px 4px 0px #171717',
        'brutal-lg': '6px 6px 0px #171717',
        'brutal-active': '1px 1px 0px #171717',
        'brutal-blue': '3px 3px 0px #315FE8',
        'brutal-orange': '3px 3px 0px #FF5638',
        'brutal-yellow': '3px 3px 0px #FFD983'
      },
      borderWidth: {
        '1.5': '1.5px',
        '3': '3px'
      }
    }
  },
  plugins: []
};
