<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Facturación Compradores</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Reparto a compradores: facturación alquiler menos gastos, pagado el día 10 de cada trimestre. TIR anual por ticket.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <div class="mb-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label class="mb-2 block text-sm font-medium">Proyecto</label>
          <select
            v-model="proyectoId"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Selecciona proyecto</option>
            <option v-for="p in proyectos" :key="p.id" :value="p.id">{{ p.nombre_proyecto }}</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Año</label>
          <select
            v-model="anio"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option v-for="y in añosDisponibles" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Gastos mensuales (resumen y acceso al modal) -->
    <div class="mb-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Gastos mensuales (a descontar del alquiler)</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Total gastos anuales (mes a mes): <strong>{{ formatCurrency(gastosAnualesDesdeMeses) }}</strong>
      </p>
      <div class="mt-3">
        <button
          type="button"
          class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          :disabled="!proyectoId"
          @click="abrirModalGastos"
        >
          Editar gastos mensuales
        </button>
      </div>
    </div>

    <!-- Modal: Gastos mes a mes -->
    <Teleport to="body">
      <div
        v-if="modalGastosVisible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="cerrarModalGastos"
      >
        <div class="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800">
          <div class="border-b border-gray-200 p-4 dark:border-gray-700">
            <h2 class="text-lg font-semibold">Gastos mensuales ({{ anio }})</h2>
            <p class="mt-1 text-xs text-gray-500">
              Comunes, luz/agua, personal y extraordinarios por mes. El reparto a compradores usa la suma por trimestre.
            </p>
          </div>
          <div class="max-h-[50vh] overflow-auto p-4">
            <div class="mb-3 flex justify-end">
              <button
                type="button"
                class="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700"
                @click="aplicarGastosPorDefecto"
              >
                Incluir gastos por defecto
              </button>
            </div>
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-2 py-2 text-left">Mes</th>
                  <th class="px-2 py-2 text-right">Comunes</th>
                  <th class="px-2 py-2 text-right">Luz/agua</th>
                  <th class="px-2 py-2 text-right">Personal</th>
                  <th class="px-2 py-2 text-right">Extraord.</th>
                  <th class="px-2 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(g, idx) in gastosMensuales"
                  :key="idx"
                  class="border-t border-gray-100 dark:border-gray-700"
                >
                  <td class="px-2 py-1.5 font-medium">{{ NOMBRES_MESES[idx] }}</td>
                  <td class="px-2 py-1">
                    <input
                      v-model.number="g.gastos_comunes"
                      type="number"
                      min="0"
                      step="50"
                      class="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm dark:border-gray-600 dark:bg-gray-900"
                    />
                  </td>
                  <td class="px-2 py-1">
                    <input
                      v-model.number="g.gastos_luz_agua"
                      type="number"
                      min="0"
                      step="50"
                      class="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm dark:border-gray-600 dark:bg-gray-900"
                    />
                  </td>
                  <td class="px-2 py-1">
                    <input
                      v-model.number="g.gastos_personal"
                      type="number"
                      min="0"
                      step="50"
                      class="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm dark:border-gray-600 dark:bg-gray-900"
                    />
                  </td>
                  <td class="px-2 py-1">
                    <input
                      v-model.number="g.gastos_extraordinarios"
                      type="number"
                      min="0"
                      step="50"
                      class="w-20 rounded border border-gray-300 px-2 py-1 text-right text-sm dark:border-gray-600 dark:bg-gray-900"
                    />
                  </td>
                  <td class="px-2 py-1.5 text-right font-medium">{{ formatCurrency(totalGastoMes(g)) }}</td>
                </tr>
              </tbody>
            </table>
            <p class="mt-2 text-xs text-gray-500">
              Por defecto: Comunes 667 €/mes, Luz/agua 0, Personal 1.167 €/mes, Extraordinarios 333 €/mes (equivalente a 2.000 + 3.500 + 1.000 €/trimestre).
            </p>
          </div>
          <div class="flex justify-end gap-2 border-t border-gray-200 p-4 dark:border-gray-700">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600"
              @click="cerrarModalGastos"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              :disabled="guardandoGastos"
              @click="guardarGastosMensuales"
            >
              {{ guardandoGastos ? 'Guardando…' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Resumen anual y TIR -->
    <div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p class="text-xs text-gray-500">Ingresos alquiler {{ anio }}</p>
        <p class="text-xl font-bold">{{ formatCurrency(ingresosAnuales) }}</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p class="text-xs text-gray-500">Gastos anuales</p>
        <p class="text-xl font-bold">{{ formatCurrency(gastosAnualesDesdeMeses) }}</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p class="text-xs text-gray-500">Neto a repartir</p>
        <p class="text-xl font-bold text-green-600 dark:text-green-400">{{ formatCurrency(netoAnual) }}</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <p class="text-xs text-gray-500">TIR anual por ticket</p>
        <p class="text-xl font-bold">{{ formatCurrency(tirAnualPorTicket) }}</p>
      </div>
    </div>

    <!-- Reparto por trimestre: día 10 -->
    <div class="mb-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 class="mb-3 text-base font-semibold">Reparto por trimestre (pago día 10)</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left">Trimestre</th>
              <th class="px-3 py-2 text-right">Ingresos</th>
              <th class="px-3 py-2 text-right">Gastos</th>
              <th class="px-3 py-2 text-right">Neto</th>
              <th class="px-3 py-2 text-right">Pago/ticket</th>
              <th class="px-3 py-2 text-left">Fecha pago</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in resumenTrimestres"
              :key="t.trimestre"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2">T{{ t.trimestre }} {{ anio }}</td>
              <td class="px-3 py-2 text-right">{{ formatCurrency(t.ingresos) }}</td>
              <td class="px-3 py-2 text-right">{{ formatCurrency(t.gastos) }}</td>
              <td class="px-3 py-2 text-right font-medium">{{ formatCurrency(t.neto) }}</td>
              <td class="px-3 py-2 text-right">{{ formatCurrency(t.pagoPorTicket) }}</td>
              <td class="px-3 py-2">{{ t.fechaPago }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pago por comprador (trimestral y anual) -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 class="mb-3 text-base font-semibold">Pago a cada comprador ({{ anio }})</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left">Comprador</th>
              <th class="px-3 py-2 text-right">Tickets</th>
              <th class="px-3 py-2 text-right">T1 (10 ene)</th>
              <th class="px-3 py-2 text-right">T2 (10 abr)</th>
              <th class="px-3 py-2 text-right">T3 (10 jul)</th>
              <th class="px-3 py-2 text-right">T4 (10 oct)</th>
              <th class="px-3 py-2 text-right font-semibold">Total año</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in pagosPorComprador"
              :key="c.id"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2">{{ c.nombre }}</td>
              <td class="px-3 py-2 text-right">{{ c.tickets }}</td>
              <td class="px-3 py-2 text-right">{{ formatCurrency(c.t1) }}</td>
              <td class="px-3 py-2 text-right">{{ formatCurrency(c.t2) }}</td>
              <td class="px-3 py-2 text-right">{{ formatCurrency(c.t3) }}</td>
              <td class="px-3 py-2 text-right">{{ formatCurrency(c.t4) }}</td>
              <td class="px-3 py-2 text-right font-semibold">{{ formatCurrency(c.totalAnio) }}</td>
            </tr>
            <tr v-if="pagosPorComprador.length === 0">
              <td colspan="7" class="px-3 py-6 text-center text-gray-500">Selecciona proyecto y revisa que haya compradores y facturación alquiler.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { insforge } from '@/lib/insforge'

interface ProyectoLite {
  id: string
  nombre_proyecto: string
}

interface Comprador {
  id: string
  nombre: string
  tickets: number
}

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

const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const DEFAULT_COMUNES = 667
const DEFAULT_LUZ_AGUA = 0
const DEFAULT_PERSONAL = 1167
const DEFAULT_EXTRAORD = 333

const proyectos = ref<ProyectoLite[]>([])
const proyectoId = ref('')
const anio = ref(2025)
const añosDisponibles = [2024, 2025, 2026]

const compradores = ref<Comprador[]>([])
const periodosTrimestre = ref<PeriodoTrimestre[]>([])

const gastosMensuales = ref<GastoMes[]>([])
const modalGastosVisible = ref(false)
const error = ref('')
const success = ref('')
const guardandoGastos = ref(false)

function totalGastoMes(g: GastoMes) {
  return (
    Number(g.gastos_comunes) + Number(g.gastos_luz_agua) + Number(g.gastos_personal) + Number(g.gastos_extraordinarios)
  )
}

const gastosPorTrimestreMap = computed(() => {
  const map = new Map<number, number>([[1, 0], [2, 0], [3, 0], [4, 0]])
  const list = gastosMensuales.value
  for (let mes = 1; mes <= 12; mes++) {
    const t = Math.ceil(mes / 3) as 1 | 2 | 3 | 4
    const g = list[mes - 1]
    map.set(t, (map.get(t) ?? 0) + (g ? totalGastoMes(g) : 0))
  }
  return map
})

const gastosTotalesPorTrimestre = computed(() => {
  const map = gastosPorTrimestreMap.value
  return [1, 2, 3, 4].map((t) => map.get(t) ?? 0)
})

const gastosAnualesDesdeMeses = computed(() => {
  return gastosMensuales.value.reduce((sum, g) => sum + totalGastoMes(g), 0)
})

const ingresosPorTrimestre = computed(() => {
  const map = new Map<number, number>([[1, 0], [2, 0], [3, 0], [4, 0]])
  for (const p of periodosTrimestre.value) {
    if (p.anio !== anio.value) continue
    map.set(p.trimestre, (map.get(p.trimestre) ?? 0) + Number(p.total_cobrado))
  }
  return map
})

const totalTickets = computed(() => {
  return compradores.value.reduce((sum, c) => sum + c.tickets, 0)
})

const resumenTrimestres = computed(() => {
  const totalT = totalTickets.value
  const gastosMap = gastosPorTrimestreMap.value
  const fechas: Record<number, string> = {
    1: '10 ene',
    2: '10 abr',
    3: '10 jul',
    4: '10 oct',
  }
  return [1, 2, 3, 4].map((trimestre) => {
    const ingresos = ingresosPorTrimestre.value.get(trimestre) ?? 0
    const gastos = gastosMap.get(trimestre) ?? 0
    const neto = Math.max(0, ingresos - gastos)
    const pagoPorTicket = totalT > 0 ? neto / totalT : 0
    return {
      trimestre,
      ingresos,
      gastos,
      neto,
      pagoPorTicket,
      fechaPago: fechas[trimestre],
    }
  })
})

const ingresosAnuales = computed(() => {
  return [1, 2, 3, 4].reduce((sum, t) => sum + (ingresosPorTrimestre.value.get(t) ?? 0), 0)
})

const gastosAnuales = computed(() => gastosAnualesDesdeMeses.value)

const netoAnual = computed(() => {
  return Math.max(0, ingresosAnuales.value - gastosAnuales.value)
})

const tirAnualPorTicket = computed(() => {
  const totalT = totalTickets.value
  if (totalT === 0) return 0
  return netoAnual.value / totalT
})

const pagoPorTicketPorTrimestre = computed(() => {
  return {
    1: resumenTrimestres.value[0]?.pagoPorTicket ?? 0,
    2: resumenTrimestres.value[1]?.pagoPorTicket ?? 0,
    3: resumenTrimestres.value[2]?.pagoPorTicket ?? 0,
    4: resumenTrimestres.value[3]?.pagoPorTicket ?? 0,
  }
})

const pagosPorComprador = computed(() => {
  const p = pagoPorTicketPorTrimestre.value
  return compradores.value.map((c) => ({
    ...c,
    t1: c.tickets * p[1],
    t2: c.tickets * p[2],
    t3: c.tickets * p[3],
    t4: c.tickets * p[4],
    totalAnio: c.tickets * (p[1] + p[2] + p[3] + p[4]),
  }))
})

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

async function cargarProyectos() {
  const { data, error: err } = await insforge.database
    .from('proyectos')
    .select('id, nombre_proyecto')
    .order('nombre_proyecto', { ascending: true })
  if (err) {
    error.value = err.message || 'No se pudieron cargar proyectos'
    return
  }
  proyectos.value = (data ?? []) as ProyectoLite[]
  if (!proyectoId.value && proyectos.value.length > 0) {
    proyectoId.value = proyectos.value[0].id
  }
}

async function cargarCompradores() {
  if (!proyectoId.value) return
  const { data, error: err } = await insforge.database
    .from('compradores')
    .select('id, nombre, tickets')
    .eq('proyecto_id', proyectoId.value)
    .order('nombre', { ascending: true })
  if (err) {
    error.value = err.message || 'No se pudieron cargar compradores'
    return
  }
  compradores.value = ((data ?? []) as any[]).map((x) => ({
    id: x.id,
    nombre: x.nombre,
    tickets: Number(x.tickets) || 0,
  }))
}

async function cargarPeriodosTrimestre() {
  if (!proyectoId.value) return
  const { data, error: err } = await insforge.database
    .from('facturacion_alquiler_periodos')
    .select('anio, trimestre, total_cobrado, estado')
    .eq('proyecto_id', proyectoId.value)
    .eq('anio', anio.value)
    .eq('estado', 'Pagado')
    .order('trimestre', { ascending: true })
  if (err) {
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

function crearGastoMesVacio(mes: number): GastoMes {
  return {
    mes,
    gastos_comunes: 0,
    gastos_luz_agua: 0,
    gastos_personal: 0,
    gastos_extraordinarios: 0,
  }
}

function aplicarGastosPorDefecto() {
  gastosMensuales.value = Array.from({ length: 12 }, (_, i) => ({
    mes: i + 1,
    gastos_comunes: DEFAULT_COMUNES,
    gastos_luz_agua: DEFAULT_LUZ_AGUA,
    gastos_personal: DEFAULT_PERSONAL,
    gastos_extraordinarios: DEFAULT_EXTRAORD,
  }))
}

async function cargarGastosMensuales() {
  if (!proyectoId.value) return
  const { data, error: err } = await insforge.database
    .from('facturacion_compradores_gastos_mes')
    .select('mes, gastos_comunes, gastos_luz_agua, gastos_personal, gastos_extraordinarios')
    .eq('proyecto_id', proyectoId.value)
    .eq('anio', anio.value)
    .order('mes', { ascending: true })
  if (err) {
    error.value = err.message || 'No se pudieron cargar los gastos mensuales'
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
    return byMes.get(mes) ?? crearGastoMesVacio(mes)
  })
}

async function guardarGastosMensuales() {
  if (!proyectoId.value) return
  error.value = ''
  success.value = ''
  guardandoGastos.value = true
  try {
    const { error: errDel } = await insforge.database
      .from('facturacion_compradores_gastos_mes')
      .delete()
      .eq('proyecto_id', proyectoId.value)
      .eq('anio', anio.value)
    if (errDel) throw errDel
    const rows = gastosMensuales.value.map((g) => ({
      proyecto_id: proyectoId.value,
      anio: anio.value,
      mes: g.mes,
      gastos_comunes: Number(g.gastos_comunes) || 0,
      gastos_luz_agua: Number(g.gastos_luz_agua) || 0,
      gastos_personal: Number(g.gastos_personal) || 0,
      gastos_extraordinarios: Number(g.gastos_extraordinarios) || 0,
    }))
    const { error: err } = await insforge.database
      .from('facturacion_compradores_gastos_mes')
      .insert(rows)
    if (err) throw err
    success.value = 'Gastos mensuales guardados correctamente.'
    modalGastosVisible.value = false
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'No se pudieron guardar los gastos'
  } finally {
    guardandoGastos.value = false
  }
}

function abrirModalGastos() {
  if (gastosMensuales.value.length === 0) {
    gastosMensuales.value = Array.from({ length: 12 }, (_, i) => crearGastoMesVacio(i + 1))
  }
  modalGastosVisible.value = true
}

function cerrarModalGastos() {
  modalGastosVisible.value = false
}

watch(
  [proyectoId, anio],
  async () => {
    if (proyectoId.value) {
      await cargarGastosMensuales()
      await cargarCompradores()
      await cargarPeriodosTrimestre()
    }
  },
  { immediate: false }
)

onMounted(async () => {
  await cargarProyectos()
  if (proyectoId.value) {
    await cargarGastosMensuales()
    await cargarCompradores()
    await cargarPeriodosTrimestre()
  }
})
</script>
