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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontSize: {
        // Minor Third (1.200) Type Scale (Base 16px)
        '2xs': ['11.11px', { lineHeight: '1.4' }],
        xs: ['11.11px', { lineHeight: '1.4' }],
        small: ['13.33px', { lineHeight: '1.45' }],
        sm: ['13.33px', { lineHeight: '1.45' }],
        p: ['16px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.5' }],
        h6: ['19.2px', { lineHeight: '1.4' }],
        h5: ['23.04px', { lineHeight: '1.35' }],
        h4: ['27.65px', { lineHeight: '1.3' }],
        h3: ['33.18px', { lineHeight: '1.25' }],
        h2: ['39.81px', { lineHeight: '1.2' }],
        h1: ['47.78px', { lineHeight: '1.15' }],
        'scale-xs': ['11.11px', { lineHeight: '1.4' }],
        'scale-small': ['13.33px', { lineHeight: '1.45' }],
        'scale-p': ['16px', { lineHeight: '1.5' }],
        'scale-h6': ['19.2px', { lineHeight: '1.4' }],
        'scale-h5': ['23.04px', { lineHeight: '1.35' }],
        'scale-h4': ['27.65px', { lineHeight: '1.3' }],
        'scale-h3': ['33.18px', { lineHeight: '1.25' }],
        'scale-h2': ['39.81px', { lineHeight: '1.2' }],
        'scale-h1': ['47.78px', { lineHeight: '1.15' }],
      },
    },
  },
  plugins: [],
}

export default config
