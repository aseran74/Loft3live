<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Flextime – Canjes</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Listado de canjes entre inquilinos. Puedes <strong>editar</strong> puntos o estado, o <strong>eliminar</strong> un canje. Al eliminar o al poner estado «Rechazado», los puntos vuelven a su estado inicial (el propietario deja de sumar y el visitante deja de restar esos puntos).
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Canjes</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Fecha</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Propietario (recibe)</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Visitante (paga)</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Días</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Puntos</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Estado</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in canjes"
              :key="c.id"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2 text-gray-600 dark:text-gray-400">{{ formatoFechaHora(c.created_at) }}</td>
              <td class="px-3 py-2">{{ c.propietario_nombre ?? '—' }} <span class="text-gray-400">(Apartamento {{ c.propietario_loft }})</span></td>
              <td class="px-3 py-2">{{ c.visitante_nombre ?? '—' }} <span class="text-gray-400">(Apartamento {{ c.visitante_loft }})</span></td>
              <td class="px-3 py-2">{{ c.dias_usados }}</td>
              <td class="px-3 py-2">
                <input
                  :value="c.puntos"
                  type="number"
                  min="0"
                  class="w-20 rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  @change="actualizarPuntos(c, Number(($event.target as HTMLInputElement).value))"
                />
              </td>
              <td class="px-3 py-2">
                <select
                  :value="c.estado"
                  class="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  @change="actualizarEstado(c, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="aprobado">Aprobado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </td>
              <td class="px-3 py-2">
                <button
                  type="button"
                  class="text-red-600 hover:underline text-xs dark:text-red-400"
                  :title="'Eliminar canje. Los puntos volverán a su estado inicial.'"
                  @click="eliminarCanje(c)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
            <tr v-if="canjes.length === 0">
              <td colspan="7" class="px-3 py-8 text-center text-gray-500 dark:text-gray-400">No hay canjes.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { insforge } from '@/lib/insforge'
import { useAuth } from '@/composables/useAuth'

interface CanjeRow {
  id: string
  inquilino_propietario_id: string
  inquilino_visitante_id: string
  dias_usados: number
  puntos: number
  estado: string
  created_at: string
  propietario_nombre?: string
  visitante_nombre?: string
  propietario_loft?: number
  visitante_loft?: number
}

const { isSessionExpiredError, handleSessionExpired } = useAuth()
const error = ref('')
const success = ref('')
const canjes = ref<CanjeRow[]>([])

function formatoFechaHora(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function cargarCanjes() {
  const { data, error: err } = await insforge.database
    .from('flextime_canjes')
    .select('id, inquilino_propietario_id, inquilino_visitante_id, dias_usados, puntos, estado, created_at')
    .order('created_at', { ascending: false })
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    error.value = err.message || 'Error cargando canjes'
    return
  }
  const rows = (data ?? []) as CanjeRow[]
  const propIds = [...new Set(rows.map((r) => r.inquilino_propietario_id))]
  const visitIds = [...new Set(rows.map((r) => r.inquilino_visitante_id))]
  const allIds = [...new Set([...propIds, ...visitIds])]
  const inquilinosMap: Record<string, { nombre: string; loft_num: number }> = {}
  if (allIds.length > 0) {
    const { data: inqData } = await insforge.database.from('inquilinos').select('id, nombre, loft_num').in('id', allIds)
    for (const row of inqData ?? []) {
      const r = row as { id: string; nombre: string; loft_num: number }
      inquilinosMap[r.id] = { nombre: r.nombre, loft_num: r.loft_num }
    }
  }
  canjes.value = rows.map((r) => ({
    ...r,
    propietario_nombre: inquilinosMap[r.inquilino_propietario_id]?.nombre,
    visitante_nombre: inquilinosMap[r.inquilino_visitante_id]?.nombre,
    propietario_loft: inquilinosMap[r.inquilino_propietario_id]?.loft_num,
    visitante_loft: inquilinosMap[r.inquilino_visitante_id]?.loft_num,
  }))
}

async function actualizarPuntos(c: CanjeRow, nuevosPuntos: number) {
  if (nuevosPuntos < 0 || Number(c.puntos) === nuevosPuntos) return
  error.value = ''
  success.value = ''
  const { error: err } = await insforge.database
    .from('flextime_canjes')
    .update({ puntos: nuevosPuntos, updated_at: new Date().toISOString() })
    .eq('id', c.id)
  if (err) {
    error.value = err.message || 'Error actualizando puntos'
    return
  }
  success.value = 'Puntos actualizados.'
  c.puntos = nuevosPuntos
}

async function actualizarEstado(c: CanjeRow, nuevoEstado: string) {
  if (!['aprobado', 'pendiente', 'rechazado'].includes(nuevoEstado) || c.estado === nuevoEstado) return
  error.value = ''
  success.value = ''
  const { error: err } = await insforge.database
    .from('flextime_canjes')
    .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
    .eq('id', c.id)
  if (err) {
    error.value = err.message || 'Error actualizando estado'
    return
  }
  const msg = nuevoEstado === 'rechazado'
    ? 'Estado actualizado. Los puntos vuelven a su estado inicial (no se aplican).'
    : 'Estado actualizado.'
  success.value = msg
  c.estado = nuevoEstado
}

async function eliminarCanje(c: CanjeRow) {
  if (!confirm('¿Eliminar este canje? Los puntos volverán a su estado inicial (como si el canje no hubiera existido). Esta acción no se puede deshacer.')) return
  error.value = ''
  success.value = ''
  const { error: err } = await insforge.database.from('flextime_canjes').delete().eq('id', c.id)
  if (err) {
    error.value = err.message || 'Error eliminando canje'
    return
  }
  success.value = 'Canje eliminado. Los puntos han vuelto a su estado inicial.'
  canjes.value = canjes.value.filter((x) => x.id !== c.id)
}

onMounted(cargarCanjes)
</script>
