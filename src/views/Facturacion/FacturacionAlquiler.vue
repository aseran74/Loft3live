<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Facturación Alquiler</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Control de estados de cobro por apartamento con persistencia en InsForge.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{{ success }}</div>

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
          <label class="mb-2 block text-sm font-medium">Filtrar por estado</label>
          <select
            v-model="filtroEstado"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Todos</option>
            <option v-for="e in estados" :key="e" :value="e">{{ e }}</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Filtrar por apartamento</label>
          <input
            v-model.number="filtroLoft"
            type="number"
            min="1"
            placeholder="Ej: 54"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
      </div>
      <p class="mt-3 text-xs text-gray-500">
        Base esperada: 55 apartamentos por proyecto, renta base 1200 EUR, con 10% de descuento para inquilino-propietario.
      </p>
    </div>

    <!-- Filtros por año y periodo (mes / trimestre / año) -->
    <div class="mb-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h3 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Filtrar cobros por periodo</h3>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <label class="mb-2 block text-sm font-medium">Año</label>
          <select
            v-model="filtroAnio"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option v-for="y in añosDisponibles" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Ver por</label>
          <select
            v-model="filtroTipoPeriodo"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="anio">Todo el año</option>
            <option value="mes">Por mes</option>
            <option value="trimestre">Por trimestre</option>
          </select>
        </div>
        <div v-if="filtroTipoPeriodo === 'mes'">
          <label class="mb-2 block text-sm font-medium">Mes</label>
          <select
            v-model="filtroMes"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Todos los meses</option>
            <option v-for="(nombre, idx) in NOMBRES_MESES" :key="idx" :value="idx + 1">{{ nombre }}</option>
          </select>
        </div>
        <div v-if="filtroTipoPeriodo === 'trimestre'">
          <label class="mb-2 block text-sm font-medium">Trimestre</label>
          <select
            v-model="filtroTrimestre"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Todos los trimestres</option>
            <option v-for="t in 4" :key="t" :value="t">T{{ t }}</option>
          </select>
        </div>
      </div>
      <div class="mt-3">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :disabled="!proyectoId"
          @click="abrirModalMesAMes"
        >
          Ver detalle mes a mes
        </button>
      </div>
    </div>

    <div class="mb-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <p class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">Resumen ({{ filtroAnio }}) – estos datos determinan el total y Facturación Compradores</p>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
        <div class="rounded-lg border border-gray-100 p-3 dark:border-gray-600">
          <p class="text-xs text-gray-500">Total</p>
          <p class="text-xl font-bold">{{ resumen.total }}</p>
          <p class="text-xs text-gray-400">apartamentos</p>
        </div>
        <div class="rounded-lg border border-gray-100 p-3 dark:border-gray-600">
          <p class="text-xs text-gray-500">Alquilados</p>
          <p class="text-xl font-bold">{{ resumen.alquilados }}</p>
        </div>
        <div class="rounded-lg border border-gray-100 p-3 dark:border-gray-600">
          <p class="text-xs text-gray-500">Mensualidades</p>
          <p class="text-xl font-bold">{{ resumen.mensualidades }}</p>
        </div>
        <div class="rounded-lg border border-gray-100 p-3 dark:border-gray-600">
          <p class="text-xs text-gray-500">Pagado</p>
          <p class="text-xl font-bold text-green-600">{{ resumen.pagado }}</p>
        </div>
        <div class="rounded-lg border border-gray-100 p-3 dark:border-gray-600">
          <p class="text-xs text-gray-500">Pendiente</p>
          <p class="text-xl font-bold text-amber-600">{{ resumen.pendiente }}</p>
        </div>
        <div class="rounded-lg border border-gray-100 p-3 dark:border-gray-600">
          <p class="text-xs text-gray-500">Incidencia</p>
          <p class="text-xl font-bold text-red-600">{{ resumen.incidencia }}</p>
        </div>
        <div class="rounded-lg border border-gray-100 p-3 dark:border-gray-600">
          <p class="text-xs text-gray-500">Canje</p>
          <p class="text-xl font-bold text-blue-600">{{ resumen.canje }}</p>
        </div>
      </div>
    </div>

    <div class="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 class="mb-3 text-base font-semibold">Cobro mes a mes ({{ filtroAnio }})</h3>
        <div v-if="filtroTipoPeriodo === 'anio'" class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400">Total cobrado en {{ filtroAnio }} (solo Pagado)</p>
          <p class="text-2xl font-bold">{{ formatCurrency(totalAnio) }}</p>
          <p class="mt-1 text-xs text-gray-500">Mismo importe que Ingresos alquiler en Facturación Compradores.</p>
        </div>
        <div v-else class="max-h-64 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-3 py-2 text-left">Mes</th>
                <th class="px-3 py-2 text-right">Importe cobrado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in resumenMensualFiltrado" :key="m.mes" class="border-t border-gray-100 dark:border-gray-700">
                <td class="px-3 py-2">{{ m.nombreMes }}</td>
                <td class="px-3 py-2 text-right font-semibold">{{ formatCurrency(m.totalCobrado) }}</td>
              </tr>
              <tr v-if="resumenMensualFiltrado.length === 0">
                <td colspan="2" class="px-3 py-4 text-center text-gray-500">Sin datos para el filtro seleccionado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 class="mb-3 text-base font-semibold">Cobro trimestre a trimestre ({{ filtroAnio }})</h3>
        <div v-if="filtroTipoPeriodo === 'anio'" class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400">Total cobrado en {{ filtroAnio }} (solo Pagado)</p>
          <p class="text-2xl font-bold">{{ formatCurrency(totalAnio) }}</p>
          <p class="mt-1 text-xs text-gray-500">Mismo importe que Ingresos alquiler en Facturación Compradores.</p>
        </div>
        <div v-else class="max-h-64 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-3 py-2 text-left">Trimestre</th>
                <th class="px-3 py-2 text-right">Importe cobrado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in resumenTrimestralFiltrado" :key="t.trimestre" class="border-t border-gray-100 dark:border-gray-700">
                <td class="px-3 py-2">T{{ t.trimestre }}</td>
                <td class="px-3 py-2 text-right font-semibold">{{ formatCurrency(t.totalCobrado) }}</td>
              </tr>
              <tr v-if="resumenTrimestralFiltrado.length === 0">
                <td colspan="2" class="px-3 py-4 text-center text-gray-500">Sin datos para el filtro seleccionado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div class="max-h-[30rem] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left">Apartamento</th>
              <th class="px-3 py-2 text-left">Inquilino</th>
              <th class="px-3 py-2 text-left">Estado</th>
              <th class="px-3 py-2 text-right">Base</th>
              <th class="px-3 py-2 text-right">Desc.</th>
              <th class="px-3 py-2 text-right">Total</th>
              <th class="px-3 py-2 text-left">Notas</th>
              <th class="px-3 py-2 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filasFiltradas" :key="r.id" class="border-t border-gray-100 dark:border-gray-700">
              <td class="px-3 py-2">{{ r.loft_num }}</td>
              <td class="px-3 py-2">{{ r.inquilino_nombre || 'Apartamento vacío' }}</td>
              <td class="px-3 py-2">
                <select
                  v-model="r.estado"
                  class="w-32 rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900"
                >
                  <option v-for="e in estados" :key="e" :value="e">{{ e }}</option>
                </select>
              </td>
              <td class="px-3 py-2 text-right">{{ formatCurrency(r.renta_base) }}</td>
              <td class="px-3 py-2 text-right">{{ Number(r.descuento_pct).toFixed(0) }}%</td>
              <td class="px-3 py-2 text-right font-semibold">{{ formatCurrency(r.total_pagar) }}</td>
              <td class="px-3 py-2">
                <input
                  v-model.trim="r.notas"
                  type="text"
                  placeholder="Notas..."
                  class="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900"
                />
              </td>
              <td class="px-3 py-2 text-right">
                <button
                  type="button"
                  class="rounded bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600"
                  @click="guardarFila(r)"
                >
                  Guardar
                </button>
              </td>
            </tr>
            <tr v-if="filasFiltradas.length === 0">
              <td colspan="8" class="px-3 py-8 text-center text-gray-500">No hay registros con ese filtro.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: Detalle mes a mes (estado por periodo; solo Pagado cuenta en Fact. Compradores) -->
    <Teleport to="body">
      <div
        v-if="modalMesAMesVisible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="cerrarModalMesAMes"
      >
        <div class="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800">
          <div class="border-b border-gray-200 p-4 dark:border-gray-700">
            <h2 class="text-lg font-semibold">Detalle mes a mes ({{ filtroAnio }})</h2>
            <p class="mt-1 text-xs text-gray-500">
              Solo el importe <strong>Solo Pagado</strong> se refleja en Facturación Compradores. Si un apartamento está Pendiente o Incidencia en un mes, ese dinero no entra en el reparto.
            </p>
          </div>
          <div class="max-h-[60vh] overflow-auto p-4">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th class="px-3 py-2 text-left">Mes</th>
                  <th class="px-3 py-2 text-right">Total cobrado</th>
                  <th class="px-3 py-2 text-right">Solo Pagado → Compradores</th>
                  <th class="px-3 py-2 text-right">Pagado</th>
                  <th class="px-3 py-2 text-right">Pendiente</th>
                  <th class="px-3 py-2 text-right">Incidencia</th>
                  <th class="px-3 py-2 text-right">Canje</th>
                  <th class="px-3 py-2 w-24"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="r in resumenMesAMes"
                  :key="r.mes"
                  class="border-t border-gray-100 dark:border-gray-700"
                >
                  <td class="px-3 py-2 font-medium">{{ r.nombreMes }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(r.totalCobrado) }}</td>
                  <td class="px-3 py-2 text-right font-semibold text-green-600 dark:text-green-400">{{ formatCurrency(r.soloPagado) }}</td>
                  <td class="px-3 py-2 text-right">{{ r.counts.Pagado }}</td>
                  <td class="px-3 py-2 text-right">{{ r.counts.Pendiente }}</td>
                  <td class="px-3 py-2 text-right">{{ r.counts.Incidencia }}</td>
                  <td class="px-3 py-2 text-right">{{ r.counts.Canje }}</td>
                  <td class="px-3 py-2">
                    <button
                      type="button"
                      class="text-brand-600 hover:underline text-xs"
                      @click="toggleExpandidoMes(r.mes)"
                    >
                      {{ expandidoMes[r.mes] ? 'Ocultar' : 'Editar' }}
                    </button>
                  </td>
                </tr>
                <tr v-if="resumenMesAMes.length === 0">
                  <td colspan="8" class="px-3 py-6 text-center text-gray-500">Carga el detalle con el botón «Ver detalle mes a mes».</td>
                </tr>
              </tbody>
            </table>
            <div v-for="r in resumenMesAMes" :key="'det-' + r.mes" v-show="expandidoMes[r.mes]" class="mt-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <p class="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">{{ r.nombreMes }} – estado por apartamento</p>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="p in r.periodos"
                  :key="p.id"
                  class="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-600 dark:bg-gray-800"
                >
                  <span class="text-xs font-medium">Apartamento {{ p.loft_num }}</span>
                  <select
                    v-model="p.estado"
                    class="rounded border border-gray-300 bg-white px-2 py-0.5 text-xs dark:border-gray-600 dark:bg-gray-900"
                    @change="actualizarEstadoPeriodo(p)"
                  >
                    <option v-for="e in estados" :key="e" :value="e">{{ e }}</option>
                  </select>
                  <span class="text-xs text-gray-500">{{ formatCurrency(p.total_cobrado) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end border-t border-gray-200 p-4 dark:border-gray-700">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600"
              @click="cerrarModalMesAMes"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </admin-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { insforge } from '@/lib/insforge'

type Estado = 'Pagado' | 'Pendiente' | 'Incidencia' | 'Canje'

interface ProyectoLite {
  id: string
  nombre_proyecto: string
}

interface FilaFacturacion {
  id: string
  proyecto_id: string
  loft_num: number
  inquilino_id: string | null
  inquilino_nombre?: string
  estado: Estado
  renta_base: number
  descuento_pct: number
  total_pagar: number
  notas?: string | null
}

interface Periodo {
  anio: number
  mes: number
  trimestre: number
  loft_num: number
  estado: Estado
  total_cobrado: number
}

interface PeriodoMesAMes {
  id: string
  loft_num: number
  mes: number
  trimestre: number
  estado: Estado
  total_cobrado: number
}

const estados: Estado[] = ['Pagado', 'Pendiente', 'Incidencia', 'Canje']
const proyectos = ref<ProyectoLite[]>([])
const proyectoId = ref('')
const filas = ref<FilaFacturacion[]>([])
const periodos = ref<Periodo[]>([])
const periodosMesAMes = ref<PeriodoMesAMes[]>([])
const modalMesAMesVisible = ref(false)
const expandidoMes = ref<Record<number, boolean>>({})

const filtroEstado = ref<Estado | ''>('')
const filtroLoft = ref<number | null>(null)
const filtroAnio = ref(2025)
const filtroTipoPeriodo = ref<'anio' | 'mes' | 'trimestre'>('anio')
const filtroMes = ref<number | ''>('')
const filtroTrimestre = ref<number | ''>('')

const añosDisponibles = [2024, 2025, 2026]
const error = ref('')
const success = ref('')

const filasFiltradas = computed(() => {
  return filas.value.filter((r) => {
    const okEstado = !filtroEstado.value || r.estado === filtroEstado.value
    const okLoft = !filtroLoft.value || r.loft_num === Number(filtroLoft.value)
    return okEstado && okLoft
  })
})

const alquiladosLoftNums = computed(() =>
  filas.value.filter((r) => r.inquilino_id).map((r) => r.loft_num)
)

const resumenMensualidades = computed(() => {
  const alquilados = alquiladosLoftNums.value
  const nAlquilados = alquilados.length
  const periodosAnio = periodos.value.filter((p) => p.anio === filtroAnio.value)
  const soloAlquilados = periodosAnio.filter((p) => alquilados.includes(p.loft_num))
  const mensualidades = nAlquilados * 12
  let pagado = 0
  let pendiente = 0
  let incidencia = 0
  let canje = 0
  for (const p of soloAlquilados) {
    if (p.estado === 'Pagado') pagado++
    else if (p.estado === 'Pendiente') pendiente++
    else if (p.estado === 'Incidencia') incidencia++
    else if (p.estado === 'Canje') canje++
  }
  return {
    total: filas.value.length,
    alquilados: nAlquilados,
    mensualidades,
    pagado,
    pendiente,
    incidencia,
    canje,
  }
})

const resumen = computed(() => resumenMensualidades.value)

const NOMBRES_MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const periodosPorAnio = computed(() => {
  return periodos.value.filter((p) => p.anio === filtroAnio.value)
})

/** Solo periodos Pagado: mismo criterio que Facturación Compradores para que coincidan los importes */
const periodosPagadoPorAnio = computed(() => {
  return periodosPorAnio.value.filter((p) => p.estado === 'Pagado')
})

const totalAnio = computed(() => {
  return periodosPagadoPorAnio.value.reduce((sum, p) => sum + Number(p.total_cobrado || 0), 0)
})

const resumenMensualFiltrado = computed(() => {
  const map = new Map<number, number>()
  for (let mes = 1; mes <= 12; mes++) map.set(mes, 0)
  for (const p of periodosPagadoPorAnio.value) {
    map.set(p.mes, (map.get(p.mes) || 0) + Number(p.total_cobrado || 0))
  }
  let entries = Array.from(map.entries()).sort((a, b) => a[0] - b[0])
  if (filtroTipoPeriodo.value === 'mes' && filtroMes.value) {
    const mesNum = Number(filtroMes.value)
    entries = entries.filter(([mes]) => mes === mesNum)
  }
  return entries.map(([mes, totalCobrado]) => ({
    mes,
    nombreMes: NOMBRES_MESES[mes - 1],
    totalCobrado,
  }))
})

const resumenTrimestralFiltrado = computed(() => {
  const map = new Map<number, number>([
    [1, 0], [2, 0], [3, 0], [4, 0],
  ])
  for (const p of periodosPagadoPorAnio.value) {
    map.set(p.trimestre, (map.get(p.trimestre) || 0) + Number(p.total_cobrado || 0))
  }
  let entries = Array.from(map.entries()).sort((a, b) => a[0] - b[0])
  if (filtroTipoPeriodo.value === 'trimestre' && filtroTrimestre.value) {
    const tNum = Number(filtroTrimestre.value)
    entries = entries.filter(([trimestre]) => trimestre === tNum)
  }
  return entries.map(([trimestre, totalCobrado]) => ({ trimestre, totalCobrado }))
})

const resumenMesAMes = computed(() => {
  const list = periodosMesAMes.value
  const byMes = new Map<number, { totalCobrado: number; soloPagado: number; counts: Record<Estado, number>; periodos: PeriodoMesAMes[] }>()
  for (let mes = 1; mes <= 12; mes++) {
    byMes.set(mes, {
      totalCobrado: 0,
      soloPagado: 0,
      counts: { Pagado: 0, Pendiente: 0, Incidencia: 0, Canje: 0 },
      periodos: [],
    })
  }
  for (const p of list) {
    const m = p.mes
    const entry = byMes.get(m)
    if (!entry) continue
    const total = Number(p.total_cobrado || 0)
    entry.totalCobrado += total
    if (p.estado === 'Pagado') entry.soloPagado += total
    entry.counts[p.estado]++
    entry.periodos.push(p)
  }
  return Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1
    const entry = byMes.get(mes)!
    return {
      mes,
      nombreMes: NOMBRES_MESES[mes - 1],
      totalCobrado: entry.totalCobrado,
      soloPagado: entry.soloPagado,
      counts: entry.counts,
      periodos: entry.periodos.sort((a, b) => a.loft_num - b.loft_num),
    }
  })
})

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0))
}

