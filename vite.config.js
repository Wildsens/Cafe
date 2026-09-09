import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // <-- Додаємо це, щоб з'явився доступ по локальній мережі
    watch: {
      // Це залишаємо для ігнорування файлів Visual Studio
      ignored: ['**/.vs/**']
    }
  }
})