import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Load .env from project root (d:\AI_Projects\resume maker\)
  // instead of the default frontend\ directory
  envDir: '../',
})