async function cargarProyectos() {
  const { data, error: err } = await insforge.database
    .from('proyectos')
    .select('id, nombre_proyecto')
    .order('created_at', { ascending: false })
  if (err) {
    error.value = err.message || 'No se pudieron cargar proyectos'
    return
  }
  proyectos.value = (data || []) as ProyectoLite[]
  if (!proyectoId.value && proyectos.value.length > 0) {
    proyectoId.value = proyectos.value[0].id
  }
}

async function cargarFacturacion() {
  if (!proyectoId.value) return
  error.value = ''
  const { data, error: err } = await insforge.database
    .from('facturacion_alquiler')
    .select('id, proyecto_id, loft_num, inquilino_id, estado, renta_base, descuento_pct, total_pagar, notas')
    .eq('proyecto_id', proyectoId.value)
    .order('loft_num', { ascending: true })
  if (err) {
    error.value = err.message || 'No se pudo cargar facturación'
    return
  }

  const { data: inqData } = await insforge.database
    .from('inquilinos')
    .select('id, nombre')
    .eq('proyecto_id', proyectoId.value)
  const nombres = new Map<string, string>()
  ;(inqData || []).forEach((i: any) => nombres.set(i.id, i.nombre))

  filas.value = ((data || []) as any[]).map((r) => ({
    ...r,
    renta_base: Number(r.renta_base),
    descuento_pct: Number(r.descuento_pct),
    total_pagar: Number(r.total_pagar),
    inquilino_nombre: r.inquilino_id ? nombres.get(r.inquilino_id) || '' : '',
  }))
}

