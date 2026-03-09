/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#CDFF00',
        primaryDark: '#B8E600',
        primaryLight: '#E0FF66',
        secondary: '#CDFF00',
        background: '#0A0A0A',
        surface: '#1A1A1A',
        surfaceVariant: '#2A2A2A',
        cardBackground: '#1E1E1E',
        error: '#FF4444',
        success: '#CDFF00',
        warning: '#FFAA00',
        info: '#00AAFF',
        textPrimary: '#FFFFFF',
        textSecondary: '#B0B0B0',
        textTertiary: '#808080',
        border: '#3A3A3A',
        borderLight: '#2A2A2A',
        buttonText: '#0A0A0A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
