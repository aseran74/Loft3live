<template>
  <InquilinoLayout>
    <!-- Cabecera destacada con subrayado y acciones rápidas -->
    <header class="relative mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-brand-50/30 px-6 py-6 shadow-sm dark:border-gray-700 dark:from-gray-800/90 dark:via-gray-800 dark:to-brand-900/20 sm:px-8 sm:py-8">
      <div class="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="min-w-0">
          <span class="mb-2 inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:bg-brand-400/20 dark:text-brand-300">
            Mi espacio
          </span>
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {{ saludo }}
          </h1>
          <span class="mt-2 block h-1 w-16 rounded-full bg-brand-500 dark:bg-brand-400" aria-hidden="true" />
          <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
            {{ inquilino?.correo || user?.email || 'Tu cuenta de inquilino' }}
          </p>
        </div>
        <div class="flex flex-shrink-0 flex-wrap gap-3">
          <router-link
            to="/inquilino/reservar-instalaciones"
            class="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <TaskIcon class="h-5 w-5" />
            Reservar instalaciones
          </router-link>
          <router-link
            to="/inquilino/mensajes"
            class="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-300 dark:focus:ring-brand-500"
          >
            <ChatIcon class="h-5 w-5" />
            Mensajes
          </router-link>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
      <div class="col-span-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 md:col-span-2">
        <div class="border-b border-gray-100 bg-gray-50/80 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/80">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Tu vivienda</h2>
        </div>
        <dl class="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Proyecto</dt>
            <dd class="mt-1 font-semibold text-gray-900 dark:text-white">{{ inquilino?.proyecto_nombre ?? '—' }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Apartamento</dt>
            <dd class="mt-1 text-xl font-bold text-brand-600 dark:text-brand-400">{{ inquilino?.loft_num ?? '—' }}</dd>
          </div>
          <div v-if="inquilino?.correo">
            <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Correo</dt>
            <dd class="mt-1 truncate text-sm font-medium text-gray-900 dark:text-white">{{ inquilino.correo }}</dd>
          </div>
          <div v-if="inquilino?.telefono">
            <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Teléfono</dt>
            <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ inquilino.telefono }}</dd>
          </div>
          <div v-if="periodoAlquiler">
            <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Periodo de alquiler</dt>
            <dd class="mt-1 text-sm font-medium text-gray-900 dark:text-white">{{ periodoAlquiler }}</dd>
          </div>
        </dl>
      </div>

      <router-link
        to="/inquilino/reservar-instalaciones"
        class="flex flex-col p-5 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors"
      >
        <span class="flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
          <TaskIcon class="w-6 h-6" />
        </span>
        <h3 class="mt-3 font-semibold text-gray-800 dark:text-white">Reservar instalaciones</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Reserva zonas comunes e instalaciones
        </p>
      </router-link>

      <router-link
        to="/inquilino/incidencias"
        class="flex flex-col p-5 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors"
      >
        <span class="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          <FlagIcon class="w-6 h-6" />
        </span>
        <h3 class="mt-3 font-semibold text-gray-800 dark:text-white">Incidencias</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Reportar y ver estado de incidencias
        </p>
      </router-link>

      <router-link
        to="/inquilino/mensajes"
        class="flex flex-col p-5 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors"
      >
        <span class="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
          <ChatIcon class="w-6 h-6" />
        </span>
        <h3 class="mt-3 font-semibold text-gray-800 dark:text-white">Mensajes</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ver mensajes y comunicaciones
        </p>
      </router-link>

      <router-link
        to="/inquilino/flextime"
        class="flex flex-col p-5 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors"
      >
        <span class="flex items-center justify-center w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
          <CalenderIcon class="w-6 h-6" />
        </span>
        <h3 class="mt-3 font-semibold text-gray-800 dark:text-white">Flextime</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Activar periodos y gestionar solicitudes
        </p>
      </router-link>

      <router-link
        to="/inquilino/utilizar-puntos"
        class="flex flex-col p-5 rounded-xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors"
      >
        <span class="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          <StaredIcon class="w-6 h-6" />
        </span>
        <h3 class="mt-3 font-semibold text-gray-800 dark:text-white">Utilizar puntos</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Solicitar apartamento de otro inquilino e historial
        </p>
      </router-link>
    </div>
  </InquilinoLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InquilinoLayout from '@/components/layout/InquilinoLayout.vue'
import { TaskIcon, FlagIcon, ChatIcon, CalenderIcon, StaredIcon } from '@/icons'
import { useAuth } from '@/composables/useAuth'

const { user, inquilino } = useAuth()

const saludo = computed(() => {
  const nombre = inquilino.value?.nombre?.trim()
  if (nombre) return `Hola, ${nombre}`
  return 'Bienvenido a tu espacio'
})

const periodoAlquiler = computed(() => {
  const i = inquilino.value
  if (!i) return ''
  if (i.es_toda_temporada) return 'Toda la temporada (1 Sep – 31 Jul)'
  if (i.fecha_inicio_alquiler && i.fecha_fin_alquiler) {
    const d = (s: string) => new Date(s + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${d(i.fecha_inicio_alquiler)} – ${d(i.fecha_fin_alquiler)}`
  }
  return ''
})
</script>
