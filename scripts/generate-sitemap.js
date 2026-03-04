/**
 * Genera sitemap.xml con las rutas públicas para SEO.
 * Ejecutar antes del build: SITE_URL=https://tudominio.com node scripts/generate-sitemap.js
 * Por defecto usa https://loft2live.com
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const base = process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://loft2live.com'
const baseClean = base.replace(/\/$/, '')

const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/inversiones', changefreq: 'weekly', priority: '0.9' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/signin', changefreq: 'monthly', priority: '0.3' },
  { path: '/signup', changefreq: 'monthly', priority: '0.3' },
]

const now = new Date().toISOString().slice(0, 10)

const urls = routes
  .map(
    (r) => `  <url>
    <loc>${baseClean}${r.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const outPath = join(__dirname, '..', 'public', 'sitemap.xml')
writeFileSync(outPath, sitemap, 'utf8')
console.log('[sitemap] Generado:', outPath, 'base:', baseClean)
