/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // keep if you use /src
  ],
  theme: { extend: {} },
  plugins: [
    require('tailwindcss'),                     // must be first
    require('tailwindcss-animate'),            // ✓ for shadcn/ui transitions
    require('@tailwindcss/typography'),        // prose styles
    require('@tailwindcss/aspect-ratio'),      // aspect-[16/9], etc.
    require('@tailwindcss/forms')({            // form controls
      strategy: 'class',                       // IMPORTANT with shadcn: avoids global resets
    }),
    plugin(function ({ addVariant, addUtilities }) {
      // example custom bits; keep your custom plugin LAST
      addVariant('hocus', ['&:hover', '&:focus'])
      addUtilities({
        '.content-auto': { contentVisibility: 'auto' },
      })
    }),
  ],
}
