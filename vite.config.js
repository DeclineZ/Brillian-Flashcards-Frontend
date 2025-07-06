import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api' : 'http://localhost:5000'
    }
  },
  optimizeDeps: {
    exclude: [
      'cose-base',
      'chevrotain',
      '@chevrotain/regexp-to-ast',
      'chevrotain-allstar',
      'd3-delaunay'
    ]
  },
  build: {
    rollupOptions: {
      external: [
        'cose-base',
        'chevrotain',
        '@chevrotain/regexp-to-ast',
        'chevrotain-allstar',
        'd3-delaunay'
      ]
    }
  }
})
