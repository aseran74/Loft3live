<template>
  <CompradorLayout>
    <!-- Cabecera destacada con subrayado y acciones -->
    <header class="relative mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-brand-50/30 px-6 py-6 shadow-sm dark:border-gray-700 dark:from-gray-800/90 dark:via-gray-800 dark:to-brand-900/20 sm:px-8 sm:py-8">
      <div class="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <span class="mb-2 inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:bg-brand-400/20 dark:text-brand-300">
            Dashboard propietario
          </span>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {{ saludo }}
          </h1>
          <!-- Subrayado decorativo -->
          <span class="mt-2 block h-1 w-16 rounded-full bg-brand-500 dark:bg-brand-400" aria-hidden="true" />
          <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {{ comprador?.correo || user?.email || 'Tu cuenta de propietario' }}
          </p>
        </div>
        <div class="flex flex-shrink-0 flex-wrap gap-3">
          <router-link
            to="/comprador/mi-facturacion"
            class="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <BarChartIcon class="h-5 w-5" />
            Ver mi facturación
          </router-link>
          <router-link
            to="/comprador/mensajes"
            class="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-300 dark:focus:ring-brand-500"
          >
            <ChatIcon class="h-5 w-5" />
            Mensajes
          </router-link>
        </div>
      </div>
    </header>

    <!-- Tarjeta resumen: Tu inversión -->
    <div class="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div class="border-b border-gray-100 bg-gray-50/80 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/80">
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
            <PieChartIcon class="h-5 w-5" />
          </span>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Tu inversión</h2>
        </div>
      </div>
      <div class="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Proyecto</dt>
          <dd class="mt-1 text-base font-semibold text-gray-900 dark:text-white">{{ comprador?.proyecto_nombre ?? '—' }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tickets</dt>
          <dd class="mt-1 text-2xl font-bold text-brand-600 dark:text-brand-400">{{ comprador?.tickets ?? '—' }}</dd>
        </div>
        <div v-if="comprador?.correo">
          <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Correo</dt>
          <dd class="mt-1 truncate text-sm font-medium text-gray-900 dark:text-white">{{ comprador.correo }}</dd>
        </div>
        <div v-if="comprador?.telefono">
          <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Teléfono</dt>
          <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ comprador?.telefono }}</dd>
        </div>
      </div>
    </div>

    <!-- Accesos rápidos -->
    <h2 class="mb-4 text-base font-semibold text-gray-800 dark:text-white">Accesos rápidos</h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 md:gap-6">
      <router-link
        to="/comprador/mensajes"
        class="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-700"
      >
        <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
          <ChatIcon class="h-6 w-6" />
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white">Mensajes</h3>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Mensajes del equipo y tablón de anuncios de tu proyecto.
          </p>
          <span class="mt-3 inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:underline">
            Abrir mensajes
            <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </router-link>

      <router-link
        to="/comprador/mi-facturacion"
        class="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-600"
      >
        <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
          <BarChartIcon class="h-6 w-6" />
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white">Mi facturación</h3>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Tickets comprados y pagos por trimestre (día 10).
          </p>
          <span class="mt-3 inline-flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:underline">
            Ver facturación
            <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </router-link>

      <router-link
        to="/comprador/compra-puntos"
        class="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-600"
      >
        <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
          <StaredIcon class="h-6 w-6" />
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white">Compra de puntos</h3>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Canjear el trimestre pendiente (no cobrado) por puntos (1 € = 1 punto).
          </p>
          <span class="mt-3 inline-flex items-center text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:underline">
            Ir a compra de puntos
            <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </router-link>

      <router-link
        to="/comprador/utilizar-puntos"
        class="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-violet-600"
      >
        <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
          <StaredIcon class="h-6 w-6" />
        </span>
        <div class="min-w-0 flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white">Utilizar puntos</h3>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Usa tus puntos para solicitar estancias en lofts. Filtra por localidad y consulta el mapa.
          </p>
          <span class="mt-3 inline-flex items-center text-sm font-medium text-violet-600 dark:text-violet-400 group-hover:underline">
            Ir a utilizar puntos
            <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </router-link>
    </div>
  </CompradorLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CompradorLayout from '@/components/layout/CompradorLayout.vue'
import { ChatIcon, BarChartIcon, PieChartIcon, StaredIcon } from '@/icons'
import { useAuth } from '@/composables/useAuth'

const { user, comprador } = useAuth()

const saludo = computed(() => {
  const nombre = comprador.value?.nombre?.trim()
  if (nombre) return `Hola, ${nombre}`
  return 'Bienvenido a tu espacio de propietario'
})
</script>
