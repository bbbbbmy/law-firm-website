import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Professional law firm color scheme: Navy + Gold
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0a1929',
        },
        gold: {
          50: '#fefbf3',
          100: '#fdf5e1',
          200: '#fbe9c3',
          300: '#f8d89a',
          400: '#f4c065',
          500: '#d4a84b',
          600: '#b8860b',
          700: '#996515',
          800: '#7d521c',
          900: '#694519',
          950: '#3d250c',
        },
        // Keep primary for compatibility
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'Microsoft YaHei', '微软雅黑', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#374151',
            a: {
              color: '#0c4a6e',
              '&:hover': {
                color: '#0369a1',
              },
            },
            h1: {
              color: '#102a43',
              fontWeight: '700',
            },
            h2: {
              color: '#102a43',
              fontWeight: '600',
            },
            h3: {
              color: '#243b53',
              fontWeight: '600',
            },
          },
        },
      },
    },
  },
  plugins: [],
}

export default config