<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <LandingHeader />
    <main class="pt-24 pb-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <!-- Volver -->
        <router-link
          to="/"
          class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 mb-8"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </router-link>

        <header class="mb-12">
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Proyectos de inversión
          </h1>
          <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Conoce los proyectos disponibles. Entra a invertir o alquilar con Flexliving.
          </p>
        </header>

        <div v-if="loading" class="py-12 text-center text-gray-500 dark:text-gray-400">
          Cargando proyectos...
        </div>

        <div v-else-if="error" class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          {{ error }}
        </div>

        <div v-else-if="proyectos.length === 0" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
          <p class="text-gray-500 dark:text-gray-400">No hay proyectos publicados en este momento.</p>
          <router-link to="/" class="mt-4 inline-block text-brand-500 hover:text-brand-600 font-medium">
            Volver al inicio
          </router-link>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ProyectoCard
            v-for="p in proyectos"
            :key="p.id"
            :proyecto="p"
            :public="true"
            detail-base-path="/inversiones"
            @invertir="onInvertir"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LandingHeader from '@/components/landing/LandingHeader.vue'
import ProyectoCard from '@/components/proyectos/ProyectoCard.vue'
import { fetchPublicProyectos } from '@/utils/publicProyectos'
import type { Proyecto } from '@/types/proyecto'

const router = useRouter()
const proyectos = ref<Proyecto[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    proyectos.value = await fetchPublicProyectos(false)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al cargar proyectos'
  } finally {
    loading.value = false
  }
})

function onInvertir(proyecto: Proyecto) {
  router.push(`/inversiones/${proyecto.id}`)
}
</script>
