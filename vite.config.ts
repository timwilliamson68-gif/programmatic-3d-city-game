import { defineConfig } from 'vite'

export default defineConfig({
  port: 3000,
  server: {
    host: true,
    port: 3000,
  },
  build: {
    target: 'ES2020',
  },
})
