/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        whatsapp: {
          primary: '#00a884',
          secondary: '#008069',
          teal: '#00a884',
          bg: '#111b21',
          'bg-light': '#f0f2f5',
          panel: '#202c33',
          'panel-light': '#ffffff',
          'panel-header': '#202c33',
          'panel-header-light': '#f0f2f5',
          'message-in': '#202c33',
          'message-in-light': '#ffffff',
          'message-out': '#005c4b',
          'message-out-light': '#d9fdd3',
          border: '#2a3942',
          'border-light': '#e9edef',
          'text-primary': '#e9edef',
          'text-primary-light': '#111b21',
          'text-secondary': '#8696a0',
          'text-secondary-light': '#667781',
          icon: '#aebac1',
          'icon-light': '#54656f',
          hover: '#2a3942',
          'hover-light': '#f5f6f6'
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Helvetica Neue', 'Helvetica', 'Lucida Grande', 'Arial', 'Ubuntu', 'Cantarell', 'Fira Sans', 'sans-serif']
      },
      boxShadow: {
        'whatsapp': '0 1px 3px rgba(11,20,26,.4)',
        'whatsapp-lg': '0 2px 5px rgba(11,20,26,.26)'
      }
    },
  },
  plugins: [],
}
