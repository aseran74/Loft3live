<template>
  <InquilinoLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Flextime</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Intercambio de días entre inquilinos: activa periodos en tu loft y acumula puntos cuando otros lo usen. Todos tenéis <strong>1000 puntos de bienvenida</strong>. 1 día = puntos según tu renta mensual ÷ 30.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <!-- Saldo -->
    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Tu saldo de puntos</h2>
      <p class="mt-2 text-3xl font-bold text-brand-600 dark:text-brand-400">{{ saldo }}</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        1000 de bienvenida + {{ puntosGanados }} ganados − {{ puntosGastados }} gastados
      </p>
    </div>

    <!-- Activar periodo Flextime -->
    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Activar periodo Flextime</h2>
      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Indica las fechas en que tu loft está disponible para otros inquilinos. Elige un rango en el calendario. Puntos/día según tu renta: <strong>{{ puntosPorDiaDefault }} pts/día</strong>.
      </p>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="sm:col-span-2">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Rango de fechas</label>
          <div class="relative">
            <flat-pickr
              v-model="rangoFechas"
              :config="configCalendarioRango"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="dd/mm/aaaa – dd/mm/aaaa"
              @on-change="onRangoChange"
            />
            <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Puntos/día</label>
          <input
            v-model.number="formPeriodo.puntos_por_dia"
            type="number"
            min="1"
            step="1"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div class="flex items-end">
          <button
            type="button"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            :disabled="guardandoPeriodo || !puedeCrearPeriodo"
            @click="crearPeriodo"
          >
            {{ guardandoPeriodo ? 'Guardando…' : 'Activar periodo' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mis periodos -->
    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Mis periodos activos</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Desde</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Hasta</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Puntos/día</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in misPeriodos"
              :key="p.id"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2">{{ formatoFecha(p.fecha_desde) }}</td>
              <td class="px-3 py-2">{{ formatoFecha(p.fecha_hasta) }}</td>
              <td class="px-3 py-2">{{ p.puntos_por_dia }}</td>
            </tr>
            <tr v-if="misPeriodos.length === 0">
              <td colspan="3" class="px-3 py-6 text-center text-gray-500 dark:text-gray-400">No tienes periodos activos.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Solicitudes recibidas (propietario aprueba o rechaza; al aprobar se suman/restan puntos automáticamente) -->
    <div v-if="solicitudesRecibidas.length > 0" class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Solicitudes recibidas</h2>
      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Otros inquilinos quieren usar tu loft. Al aprobar, se les restan los puntos y a ti se te suman automáticamente.
      </p>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Solicitante</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Días</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Puntos</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Fecha solicitud</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="s in solicitudesRecibidas"
              :key="s.id"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2">{{ s.visitante_nombre ?? '—' }} (Loft {{ s.visitante_loft }})</td>
              <td class="px-3 py-2">{{ s.dias_usados }}</td>
              <td class="px-3 py-2">{{ s.puntos }}</td>
              <td class="px-3 py-2">{{ formatoFechaHora(s.created_at) }}</td>
              <td class="px-3 py-2">
                <button
                  type="button"
                  class="mr-2 rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                  @click="aprobarCanje(s)"
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  class="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                  @click="rechazarCanje(s)"
                >
                  Rechazar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <router-link to="/inquilino" class="mt-6 inline-block text-sm font-medium text-brand-500 hover:text-brand-600">
      Volver al dashboard
    </router-link>
  </InquilinoLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import { Spanish } from 'flatpickr/dist/l10n/es.js'
import 'flatpickr/dist/flatpickr.css'
import InquilinoLayout from '@/components/layout/InquilinoLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { insforge } from '@/lib/insforge'

const configCalendarioRango = {
  mode: 'range' as const,
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'd/m/Y',
  locale: Spanish,
  allowInput: false,
}

const PUNTOS_BIENVENIDA = 1000

interface Periodo {
  id: string
  inquilino_id: string
  fecha_desde: string
  fecha_hasta: string
  puntos_por_dia: number
  created_at: string
}

interface Canje {
  id: string
  inquilino_propietario_id: string
  inquilino_visitante_id: string
  periodo_id: string | null
  dias_usados: number
  puntos: number
  estado: string
  created_at: string
  propietario_nombre?: string
  visitante_nombre?: string
  propietario_loft?: number
  visitante_loft?: number
}

const { inquilino, isSessionExpiredError, handleSessionExpired } = useAuth()
const error = ref('')
const success = ref('')
const guardandoPeriodo = ref(false)
const periodos = ref<Periodo[]>([])
const canjes = ref<Canje[]>([])
const rentaBase = ref<number | null>(null)

const formPeriodo = ref({
  fecha_desde: '',
  fecha_hasta: '',
  puntos_por_dia: 40,
})

const rangoFechas = ref('')

const puntosPorDiaDefault = computed(() => {
  if (rentaBase.value != null) return Math.round(Number(rentaBase.value) / 30)
  return 40
})

const puntosGanados = computed(() =>
  canjes.value
    .filter((c) => c.inquilino_propietario_id === inquilino.value?.id && c.estado === 'aprobado')
    .reduce((s, c) => s + Number(c.puntos), 0)
)

const puntosGastados = computed(() =>
  canjes.value
    .filter((c) => c.inquilino_visitante_id === inquilino.value?.id && c.estado === 'aprobado')
    .reduce((s, c) => s + Number(c.puntos), 0)
)

const saldo = computed(() => PUNTOS_BIENVENIDA + puntosGanados.value - puntosGastados.value)

const misPeriodos = computed(() => periodos.value)

const puedeCrearPeriodo = computed(() => {
  const f = formPeriodo.value
  const i = inquilino.value
  return !!i && !!f.fecha_desde && !!f.fecha_hasta && f.puntos_por_dia > 0
})

const solicitudesRecibidas = computed(() =>
  canjes.value.filter(
    (c) => c.inquilino_propietario_id === inquilino.value?.id && c.estado === 'pendiente'
  )
)

function formatoFecha(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatoFechaHora(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function toYYYYMMDD(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** Convierte d/m/y o yyyy-mm-dd a yyyy-mm-dd para el backend */
function parseToYYYYMMDD(s: string): string {
  const t = s.trim()
  if (!t) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t
  const partes = t.split(/[/-]/)
  if (partes.length >= 3) {
    const [d, m, y] = partes
    if (y && y.length === 4) return `${y}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`
  }
  return t
}

function onRangoChange(selectedDates: Date[]) {
  if (selectedDates.length >= 2) {
    formPeriodo.value.fecha_desde = toYYYYMMDD(selectedDates[0])
    formPeriodo.value.fecha_hasta = toYYYYMMDD(selectedDates[1])
  } else if (selectedDates.length === 1) {
    formPeriodo.value.fecha_desde = toYYYYMMDD(selectedDates[0])
    formPeriodo.value.fecha_hasta = ''
  } else {
    formPeriodo.value.fecha_desde = ''
    formPeriodo.value.fecha_hasta = ''
  }
}

async function cargarRenta() {
  const id = inquilino.value?.id
  if (!id) return
  const { data } = await insforge.database
    .from('facturacion_alquiler')
    .select('renta_base')
    .eq('inquilino_id', id)
    .maybeSingle()
  rentaBase.value = (data as { renta_base?: number } | null)?.renta_base ?? null
  if (formPeriodo.value.puntos_por_dia === 40 && rentaBase.value != null) {
    formPeriodo.value.puntos_por_dia = Math.round(Number(rentaBase.value) / 30)
  }
}

async function cargarPeriodos() {
  const id = inquilino.value?.id
  if (!id) return
  const { data, error: err } = await insforge.database
    .from('flextime_periodos')
    .select('id, inquilino_id, fecha_desde, fecha_hasta, puntos_por_dia, created_at')
    .eq('inquilino_id', id)
    .order('fecha_desde', { ascending: false })
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    error.value = err.message || 'Error cargando periodos'
    return
  }
  periodos.value = (data ?? []) as Periodo[]
}

async function cargarCanjes() {
  const id = inquilino.value?.id
  if (!id) return
  const { data: dataProp, error: errProp } = await insforge.database
    .from('flextime_canjes')
    .select('id, inquilino_propietario_id, inquilino_visitante_id, periodo_id, dias_usados, puntos, estado, created_at')
    .or(`inquilino_propietario_id.eq.${id},inquilino_visitante_id.eq.${id}`)
    .order('created_at', { ascending: false })
  if (errProp) {
    if (isSessionExpiredError(errProp)) { handleSessionExpired(); return }
    error.value = errProp.message || 'Error cargando canjes'
    return
  }
  const rows = (dataProp ?? []) as Canje[]
  const allIds = [...new Set([...rows.map((r) => r.inquilino_propietario_id), ...rows.map((r) => r.inquilino_visitante_id)])]
  const names: Record<string, string> = {}
  const lofts: Record<string, number> = {}
  if (allIds.length > 0) {
    const { data: inqData } = await insforge.database.from('inquilinos').select('id, nombre, loft_num').in('id', allIds)
    for (const row of inqData ?? []) {
      const r = row as { id: string; nombre: string; loft_num: number }
      names[r.id] = r.nombre
      lofts[r.id] = r.loft_num
    }
  }
  canjes.value = rows.map((r) => ({
    ...r,
    propietario_nombre: names[r.inquilino_propietario_id],
    visitante_nombre: names[r.inquilino_visitante_id],
    propietario_loft: lofts[r.inquilino_propietario_id],
    visitante_loft: lofts[r.inquilino_visitante_id],
  }))
}

async function crearPeriodo() {
  const i = inquilino.value
  if (!i || !puedeCrearPeriodo.value) return
  const f = formPeriodo.value
  if (f.fecha_hasta < f.fecha_desde) {
    error.value = 'La fecha hasta debe ser posterior a la fecha desde.'
    return
  }
  error.value = ''
  success.value = ''
  guardandoPeriodo.value = true
  try {
    const { error: err } = await insforge.database.from('flextime_periodos').insert({
      inquilino_id: i.id,
      fecha_desde: f.fecha_desde,
      fecha_hasta: f.fecha_hasta,
      puntos_por_dia: f.puntos_por_dia,
    })
    if (err) throw err
    success.value = 'Periodo activado correctamente.'
    formPeriodo.value = { fecha_desde: '', fecha_hasta: '', puntos_por_dia: puntosPorDiaDefault.value }
    rangoFechas.value = ''
    await cargarPeriodos()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error creando periodo'
  } finally {
    guardandoPeriodo.value = false
  }
}

async function aprobarCanje(c: Canje) {
  error.value = ''
  success.value = ''
  const { error: err } = await insforge.database
    .from('flextime_canjes')
    .update({ estado: 'aprobado', updated_at: new Date().toISOString() })
    .eq('id', c.id)
  if (err) {
    error.value = err.message || 'Error aprobando'
    return
  }
  success.value = 'Solicitud aprobada. Los puntos se han sumado a tu saldo y restado al solicitante.'
  c.estado = 'aprobado'
  await cargarCanjes()
}

async function rechazarCanje(c: Canje) {
  if (!confirm('¿Rechazar esta solicitud?')) return
  error.value = ''
  success.value = ''
  const { error: err } = await insforge.database
    .from('flextime_canjes')
    .update({ estado: 'rechazado', updated_at: new Date().toISOString() })
    .eq('id', c.id)
  if (err) {
    error.value = err.message || 'Error rechazando'
    return
  }
  success.value = 'Solicitud rechazada.'
  await cargarCanjes()
}

async function load() {
  if (!inquilino.value?.id) return
  await cargarRenta()
  await cargarPeriodos()
  await cargarCanjes()
  formPeriodo.value.puntos_por_dia = puntosPorDiaDefault.value
}

watch(inquilino, (i) => {
  if (i?.id) load()
}, { immediate: true })

watch(rangoFechas, (valor) => {
  if (valor == null || valor === '') {
    formPeriodo.value.fecha_desde = ''
    formPeriodo.value.fecha_hasta = ''
    return
  }
  if (Array.isArray(valor)) {
    if (valor.length >= 2) {
      formPeriodo.value.fecha_desde = toYYYYMMDD(valor[0] instanceof Date ? valor[0] : new Date(valor[0]))
      formPeriodo.value.fecha_hasta = toYYYYMMDD(valor[1] instanceof Date ? valor[1] : new Date(valor[1]))
    } else if (valor.length === 1) {
      const d = valor[0] instanceof Date ? valor[0] : new Date(valor[0])
      formPeriodo.value.fecha_desde = toYYYYMMDD(d)
      formPeriodo.value.fecha_hasta = ''
    } else {
      formPeriodo.value.fecha_desde = ''
      formPeriodo.value.fecha_hasta = ''
    }
    return
  }
  const str = String(valor)
  // En español el rango se muestra como "11/02/2026 a 15/02/2026"
  const partes = str.split(/\s+(?:to|a)\s+/i).map((s) => s.trim()).filter(Boolean)
  if (partes.length >= 2) {
    formPeriodo.value.fecha_desde = parseToYYYYMMDD(partes[0])
    formPeriodo.value.fecha_hasta = parseToYYYYMMDD(partes[1])
  } else if (partes.length === 1) {
    formPeriodo.value.fecha_desde = parseToYYYYMMDD(partes[0])
    formPeriodo.value.fecha_hasta = ''
  } else {
    formPeriodo.value.fecha_desde = ''
    formPeriodo.value.fecha_hasta = ''
  }
})

onMounted(load)
</script>
