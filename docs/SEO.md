# Guía SEO – Loft2Live

Recomendaciones y cambios aplicados para mejorar el posicionamiento y la accesibilidad.

## 1. Metadatos

### index.html (global)
- **`lang="es"`** en `<html>` para idioma.
- **`meta name="description"`**: descripción por defecto de la web.
- **`meta name="keywords"`**: palabras clave (apartamento, inversión, Flex Use, etc.).
- **`meta name="author"`** y **`meta name="robots"`** (index, follow).
- **`link rel="canonical"`**: se actualiza por ruta en el router.
- **Open Graph** (`og:title`, `og:description`, `og:image`, `og:locale`) para redes sociales.
- **Twitter Card** (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
- **`theme-color`** para la barra del navegador.

### Por ruta (router)
Cada ruta puede definir en `meta`:
- **`title`**: título de la pestaña (y si no hay descripción, se usa la global).
- **`description`**: descripción específica de la página.

El `beforeEach` del router actualiza `document.title`, la meta `description` y la URL canónica en cada navegación.

## 2. Títulos (H1)

- **Landing (inicio)**: el hero usa un único **H1** visible: “Donde el espacio trabaja para ti” (antes era `<p>`).
- **Listado de proyectos** (`/inversiones`): H1 = “Proyectos de inversión”.
- **Detalle de proyecto** (`/inversiones/:id`): H1 = nombre del proyecto.
- **Blog** (`/blog`): H1 = “Blog”.
- **Login** (`/signin`): mantener un único H1 por vista (p. ej. “Iniciar sesión” o el título del formulario).

Cada página pública debería tener **un solo H1** por vista; el resto de títulos en **H2/H3**.

## 3. Imágenes: alt y nombres de archivo

### Alt ya mejorados
- **Landing**: logo “Loft2Live - Inversión y alquiler flexible en apartamentos”; hero con texto descriptivo; frames decorativos con `role="presentation"` y `alt=""`.
- **ProyectoCard**: “Proyecto [nombre] - Imagen de portada”.
- **DetalleProyecto**: descripciones con nombre del proyecto (oficina antes/después, instalaciones, etc.).
- **FormProyecto**: “Oficina antes de reforma”, “Apartamento después de reforma”, “Foto apartamento”, “Instalaciones comunes” + índice.
- **Blog**: `alt` = título del post.

### Renombrar archivos (aplicado)

Se han renombrado los archivos principales y actualizado todas las referencias en el código:

| Antes | Después | Uso |
|-------|---------|-----|
| `logo3.png` | `loft2live-logo.png` | Favicon / og:image |
| `Logodefi.png` | `loft2live-logo-color.png` | Header (navbar con scroll), sidebars |
| `Logoblanco3.png` | `loft2live-logo-blanco.png` | Header transparente, footer, auth |
| `Hero4/Hero4.mp4` | `Hero4/hero-landing-video.mp4` | Vídeo hero |
| `Hero4/Whisk_... (1)_000.webp` etc. | `Hero4/hero-frame-000.webp` … `hero-frame-081.webp` | Frames del hero (`LandingHero.vue`) |

Referencias actualizadas en: `index.html`, `LandingHeader`, `LandingFooter`, `LandingHero`, `LandingHowItWorks`, `Signin`, `Signup`, `HeaderLogo`, `AppSidebar`, `CompradorSidebar`, `InquilinoSidebar`, `VisitanteLayout`, `SidebarWidget`.

## 4. Open Graph: imagen por página

Para producción, conviene que **og:image** y **twitter:image** sean una URL absoluta, por ejemplo:

```html
<meta property="og:image" content="https://tudominio.com/images/og-loft2live.jpg" />
```

Recomendación: crear una imagen **1200×630 px** (og estándar) con logo y texto “Loft2Live - Inversión y alquiler flexible” y subirla como `og-loft2live.jpg` en `/public/images/`. En el index (o en un head manager) usar la URL absoluta del dominio.

## 5. Sitemap, robots.txt y pre-render (aplicado)

### robots.txt
- **`public/robots.txt`**: permite a todos los bots; bloquea rutas privadas (`/comprador/`, `/inquilino/`, `/visitante/`, `/dashboard`, `/profile`); indica la URL del sitemap. En producción, edita la línea `Sitemap:` con tu dominio real.

### Sitemap
- **`public/sitemap.xml`** se genera en cada build con `npm run sitemap` (también se ejecuta al hacer `npm run build`).
- **`scripts/generate-sitemap.js`**: incluye `/`, `/inversiones`, `/blog`, `/signin`, `/signup`. La URL base se toma de `SITE_URL` o `VITE_SITE_URL` (por defecto `https://loft2live.com`). Para producción: `SITE_URL=https://tudominio.com npm run build`.

### Pre-render (desactivado en build)
- El plugin **vite-plugin-prerender** está desactivado en `vite.config.ts` porque usa CommonJS (`require`) y falla en entornos ESM (p. ej. Vercel). Además Puppeteer no es adecuado en serverless.
- El SEO sigue apoyado en: **sitemap**, **robots.txt**, **meta/canonical por ruta** y **H1/alt**.
- Si en el futuro quieres pre-render en local, puedes usar un script aparte con Puppeteer contra la build estática; el evento `render-event` en `App.vue` queda por si se rehabilita el plugin en otro entorno.

## 6. Resumen de archivos tocados

- `index.html`: meta, og, twitter, canonical, lang.
- `src/router/index.ts`: `meta.description` por ruta y actualización de title, description y canonical en `beforeEach`.
- `src/components/landing/LandingHero.vue`: H1 visible en el hero, alt en imágenes del hero, `role="presentation"` en frames decorativos.
- `src/components/landing/LandingHeader.vue`, `LandingFooter.vue`: alt del logo.
- `src/components/proyectos/ProyectoCard.vue`: alt de la imagen de portada.
- `src/components/proyectos/FormProyecto.vue`: alt en todas las fotos del formulario.
