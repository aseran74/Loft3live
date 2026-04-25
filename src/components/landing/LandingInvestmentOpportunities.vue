<template>
  <section id="oportunidades" class="py-24 bg-[#f7f7f7]">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div class="text-center mb-16 opacity-0" id="oportunidades-header">
        <h2 class="text-4xl lg:text-5xl font-semibold mb-4 text-[#222222] tracking-tight">
          Oportunidades de <span class="text-[#ff385c]">inversion actual</span>
        </h2>
        <p class="text-lg text-[#6a6a6a] max-w-2xl mx-auto">
          Descubre nuestros proyectos seleccionados y empieza a construir tu patrimonio inmobiliario hoy mismo.
        </p>
      </div>

      <div v-if="loading && proyectos.length === 0" class="text-center py-12">
        <p class="text-gray-900">Cargando oportunidades...</p>
      </div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <div v-else-if="proyectos.length === 0" class="text-center py-12">
        <p class="text-[#222222]">No hay oportunidades disponibles en este momento.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        <div v-for="(proyecto, index) in proyectos.slice(0, 6)" :key="proyecto.id" class="proyecto-card opacity-0">
          <ProyectoCard
            :proyecto="proyecto"
            public
            detail-base-path="/inversiones"
            @invertir="handleInvertir"
          />
        </div>
      </div>

      <div v-if="!loading && proyectos.length > 6" class="mt-12 text-center opacity-0" id="oportunidades-btn">
        <router-link
          to="/inversiones"
          class="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold text-white bg-[#ff385c] hover:bg-[#e03150] shadow-[0_12px_26px_rgba(255,56,92,0.3)] transition-all hover:-translate-y-1"
        >
          Ver todos los proyectos
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import ProyectoCard from '@/components/proyectos/ProyectoCard.vue'
import type { Proyecto } from '@/types/proyecto'
import { fetchPublicProyectos } from '@/utils/publicProyectos'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()

const proyectos = ref<Proyecto[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

let ctx: gsap.Context | undefined

onMounted(async () => {
  await load()
  
  nextTick(() => {
    ctx = gsap.context(() => {
      gsap.fromTo(
        '#oportunidades-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#oportunidades',
            start: 'top 80%',
          }
        }
      )

      gsap.fromTo(
        '.proyecto-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.proyecto-card',
            start: 'top 85%',
          }
        }
      )

      if (document.querySelector('#oportunidades-btn')) {
        gsap.fromTo(
          '#oportunidades-btn',
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '#oportunidades-btn',
              start: 'top 95%',
            }
          }
        )
      }
    })
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})

const handleInvertir = (proyecto: Proyecto) => {
  // Público: pedimos login para invertir
  router.push('/signin')
}

async function load() {
  loading.value = true
  error.value = null
  try {
    proyectos.value = await fetchPublicProyectos(true)
  } catch (e: any) {
    error.value = e?.message || 'Error al cargar oportunidades'
  } finally {
    loading.value = false
  }
}
</script>
