import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Cafe/',
  server: {
    watch: {
      // Ігноруємо службові папки Visual Studio, щоб не було помилок EBUSY
      ignored: ['**/.vs/**', '**/node_modules/**', '**/dist/**']
    }
  },
  build: {
    // Додаємо це, щоб стабільніше збиралися ресурси
    assetsDir: 'assets',
    sourcemap: false,
  }
})