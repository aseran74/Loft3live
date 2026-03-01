<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <LandingHeader />
    <main class="blog-page pt-24 pb-16">
      <!-- Volver con flecha -->
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-2">
        <router-link
          to="/"
          class="blog-back-link"
        >
          <svg class="blog-back-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver
        </router-link>
      </div>

      <!-- Hero del blog -->
      <header class="blog-hero">
        <div class="blog-hero-inner">
          <span class="blog-hero-badge">Blog</span>
          <h1 class="blog-hero-title">Blog</h1>
          <span class="blog-hero-underline" aria-hidden="true" />
          <p class="blog-hero-subtitle">Flexliving, normativa e inversión. Novedades del sector.</p>
        </div>
      </header>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <!-- Primeras 4 noticias en grid 2x2 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          <article
            v-for="post in postsSlice(0, 4)"
            :key="post.id"
            class="blog-card blog-card-featured"
          >
            <div v-if="post.image" class="blog-card-image-wrap">
              <img :src="post.image" :alt="post.title" class="blog-card-image" loading="lazy" />
            </div>
            <div class="blog-card-body">
              <h2 class="blog-card-title">{{ post.title }}</h2>
              <p v-if="post.date" class="blog-card-date">{{ post.date }}</p>
              <div class="blog-card-content blog-card-content-preview">
                <template v-for="(block, i) in post.blocks.slice(0, 3)" :key="i">
                  <p v-if="block.type === 'p'" class="blog-p">{{ block.text }}</p>
                  <ul v-else-if="block.type === 'ul'" class="blog-ul">
                    <li v-for="(item, j) in block.items.slice(0, 2)" :key="j">{{ item }}</li>
                  </ul>
                  <p v-else-if="block.type === 'highlight'" class="blog-highlight">{{ block.text }}</p>
                </template>
              </div>
            </div>
          </article>
        </div>

        <!-- Resto de noticias en lista o grid 2 columnas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <article
            v-for="post in postsSlice(4)"
            :key="post.id"
            class="blog-card"
          >
            <div v-if="post.image" class="blog-card-image-wrap">
              <img :src="post.image" :alt="post.title" class="blog-card-image" loading="lazy" />
            </div>
            <div class="blog-card-body">
              <h2 class="blog-card-title">{{ post.title }}</h2>
              <p v-if="post.date" class="blog-card-date">{{ post.date }}</p>
              <div class="blog-card-content">
                <template v-for="(block, i) in post.blocks" :key="i">
                  <p v-if="block.type === 'p'" class="blog-p">{{ block.text }}</p>
                  <ul v-else-if="block.type === 'ul'" class="blog-ul">
                    <li v-for="(item, j) in block.items" :key="j">{{ item }}</li>
                  </ul>
                  <p v-else-if="block.type === 'highlight'" class="blog-highlight">{{ block.text }}</p>
                </template>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import LandingHeader from '@/components/landing/LandingHeader.vue'
import LandingFooter from '@/components/landing/LandingFooter.vue'

type Block =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'highlight'; text: string }

interface Post {
  id: string
  title: string
  date?: string
  image?: string
  blocks: Block[]
}

function postsSlice (start: number, end?: number): Post[] {
  return end !== undefined ? posts.slice(start, end) : posts.slice(start)
}

