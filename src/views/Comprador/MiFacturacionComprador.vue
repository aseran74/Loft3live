<template>
  <CompradorLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Mi facturación</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Tickets comprados y pagos por trimestre (según facturación alquiler del proyecto). Pago el día 10 de cada trimestre.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>

    <div v-if="!comprador?.id" class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <p class="text-gray-500 dark:text-gray-400">No se ha cargado tu perfil de comprador.</p>
    </div>

    <template v-else>
      <div class="mb-4 flex flex-wrap items-center gap-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Año</label>
          <select
            v-model="anio"
            class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option v-for="y in añosDisponibles" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <!-- Resumen: tickets y total año -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p class="text-xs text-gray-500 dark:text-gray-400">Tickets comprados</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ comprador.tickets }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p class="text-xs text-gray-500 dark:text-gray-400">Proyecto</p>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ comprador.proyecto_nombre ?? '—' }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p class="text-xs text-gray-500 dark:text-gray-400">Total {{ anio }}</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(miTotalAnio) }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <p class="text-xs text-gray-500 dark:text-gray-400">Pago por ticket (año)</p>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatCurrency(pagoPorTicketAnual) }}</p>
        </div>
      </div>

      <!-- Pagos por trimestre -->
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Pagos por trimestre ({{ anio }})</h2>
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          El reparto se calcula con los ingresos por alquiler del proyecto menos gastos; el pago se realiza el día 10 del mes siguiente al trimestre.
        </p>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Trimestre</th>
                <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Pago ({{ comprador.tickets }} tickets)</th>
                <th class="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Fecha pago</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="t in resumenTrimestres"
                :key="t.trimestre"
                class="border-t border-gray-100 dark:border-gray-700"
              >
                <td class="px-3 py-2">T{{ t.trimestre }} {{ anio }}</td>
                <td class="px-3 py-2 text-right font-medium">{{ formatCurrency(t.miPago) }}</td>
                <td class="px-3 py-2">{{ t.fechaPago }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <router-link to="/comprador" class="mt-6 inline-block text-sm font-medium text-brand-500 hover:text-brand-600">
      Volver al dashboard
    </router-link>
  </CompradorLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import CompradorLayout from '@/components/layout/CompradorLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { insforge } from '@/lib/insforge'

const { comprador, isSessionExpiredError, handleSessionExpired } = useAuth()

interface PeriodoTrimestre {
  anio: number
  trimestre: number
  total_cobrado: number
}

interface GastoMes {
  mes: number
  gastos_comunes: number
  gastos_luz_agua: number
  gastos_personal: number
  gastos_extraordinarios: number
}

const anio = ref(new Date().getFullYear())
const añosDisponibles = [2024, 2025, 2026, 2027]

const periodosTrimestre = ref<PeriodoTrimestre[]>([])
const gastosMensuales = ref<GastoMes[]>([])
const totalTicketsProyecto = ref(0)
const error = ref('')

function totalGastoMes(g: GastoMes) {
  return (
    Number(g.gastos_comunes) + Number(g.gastos_luz_agua) + Number(g.gastos_personal) + Number(g.gastos_extraordinarios)
  )
}

const gastosPorTrimestreMap = computed(() => {
  const map = new Map<number, number>([[1, 0], [2, 0], [3, 0], [4, 0]])
  for (let mes = 1; mes <= 12; mes++) {
    const t = Math.ceil(mes / 3) as 1 | 2 | 3 | 4
    const g = gastosMensuales.value[mes - 1]
    map.set(t, (map.get(t) ?? 0) + (g ? totalGastoMes(g) : 0))
  }
  return map
})

const ingresosPorTrimestre = computed(() => {
  const map = new Map<number, number>([[1, 0], [2, 0], [3, 0], [4, 0]])
  for (const p of periodosTrimestre.value) {
    if (p.anio !== anio.value) continue
    map.set(p.trimestre, (map.get(p.trimestre) ?? 0) + Number(p.total_cobrado))
  }
  return map
})

const resumenTrimestres = computed(() => {
  const totalT = totalTicketsProyecto.value
  const c = comprador.value
  if (!c || totalT <= 0) {
    return [1, 2, 3, 4].map((trimestre) => ({
      trimestre,
      miPago: 0,
      fechaPago: { 1: '10 ene', 2: '10 abr', 3: '10 jul', 4: '10 oct' }[trimestre],
    }))
  }
  const gastosMap = gastosPorTrimestreMap.value
  const fechas: Record<number, string> = { 1: '10 ene', 2: '10 abr', 3: '10 jul', 4: '10 oct' }
  return [1, 2, 3, 4].map((trimestre) => {
    const ingresos = ingresosPorTrimestre.value.get(trimestre) ?? 0
    const gastos = gastosMap.get(trimestre) ?? 0
    const neto = Math.max(0, ingresos - gastos)
    const pagoPorTicket = neto / totalT
    const miPago = c.tickets * pagoPorTicket
    return {
      trimestre,
      miPago,
      fechaPago: fechas[trimestre],
    }
  })
})

const miTotalAnio = computed(() => {
  return resumenTrimestres.value.reduce((s, t) => s + t.miPago, 0)
})

const pagoPorTicketAnual = computed(() => {
  const c = comprador.value
  if (!c || c.tickets <= 0) return 0
  return miTotalAnio.value / c.tickets
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

async function cargarPeriodosTrimestre() {
  const pid = comprador.value?.proyecto_id
  if (!pid) return
  const { data, error: err } = await insforge.database
    .from('facturacion_alquiler_periodos')
    .select('anio, trimestre, total_cobrado, estado')
    .eq('proyecto_id', pid)
    .eq('anio', anio.value)
    .eq('estado', 'Pagado')
    .order('trimestre', { ascending: true })
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    error.value = err.message || 'No se pudo cargar facturación por trimestre'
    return
  }
  const byTrimestre = new Map<string, number>()
  for (const row of (data ?? []) as any[]) {
    const key = `${row.anio}-${row.trimestre}`
    byTrimestre.set(key, (byTrimestre.get(key) ?? 0) + Number(row.total_cobrado ?? 0))
  }
  periodosTrimestre.value = Array.from(byTrimestre.entries()).map(([key, total_cobrado]) => {
    const [a, t] = key.split('-').map(Number)
    return { anio: a, trimestre: t, total_cobrado }
  })
}

async function cargarGastosMensuales() {
  const pid = comprador.value?.proyecto_id
  if (!pid) return
  const { data, error: err } = await insforge.database
    .from('facturacion_compradores_gastos_mes')
    .select('mes, gastos_comunes, gastos_luz_agua, gastos_personal, gastos_extraordinarios')
    .eq('proyecto_id', pid)
    .eq('anio', anio.value)
    .order('mes', { ascending: true })
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    error.value = err.message || 'No se pudieron cargar los gastos'
    return
  }
  const rows = (data ?? []) as any[]
  const byMes = new Map<number, GastoMes>()
  for (const r of rows) {
    byMes.set(Number(r.mes), {
      mes: Number(r.mes),
      gastos_comunes: Number(r.gastos_comunes) ?? 0,
      gastos_luz_agua: Number(r.gastos_luz_agua) ?? 0,
      gastos_personal: Number(r.gastos_personal) ?? 0,
      gastos_extraordinarios: Number(r.gastos_extraordinarios) ?? 0,
    })
  }
  gastosMensuales.value = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1
    return byMes.get(mes) ?? {
      mes,
      gastos_comunes: 0,
      gastos_luz_agua: 0,
      gastos_personal: 0,
      gastos_extraordinarios: 0,
    }
  })
}

async function cargarTotalTicketsProyecto() {
  const pid = comprador.value?.proyecto_id
  if (!pid) return
  const { data, error: err } = await insforge.database
    .from('compradores')
    .select('tickets')
    .eq('proyecto_id', pid)
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    return
  }
  const total = (data ?? []).reduce((sum: number, row: any) => sum + (Number(row.tickets) || 0), 0)
  totalTicketsProyecto.value = total
}

async function load() {
  if (!comprador.value?.proyecto_id) return
  error.value = ''
  await cargarTotalTicketsProyecto()
  await cargarGastosMensuales()
  await cargarPeriodosTrimestre()
}

watch([comprador, anio], () => {
  if (comprador.value?.proyecto_id) load()
}, { immediate: false })

onMounted(() => {
  if (comprador.value?.proyecto_id) load()
})
</script>