async function cargarPeriodos(anio: number) {
  if (!proyectoId.value) return
  const { data, error: err } = await insforge.database
    .from('facturacion_alquiler_periodos')
    .select('anio, mes, trimestre, loft_num, estado, total_cobrado')
    .eq('proyecto_id', proyectoId.value)
    .eq('anio', anio)
    .order('mes', { ascending: true })
  if (err) {
    error.value = err.message || 'No se pudo cargar el detalle mensual/trimestral'
    return
  }
  periodos.value = ((data || []) as any[]).map((x) => ({
    anio: Number(x.anio ?? anio),
    mes: Number(x.mes),
    trimestre: Number(x.trimestre),
    loft_num: Number(x.loft_num),
    estado: (x.estado || 'Pendiente') as Estado,
    total_cobrado: Number(x.total_cobrado),
  }))
}

async function guardarFila(row: FilaFacturacion) {
  error.value = ''
  success.value = ''
  const { error: err } = await insforge.database
    .from('facturacion_alquiler')
    .update({
      estado: row.estado,
      notas: row.notas || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', row.id)
  if (err) {
    error.value = err.message || 'No se pudo actualizar la fila'
    return
  }
  success.value = `Apartamento ${row.loft_num} actualizado.`
}

async function cargarPeriodosMesAMes() {
  if (!proyectoId.value) return
  const { data, error: err } = await insforge.database
    .from('facturacion_alquiler_periodos')
    .select('id, loft_num, mes, trimestre, estado, total_cobrado')
    .eq('proyecto_id', proyectoId.value)
    .eq('anio', filtroAnio.value)
    .order('mes', { ascending: true })
    .order('loft_num', { ascending: true })
  if (err) {
    error.value = err.message || 'No se pudo cargar el detalle mes a mes'
    return
  }
  periodosMesAMes.value = ((data || []) as any[]).map((x) => ({
    id: x.id,
    loft_num: Number(x.loft_num),
    mes: Number(x.mes),
    trimestre: Number(x.trimestre),
    estado: (x.estado || 'Pendiente') as Estado,
    total_cobrado: Number(x.total_cobrado || 0),
  }))
  expandidoMes.value = {}
}

function toggleExpandidoMes(mes: number) {
  expandidoMes.value = { ...expandidoMes.value, [mes]: !expandidoMes.value[mes] }
}

async function actualizarEstadoPeriodo(p: PeriodoMesAMes) {
  const { error: err } = await insforge.database
    .from('facturacion_alquiler_periodos')
    .update({ estado: p.estado, updated_at: new Date().toISOString() })
    .eq('id', p.id)
  if (err) {
    error.value = err.message || 'No se pudo actualizar el periodo'
    return
  }
  success.value = `Apartamento ${p.loft_num} mes ${p.mes} actualizado.`
}

function abrirModalMesAMes() {
  cargarPeriodosMesAMes().then(() => {
    modalMesAMesVisible.value = true
  })
}

function cerrarModalMesAMes() {
  modalMesAMesVisible.value = false
}

watch(proyectoId, async () => {
  if (proyectoId.value) {
    await cargarFacturacion()
    await cargarPeriodos(filtroAnio.value)
  }
})
watch(filtroAnio, () => {
  if (proyectoId.value) cargarPeriodos(filtroAnio.value)
})

onMounted(async () => {
  await cargarProyectos()
  await cargarFacturacion()
  await cargarPeriodos(filtroAnio.value)
})
</script>
