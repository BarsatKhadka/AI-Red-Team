/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': {
          DEFAULT: '#4F46E5', // Indigo-600
          hover: '#4338CA', // Indigo-700
          light: '#EEF2FF', // Indigo-50
        },
        // Secondary Colors
        'success': {
          DEFAULT: '#10B981', // Emerald-500
          hover: '#059669', // Emerald-600
        },
        'warning': '#F59E0B', // Amber-500
        'error': '#EF4444', // Red-500
        // Neutral Colors
        'bg': {
          DEFAULT: '#F9FAFB', // Gray-50
          card: '#FFFFFF', // White
          elevated: '#F3F4F6', // Gray-100
        },
        'border': {
          'light': '#E5E7EB', // Gray-200
          'medium': '#D1D5DB', // Gray-300
        },
        'text': {
          'primary': '#111827', // Gray-900
          'secondary': '#6B7280', // Gray-500
          'tertiary': '#9CA3AF', // Gray-400
        },
        // Avatar Colors
        'avatar': {
          'alice': '#8B5CF6', // Purple-500
          'bob': '#8B5CF6', // Purple-500
          'ai': '#4F46E5', // Indigo-600
        },
        // Message Tag Colors
        'tag': {
          'clarify': {
            'bg': '#DBEAFE', // Blue-100
            'text': '#1E40AF', // Blue-800
          },
          'availability': {
            'bg': '#D1FAE5', // Green-100
            'text': '#065F46', // Green-800
          },
          'progress': {
            'bg': '#FEF3C7', // Amber-100
            'text': '#92400E', // Amber-800
          },
        },
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['13px', { lineHeight: '1.5' }],
        'base': ['14px', { lineHeight: '1.5' }],
        'lg': ['15px', { lineHeight: '1.5' }],
        'xl': ['16px', { lineHeight: '1.5' }],
        '2xl': ['18px', { lineHeight: '1.5' }],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