const posts: Post[] = [
  {
    id: 'madrid-boom',
    title: 'Madrid como epicentro del "Boom"',
    date: 'Febrero 2026',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=420&fit=crop',
    blocks: [
      { type: 'p', text: 'Madrid lidera la oferta nacional con más de 16.000 unidades en proyecto.' },
      { type: 'highlight', text: 'Proyectos clave para 2026:' },
      { type: 'p', text: 'Operadores como AEDAS Homes están entregando sus primeras promociones de flexliving en zonas estratégicas como Valdebebas, mientras que proyectos en Valdemarín se esperan para 2027.' },
      { type: 'highlight', text: 'Conversión de oficinas:' },
      { type: 'p', text: 'Una de las noticias más destacadas de este mes es el éxito de la normativa madrileña que permite transformar edificios de oficinas en desuso en soluciones de alojamiento flexible, lo que está aliviando la falta de oferta.' },
    ],
  },
  {
    id: 'debate-regulatorio',
    title: 'El debate regulatorio: ¿Solución o parche?',
    date: 'Febrero 2026',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=420&fit=crop',
    blocks: [
      { type: 'p', text: 'En los últimos días (febrero 2026), los CEOs de las grandes Socimis (Merlin Properties y Colonial) han protagonizado titulares al pedir una regulación más clara.' },
      { type: 'p', text: 'Definen al flexliving como un "parche necesario" ante la rigidez de la Ley de Vivienda.' },
      { type: 'p', text: 'Existe una presión creciente por parte del Gobierno para limitar compras especulativas por "grandes tenedores", lo que podría afectar a cómo se gestionan estos activos de corta y media estancia.' },
    ],
  },
  {
    id: 'barcelona-flex-premium',
    title: 'Barcelona y el "Flex Premium"',
    date: 'Febrero 2026',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=420&fit=crop',
    blocks: [
      { type: 'p', text: 'Mientras Madrid apuesta por el volumen, Barcelona se está posicionando en el Flexliving Premium.' },
      { type: 'p', text: 'Las noticias recientes destacan proyectos de diseño (como Kora Mostra) que integran servicios de coworking, sostenibilidad y alta tecnología acústica para nómadas digitales y perfiles ejecutivos.' },
      { type: 'p', text: 'Se proyecta que para finales de 2026, Barcelona sea el laboratorio europeo de "vida por metro", priorizando la experiencia comunitaria sobre el tamaño de la habitación.' },
    ],
  },
  {
    id: 'cifras-inversion',
    title: 'Cifras de inversión récord',
    date: 'Febrero 2026',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=420&fit=crop',
    blocks: [
      { type: 'p', text: 'Se estima que el stock de Flexliving en España se duplicará de aquí a 2028.' },
      { type: 'p', text: 'Solo en el último semestre se han movido más de 330 millones de euros en inversión directa hacia este modelo, atrayendo a gigantes como Blackstone que ven en este híbrido (entre hotel y vivienda) una rentabilidad mucho mayor que el alquiler convencional.' },
    ],
  },
  {
    id: 'smartrental-suio',
    title: 'SmartRental Group lanza su marca "Suio" con el foco en Europa',
    date: '23 de febrero de 2026',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=420&fit=crop',
    blocks: [
      { type: 'p', text: 'La compañía SmartRental Group acaba de anunciar este 23 de febrero el lanzamiento de Suio, su nueva marca dedicada exclusivamente al flexliving.' },
      { type: 'highlight', text: 'El plan:' },
      { type: 'p', text: 'Prevén alcanzar las 768 unidades en cartera para 2028.' },
      { type: 'highlight', text: 'Próximas aperturas:' },
      { type: 'p', text: 'En España, el primer gran proyecto bajo esta marca abrirá sus puertas en Alcobendas (Madrid) en octubre de 2026. También tienen previstas expansiones hacia Berlín y Atenas, consolidando el modelo de "alquiler flexible" como una solución para la movilidad laboral internacional.' },
    ],
  },
  {
    id: 'argis-bgo-madrid',
    title: 'Argis y BGO compran una cartera masiva en Madrid',
    date: 'Principios de febrero de 2026',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=420&fit=crop',
    blocks: [
      { type: 'p', text: 'A principios de febrero, el fondo Argis, en alianza con BGO, cerró la compra de una cartera destinada a flexliving en zonas céntricas de Madrid.' },
      { type: 'highlight', text: 'El proyecto:' },
      { type: 'p', text: 'La operación se centra en la reconversión de edificios de oficinas para transformarlos en 440 unidades residenciales bajo este modelo flexible.' },
      { type: 'highlight', text: 'Importancia:' },
      { type: 'p', text: 'Esta noticia confirma que la tendencia de "transformar oficinas en camas" es ahora la estrategia ganadora de los fondos de inversión ante la escasez de suelo residencial puro en la capital.' },
    ],
  },
  {
    id: 'socimis-reclaman',
    title: 'Las Socimis reclaman al Gobierno "flexibilizar" la norma',
    date: '25 de febrero de 2026',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=420&fit=crop',
    blocks: [
      { type: 'p', text: 'En una reunión clave celebrada hoy mismo (25 de febrero de 2026), los CEOs de Merlin Properties y Colonial han enviado un mensaje directo a la Administración.' },
      { type: 'highlight', text: 'El mensaje:' },
      { type: 'p', text: 'Defienden que el flexliving es la "válvula de escape" actual ante la rigidez de la Ley de Vivienda, pero advierten que si no se crea un marco legal específico que lo diferencie del alquiler tradicional, el sector podría estancarse.' },
      { type: 'highlight', text: 'La cifra:' },
      { type: 'p', text: 'Destacan que gracias a las medidas de conversión de oficinas a residencial en Madrid, se ha evitado que la crisis de oferta sea aún más crítica, pero piden que estas medidas se extiendan y agilicen a nivel nacional.' },
    ],
  },
]
</script>

<style scoped>
.blog-page,
.blog-page * {
  font-family: 'Outfit', 'Switzer', sans-serif;
}

