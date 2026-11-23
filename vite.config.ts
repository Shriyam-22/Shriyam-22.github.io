import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths relative, so the build works on GitHub Pages,
// Netlify, Vercel or any sub-folder without changes.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // React + GSAP + Framer Motion ship in one ~180 kB (gzip) bundle; that's expected here.
    chunkSizeWarningLimit: 600,
  },
})
