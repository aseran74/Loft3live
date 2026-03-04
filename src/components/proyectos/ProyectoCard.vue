<template>
  <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
    <!-- Foto (primera) -->
    <div v-if="coverUrl" class="h-64 sm:h-72 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden relative group">
      <img
        :src="coverUrl"
        :alt="`Proyecto ${proyecto.nombre_proyecto} - Imagen de portada`"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      <div class="absolute top-4 left-4 flex items-center gap-2">
        <span class="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg bg-gray-900/80 backdrop-blur-md border border-white/10 uppercase tracking-wider">
          {{ proyecto.vendido_cerrado ? 'Cerrado' : 'Activo' }}
        </span>
        <span class="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg bg-brand-500/90 backdrop-blur-md border border-white/10 uppercase tracking-wider">
          {{ Math.round(proyecto.porcentaje_llegado || 0) }}% completado
        </span>
      </div>
    </div>
    <div v-else class="h-64 sm:h-72 w-full bg-gray-100 flex items-center justify-center">
      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>

    <div class="p-8">
      <h3 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
        {{ proyecto.nombre_proyecto }}
      </h3>

      <!-- Información destacada -->
      <div class="grid grid-cols-2 gap-4 mb-6 p-5 rounded-2xl bg-gray-50 border border-gray-100">
        <div>
          <div class="text-xs text-gray-500 font-medium tracking-wide uppercase mb-1.5">Objetivo inversión</div>
          <div class="text-xl font-extrabold text-brand-500">
            {{ formatCurrency(proyecto.objetivo_inversion_total) }}
          </div>
        </div>
        <div>
          <div class="text-xs text-gray-500 font-medium tracking-wide uppercase mb-1.5">Precio por unidad</div>
          <div class="text-xl font-extrabold text-brand-500">
            {{ formatCurrency(proyecto.precio_unidad) }}
          </div>
        </div>
      </div>

      <div class="space-y-3 mb-8">
        <div class="flex items-start gap-3 text-[15px] text-gray-700">
          <svg class="w-5 h-5 flex-shrink-0 text-brand-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="leading-snug">{{ proyecto.localizacion }}</span>
        </div>
        <div class="flex items-center gap-3 text-[15px] text-gray-700">
          <svg class="w-5 h-5 flex-shrink-0 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="font-medium">{{ proyecto.num_lofts }} lofts</span>
        </div>
        <div class="flex items-center gap-3 text-[15px] text-gray-700">
          <svg class="w-5 h-5 flex-shrink-0 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>{{ proyecto.tipo_inversion }}</span>
        </div>
        <div v-if="proyecto.alquiler && proyecto.precio_alquiler_mes" class="flex items-center gap-3 text-[15px] text-brand-600 bg-brand-50 p-3 rounded-xl">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">Alquiler: {{ formatCurrency(proyecto.precio_alquiler_mes) }}/mes</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
        <div class="flex justify-between text-sm mb-3 text-gray-900 dark:text-white">
          <span class="font-semibold">{{ formatCurrency(proyecto.monto_restante || 0) }} restantes</span>
          <span class="font-extrabold text-brand-500">{{ Math.round(proyecto.porcentaje_llegado || 0) }}%</span>
        </div>
        <div class="w-full rounded-full h-3 overflow-hidden bg-gray-200">
          <div
            class="h-full rounded-full transition-all duration-1000 ease-out bg-brand-500"
            :style="`width: ${Math.min(100, proyecto.porcentaje_llegado || 0)}%`"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <button
          v-if="!proyecto.vendido_cerrado"
          class="flex-1 px-6 py-3.5 text-white rounded-xl transition-all font-bold hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 bg-brand-500"
          @click="$emit('invertir', proyecto)"
        >
          Invertir ahora
        </button>
        <router-link
          :to="`${detailBasePath}/${proyecto.id}`"
          class="px-6 py-3.5 border-2 rounded-xl transition-all font-bold hover:bg-gray-50 text-center border-gray-200 text-gray-900 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-white"
        >
          Ver detalles
        </router-link>
      </div>

      <div v-if="!public" class="grid grid-cols-2 gap-3 mt-3">
        <button
          type="button"
          class="px-4 py-2 border-2 rounded-lg transition-all font-semibold hover:opacity-80"
          style="border-color: #C8D9B0; color: #0D0D0D"
          @click="$emit('editar', proyecto)"
        >
          Editar
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg transition-all font-semibold text-white hover:opacity-90"
          style="background-color: #DC2626"
          @click="$emit('eliminar', proyecto)"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Proyecto } from '@/types/proyecto'
import { getPhotoUrl } from '@/utils/storage'

const props = withDefaults(
  defineProps<{
    proyecto: Proyecto
    /** En true oculta botones Editar/Eliminar (vista pública) */
    public?: boolean
    /** Base path para el enlace "Ver detalles" (ej. /inversiones o /proyectos) */
    detailBasePath?: string
  }>(),
  { detailBasePath: '/proyectos' }
)

defineEmits<{
  invertir: [proyecto: Proyecto]
  'ver-detalles': [proyecto: Proyecto]
  editar: [proyecto: Proyecto]
  eliminar: [proyecto: Proyecto]
}>()

const coverUrl = computed(() => {
  const p = props.proyecto
  const path =
    p?.fotos?.[0] ??
    p?.fotos_oficina_remodelada?.[0] ??
    p?.fotos_oficina_actual?.[0]
  if (!path) return ''
  return getPhotoUrl(path)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>
