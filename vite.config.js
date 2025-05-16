import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        blocked: resolve(__dirname, 'blocked.html'),
      },
    },
    outdir: 'dist',
    emptyOutDir: true
  }
})
