import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://phonebook-bold-haze-1484.fly.dev/',
        changeOrigin: true,
      },
    }
  },
})
