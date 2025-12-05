import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Proxy API calls to the API dev server (5052) to avoid colliding
        // with the main server process which uses 5050.
        target: 'http://localhost:5052',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') || '/'
      }
    }
  }
})
