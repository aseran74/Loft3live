import { fileURLToPath, URL } from 'node:url'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import vitePrerender from 'vite-plugin-prerender'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Rutas públicas a pre-renderizar para SEO (los crawlers reciben HTML ya renderizado)
const prerenderRoutes = ['/', '/inversiones', '/blog']

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    vitePrerender({
      staticDir: join(__dirname, 'dist'),
      routes: prerenderRoutes,
      renderer: new vitePrerender.PuppeteerRenderer({
        headless: true,
        renderAfterDocumentEvent: 'render-event',
        renderAfterTime: 3000,
      }),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
