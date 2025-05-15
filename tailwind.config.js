module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media', // or 'class' for manual toggling
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
        },
        accent: 'var(--accent)',
        success: 'var(--success)',
        info: 'var(--info)',
        warning: 'var(--warning)',
        error: 'var(--error)',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        main: ['var(--font-main)'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 10px 50px -12px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
