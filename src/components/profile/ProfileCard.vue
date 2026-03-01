<template>
  <div>
    <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div
            class="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
            <span
              v-else
              class="text-2xl font-semibold text-gray-500 dark:text-gray-400"
            >
              {{ displayInitial }}
            </span>
          </div>
          <div class="order-3 xl:order-2">
            <h4
              class="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left"
            >
              {{ displayName }}
            </h4>
            <div
              class="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ rolLabel }}</p>
              <div v-if="email" class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ email || '—' }}</p>
            </div>
          </div>
          <div class="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  email: string | null
  nombre: string | null
  rol: string | null
  avatarUrl?: string | null
}>()

const displayName = computed(() => props.nombre?.trim() || props.email || 'Usuario')
const displayInitial = computed(() => {
  const n = props.nombre?.trim()
  if (n) return n.charAt(0).toUpperCase()
  const e = props.email
  if (e) return e.charAt(0).toUpperCase()
  return '?'
})
const rolLabel = computed(() => {
  const r = props.rol?.toLowerCase()
  if (r === 'admin') return 'Administrador'
  if (r === 'visitante') return 'Visitante'
  if (r === 'inquilino') return 'Inquilino'
  if (r === 'comprador') return 'Comprador'
  return props.rol || '—'
})
</script>
