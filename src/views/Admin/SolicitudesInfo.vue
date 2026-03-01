<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Solicitudes de información</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Peticiones enviadas desde el dashboard de visitantes (alquilar o comprar).
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>

    <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-600">
            <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Fecha</th>
            <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Email</th>
            <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Tipo</th>
            <th class="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Mensaje</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="s in solicitudes"
            :key="s.id"
            class="border-t border-gray-100 dark:border-gray-700"
          >
            <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ formatDate(s.created_at) }}</td>
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ s.email }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  s.tipo === 'alquilar' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
                ]"
              >
                {{ s.tipo === 'alquilar' ? 'Alquilar' : 'Comprar' }}
              </span>
            </td>
            <td class="max-w-xs px-4 py-3 text-gray-600 dark:text-gray-400">{{ s.mensaje || '—' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="solicitudes.length === 0" class="p-6 text-center text-gray-500">No hay solicitudes aún.</p>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { insforge } from '@/lib/insforge'

interface Solicitud {
  id: string
  email: string
  tipo: string
  mensaje: string | null
  created_at: string
}

const error = ref('')
const solicitudes = ref<Solicitud[]>([])

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
  } catch {
    return iso
  }
}

onMounted(async () => {
  const { data, error: err } = await insforge.database
    .from('solicitudes_info')
    .select('id, email, tipo, mensaje, created_at')
    .order('created_at', { ascending: false })
  if (err) {
    error.value = err.message || 'Error al cargar solicitudes'
    return
  }
  solicitudes.value = (data ?? []) as Solicitud[]
})
</script>
