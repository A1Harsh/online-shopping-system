import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.CAPACITOR_BUILD === 'true' ? './' : (process.env.GITHUB_PAGES === 'true' ? '/online-shopping-system/' : './'),
})
