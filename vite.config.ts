import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // server: {
  //   // 配置代理，当路由以 /doctor 或 /admin等 开头时，代理到 http://localhost:8080
  //   proxy: {
  //     '/doctor': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //     },
  //     '/admin': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //     },
  //     '/lab-technician': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //     },
  //   },
  // },
})
