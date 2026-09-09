import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Cafe/',
  build: {
    // Додаємо це, щоб стабільніше збиралися ресурси
    assetsDir: 'assets',
    sourcemap: false,
  }
})