/* Volver con flecha */
.blog-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-gray-600, #475467);
  text-decoration: none;
  transition: color 0.2s ease, gap 0.2s ease;
}
.blog-back-link:hover {
  color: var(--color-brand-600, #3641f5);
  gap: 0.625rem;
}
.dark .blog-back-link {
  color: #9ca3af;
}
.dark .blog-back-link:hover {
  color: var(--color-brand-400, #818cf8);
}

.blog-back-arrow {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* Hero del blog */
.blog-hero {
  margin-bottom: 3rem;
  padding: 2.5rem 1.5rem 3rem;
  background: linear-gradient(to bottom right, #f9fafb, #fff, rgba(70, 95, 255, 0.06));
  border-bottom: 1px solid var(--color-gray-200, #e4e7ec);
}
.dark .blog-hero {
  background: linear-gradient(to bottom right, rgba(17, 24, 39, 0.98), rgba(31, 41, 55, 0.95), rgba(70, 95, 255, 0.08));
  border-bottom-color: var(--color-gray-700, #374151);
}

.blog-hero-inner {
  max-width: 48rem;
  margin: 0 auto;
  text-align: center;
}

.blog-hero-badge {
  display: inline-block;
  margin-bottom: 0.75rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-brand-600, #3641f5);
  background: rgba(70, 95, 255, 0.1);
  border-radius: 9999px;
}
.dark .blog-hero-badge {
  color: var(--color-brand-400, #818cf8);
  background: rgba(70, 95, 255, 0.2);
}

.blog-hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-gray-900, #101828);
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.2;
}
.dark .blog-hero-title {
  color: #f9fafb;
}

.blog-hero-underline {
  display: block;
  width: 4rem;
  height: 4px;
  margin: 0.75rem auto 0;
  background: var(--color-brand-500, #465fff);
  border-radius: 9999px;
}

.blog-hero-subtitle {
  margin: 1rem 0 0;
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--color-gray-600, #475467);
}
.dark .blog-hero-subtitle {
  color: #d1d5db;
}

/* Tarjetas */
.blog-card {
  background: var(--color-gray-50, #f9fafb);
  border: 1px solid var(--color-gray-200, #e4e7ec);
  border-radius: 1rem;
  padding: 0;
  overflow: hidden;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  display: flex;
  flex-direction: column;
}
.dark .blog-card {
  background: rgba(31, 41, 55, 0.5);
  border-color: var(--color-gray-700, #374151);
}

.blog-card-image-wrap {
  width: 100%;
  aspect-ratio: 800 / 420;
  background: var(--color-gray-200, #e4e7ec);
  flex-shrink: 0;
}
.dark .blog-card-image-wrap {
  background: var(--color-gray-700, #374151);
}

.blog-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.blog-card-body {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.blog-card-featured .blog-card-body {
  padding: 2rem;
}

.blog-card:hover {
  border-color: var(--color-brand-200, #c2d6ff);
  box-shadow: 0 8px 24px rgba(70, 95, 255, 0.1);
}
.dark .blog-card:hover {
  border-color: var(--color-brand-700, #4338ca);
  box-shadow: 0 8px 24px rgba(70, 95, 255, 0.15);
}

.blog-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-gray-900, #101828);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}
.dark .blog-card-title {
  color: #f9fafb;
}

.blog-card-featured .blog-card-title {
  font-size: 1.375rem;
}

.blog-card-date {
  font-size: 0.8125rem;
  color: var(--color-brand-600, #3641f5);
  font-weight: 600;
  margin: 0 0 1rem 0;
}
.dark .blog-card-date {
  color: var(--color-brand-400, #818cf8);
}

.blog-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.blog-card-content-preview .blog-p {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-p {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--color-gray-700, #344054);
  margin: 0;
}
.dark .blog-p {
  color: #d1d5db;
}

.blog-ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.blog-ul li {
  position: relative;
  padding-left: 1.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-gray-700, #344054);
}
.dark .blog-ul li {
  color: #d1d5db;
}

.blog-ul li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-brand-500, #465fff);
  font-weight: 700;
}

.blog-highlight {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-800, #1d2939);
  margin: 0;
}
.dark .blog-highlight {
  color: #e5e7eb;
}

@media (max-width: 640px) {
  .blog-hero {
    padding: 2rem 1rem 2.5rem;
  }

  .blog-card-body,
  .blog-card-featured .blog-card-body {
    padding: 1.5rem;
  }

  .blog-card-title {
    font-size: 1.125rem;
  }

  .blog-card-featured .blog-card-title {
    font-size: 1.25rem;
  }
}
</style>
