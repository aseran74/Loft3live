<template>
  <CompradorLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Utilizar puntos</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Usa tus puntos (obtenidos en Compra de puntos) para solicitar estancias en lofts. Filtra por localidad y consulta el mapa.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <!-- Saldo de puntos -->
    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Tu saldo de puntos</h2>
      <p class="text-2xl font-bold text-violet-600 dark:text-violet-400">{{ saldo }}</p>
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Puntos disponibles para canjear por estancias en lofts.</p>
    </div>

    <!-- Filtro por localidad y mapa -->
    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-3 text-lg font-semibold text-gray-800 dark:text-white">Filtro y mapa de localidades</h2>
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Localidad:</label>
        <select
          v-model="filtroLocalidad"
          class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        >
          <option value="">Todas las localidades</option>
          <option v-for="loc in localidadesDisponibles" :key="loc" :value="loc">{{ loc }}</option>
        </select>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ periodosFiltrados.length }} opción(es) disponible(s)
        </span>
      </div>
      <div class="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-900">
        <iframe
          :src="mapaEmbedUrl"
          title="Mapa de localidades"
          class="h-64 w-full sm:h-80"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin"
        />
        <p class="bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {{ textoMapa }}
        </p>
      </div>
    </div>

    <!-- Solicitar usar loft -->
    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Solicitar usar loft con tus puntos</h2>
      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Elige fechas, proyecto y una disponibilidad. Los puntos se descontarán al aprobar.
      </p>

      <!-- 1. Rango de fechas (abre modal con date range picker) -->
      <div class="mb-6 rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/30 p-4 dark:border-violet-800 dark:bg-violet-900/20">
        <label class="mb-3 block text-sm font-semibold text-gray-800 dark:text-white">Rango de fechas que quieres usar</label>
        <div class="flex flex-wrap items-center gap-4">
          <button
            type="button"
            class="flex min-w-[280px] items-center gap-3 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium text-gray-800 shadow-sm transition hover:border-violet-400 hover:bg-violet-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:border-violet-500 dark:hover:bg-violet-900/20"
            @click="abrirModalFechas"
          >
            <span class="text-gray-500 dark:text-gray-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            <span v-if="textoRangoFechas" class="flex-1">{{ textoRangoFechas }}</span>
            <span v-else class="flex-1 text-gray-500 dark:text-gray-400">Seleccionar rango de fechas</span>
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <p v-if="tieneRangoValido" class="text-sm font-medium text-violet-600 dark:text-violet-400">
            {{ diasEnRango }} día(s)
          </p>
          <button
            type="button"
            class="rounded-xl border-2 border-violet-400 bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:border-violet-500 dark:bg-violet-600 dark:hover:bg-violet-700"
            @click="mostrarFechasDisponibles = true; $nextTick(() => cardsRef?.scrollIntoView({ behavior: 'smooth', block: 'start' }))"
          >
            Fechas disponibles
          </button>
        </div>
      </div>

      <!-- Modal date range picker -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="modalFechasAbierto"
            class="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-fechas-title"
            @click.self="cerrarModalFechas"
          >
            <div class="absolute inset-0 bg-black/50" aria-hidden="true" />
            <div
              class="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
              @click.stop
            >
              <div class="mb-4 flex items-center justify-between">
                <h3 id="modal-fechas-title" class="text-lg font-semibold text-gray-900 dark:text-white">
                  Elegir rango de fechas
                </h3>
                <button
                  type="button"
                  class="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  aria-label="Cerrar"
                  @click="cerrarModalFechas"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="mb-6">
                <flat-pickr
                  :key="modalFechasKey"
                  v-model="rangoFechasModal"
                  :config="configCalendarioRangoModal"
                  class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  placeholder="Desde – Hasta"
                  @on-change="onModalRangoChange"
                />
              </div>
              <div class="flex justify-end gap-3">
                <button
                  type="button"
                  class="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  @click="cerrarModalFechas"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  class="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
                  :disabled="!tieneRangoModalValido"
                  @click="aplicarModalFechas"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- 2. Selector de proyecto -->
      <div class="mb-4">
        <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Proyecto</label>
        <select
          v-model="filtroProyectoId"
          class="w-full max-w-md rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        >
          <option value="">Selecciona un proyecto</option>
          <option v-for="proy in proyectosDisponibles" :key="proy.id" :value="proy.id">
            {{ proy.nombre }}{{ proy.localidad ? ` · ${proy.localidad}` : '' }}
          </option>
        </select>
      </div>

      <!-- Localización del proyecto seleccionado -->
      <div v-if="proyectoSeleccionado" class="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-600 dark:bg-gray-800/50">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ proyectoSeleccionado.nombre }}</span>
        <template v-if="proyectoSeleccionado.localidad || proyectoSeleccionado.localizacion">
          <span v-if="proyectoSeleccionado.localidad" class="text-sm text-gray-600 dark:text-gray-400">
            <span class="font-medium text-gray-500 dark:text-gray-500">Localidad:</span> {{ proyectoSeleccionado.localidad }}
          </span>
          <span v-if="proyectoSeleccionado.localizacion" class="text-sm text-gray-600 dark:text-gray-400">
            <span class="font-medium text-gray-500 dark:text-gray-500">Ubicación:</span> {{ proyectoSeleccionado.localizacion }}
          </span>
        </template>
      </div>

      <!-- Resumen disponibilidad y precio (cuando hay rango + opción) -->
      <div v-if="tieneRangoValido && formSolicitud.periodo_id" class="mb-4 rounded-xl border border-violet-200 bg-violet-50/50 p-4 dark:border-violet-800 dark:bg-violet-900/20">
        <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
          <span v-if="diasEfectivos > 0">Disponible:</span>
          <span v-else class="text-amber-600 dark:text-amber-400">El rango elegido no coincide con las fechas de esta opción.</span>
        </p>
        <template v-if="diasEfectivos > 0">
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Días en tu rango: <strong>{{ diasEfectivos }}</strong> · Precio: <strong>{{ puntosSolicitud }} puntos</strong> ({{ periodoSolicitudSeleccionado?.puntos_por_dia }} pts/día)
          </p>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-500">
            Saldo actual: {{ saldo }} pts
            <span v-if="saldo >= puntosSolicitud" class="text-green-600 dark:text-green-400"> · Suficiente</span>
            <span v-else class="text-red-600 dark:text-red-400"> · Insuficiente</span>
          </p>
        </template>
      </div>

      <!-- Cards de disponibilidad (por proyecto, por fechas o "Fechas disponibles") -->
      <div ref="cardsRef" class="mb-6">
        <div v-if="filtroProyectoId || mostrarFechasDisponibles || tieneRangoValido" class="mb-6">
          <p class="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
            <template v-if="mostrarFechasDisponibles">
              Todas las fechas disponibles ({{ opcionesParaCards.length }} opciones). Elige una y luego indica tu rango de fechas.
            </template>
            <template v-else-if="tieneRangoValido && !filtroProyectoId">
              Disponibilidades en tu rango de fechas ({{ opcionesParaCards.length }} opciones). Elige un loft para reservar.
            </template>
            <template v-else>
              {{ tieneRangoValido ? 'Disponibilidades en tu rango de fechas' : 'Disponibilidades · Elige un rango de fechas para ver disponibilidad y precio' }}
            </template>
          </p>
          <div v-if="opcionesParaCards.length === 0" class="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-8 text-center text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-400">
            <template v-if="mostrarFechasDisponibles">
              No hay disponibilidades{{ filtroLocalidad ? ' en esta localidad' : '' }}.
            </template>
            <template v-else-if="tieneRangoValido && !filtroProyectoId">
              No hay disponibilidad para las fechas elegidas{{ filtroLocalidad ? ' en esta localidad' : '' }}. Prueba otro rango o localidad.
            </template>
            <template v-else-if="tieneRangoValido">
              No hay disponibilidad en este proyecto para las fechas elegidas{{ filtroLocalidad ? ' en esta localidad' : '' }}.
            </template>
            <template v-else>
              No hay disponibilidades en este proyecto{{ filtroLocalidad ? ' en esta localidad' : '' }}. Selecciona un rango de fechas.
            </template>
          </div>
          <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <button
              v-for="p in opcionesParaCards"
            :key="p.id"
            type="button"
            class="group flex flex-col rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            :class="formSolicitud.periodo_id === p.id
              ? 'border-violet-500 bg-violet-50 shadow-md dark:border-violet-400 dark:bg-violet-900/20'
              : 'border-gray-200 bg-white hover:border-violet-300 hover:shadow dark:border-gray-600 dark:bg-gray-800 dark:hover:border-violet-500'"
            @click="seleccionarOpcion(p)"
          >
            <div class="mb-2 flex items-center justify-between gap-2">
              <span class="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">Loft {{ p.loft_num }}</span>
              <span
                class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                :class="{
                  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300': p.tipo === 'flextime',
                  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300': p.tipo === 'libre_agosto',
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300': p.tipo === 'libre'
                }"
              >
                {{ etiquetaMotivo(p.tipo) }}
              </span>
            </div>
            <p v-if="mostrarFechasDisponibles || (tieneRangoValido && !filtroProyectoId)" class="mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              {{ p.proyecto_nombre }}{{ p.localidad ? ` · ${p.localidad}` : '' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatoFecha(p.fecha_desde) }} – {{ formatoFecha(p.fecha_hasta) }}
            </p>
            <p class="mt-1 text-sm font-semibold text-violet-600 dark:text-violet-400">
              {{ p.puntos_por_dia }} pts/día
            </p>
            <p v-if="tieneRangoValido && precioParaOpcion(p) !== null" class="mt-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              En tu rango: {{ precioParaOpcion(p) }} pts
            </p>
            <p v-if="p.propietario_nombre && p.tipo === 'flextime'" class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
              {{ p.propietario_nombre }}
            </p>
          </button>
        </div>
        </div>
      </div>

      <!-- Enviar solicitud -->
      <div class="flex flex-wrap items-end gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          class="rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
          :disabled="guardandoSolicitud || !puedeEnviarSolicitud"
          @click="enviarSolicitud"
        >
          {{ guardandoSolicitud ? 'Enviando…' : 'Enviar solicitud' }}
        </button>
      </div>
      <p class="mt-2 text-xs text-amber-600 dark:text-amber-400">
        Las solicitudes se gestionan con el equipo. Te confirmaremos la disponibilidad.
      </p>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <router-link to="/comprador" class="inline-block text-sm font-medium text-brand-500 hover:text-brand-600">
        Volver al dashboard
      </router-link>
    </div>
  </CompradorLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import { Spanish } from 'flatpickr/dist/l10n/es.js'
import 'flatpickr/dist/flatpickr.css'
import CompradorLayout from '@/components/layout/CompradorLayout.vue'
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

type TipoOpcion = 'flextime' | 'libre_agosto' | 'libre'

/** Opción de uso de puntos: viene de la tabla disponibilidad (Insforge) */
interface PeriodoOtro {
  id: string
  tipo: TipoOpcion
  proyecto_id: string
  loft_num: number
  inquilino_id: string | null
  propietario_nombre: string | null
  proyecto_nombre: string
  localidad: string | null
  localizacion: string | null
  fecha_desde: string
  fecha_hasta: string
  puntos_por_dia: number
  periodo_id: string | null
}

/** Número de días entre dos fechas (incluidas). */
function daysBetween(from: string, to: string): number {
  if (!from || !to) return 0
  const a = new Date(from + 'T12:00:00').getTime()
  const b = new Date(to + 'T12:00:00').getTime()
  if (b < a) return 0
  return Math.floor((b - a) / (24 * 60 * 60 * 1000)) + 1
}

/** Comprueba si el rango [desde, hasta] solapa con la opción. */
function solapaConOpcion(desde: string, hasta: string, p: PeriodoOtro): boolean {
  if (!desde || !hasta || !p.fecha_desde || !p.fecha_hasta) return false
  return p.fecha_desde <= hasta && p.fecha_hasta >= desde
}

/** Días efectivos en la intersección del rango usuario con la opción. */
function diasEfectivosOpcion(desde: string, hasta: string, p: PeriodoOtro): number {
  if (!solapaConOpcion(desde, hasta, p)) return 0
  const inicio = desde > p.fecha_desde ? desde : p.fecha_desde
  const fin = hasta < p.fecha_hasta ? hasta : p.fecha_hasta
  return daysBetween(inicio, fin)
}

const { comprador, isSessionExpiredError, handleSessionExpired } = useAuth()
const error = ref('')
const success = ref('')
const guardandoSolicitud = ref(false)
const periodosDeOtros = ref<PeriodoOtro[]>([])
const filtroLocalidad = ref<string>('')
const filtroProyectoId = ref<string>('')
const saldoPuntosComprados = ref<number>(0)
const puntosUsadosEnReservas = ref<number>(0)

const formSolicitud = ref({
  periodo_id: '',
  fecha_desde: '',
  fecha_hasta: '',
})

const modalFechasAbierto = ref(false)
const rangoFechasModal = ref('')
const modalFechasKey = ref(0)
const lastSelectedDatesModal = ref<Date[]>([])

/** Config del flatpickr en el modal: incluye defaultDate al abrir para pre-rellenar. */
const configCalendarioRangoModal = computed(() => {
  const base = { ...configCalendarioRango }
  if (modalFechasAbierto.value && formSolicitud.value.fecha_desde && formSolicitud.value.fecha_hasta) {
    return {
      ...base,
      defaultDate: [formSolicitud.value.fecha_desde, formSolicitud.value.fecha_hasta],
    }
  }
  return base
})

const textoRangoFechas = computed(() => {
  const d = formSolicitud.value.fecha_desde
  const h = formSolicitud.value.fecha_hasta
  if (!d || !h) return ''
  return `${formatoFecha(d)} – ${formatoFecha(h)}`
})

/** Parsea el valor del flatpickr (range) a [desde, hasta] en YYYY-MM-DD. */
function parsearRangoModal(val: string): [string, string] | null {
  if (!val || typeof val !== 'string') return null
  const trimmed = val.trim()
  const parts = trimmed.split(/\s+to\s+|\s*,\s+/).map((s) => s.trim()).filter(Boolean)
  if (parts.length >= 2) {
    const a = parts[0]
    const b = parts[1]
    if (/^\d{4}-\d{2}-\d{2}$/.test(a) && /^\d{4}-\d{2}-\d{2}$/.test(b)) return [a, b]
    const toYMD = (s: string): string | null => {
      const dmv = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
      if (dmv) return `${dmv[3]}-${dmv[2].padStart(2, '0')}-${dmv[1].padStart(2, '0')}`
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
      return null
    }
    const d1 = toYMD(a)
    const d2 = toYMD(b)
    if (d1 && d2) return [d1, d2]
  }
  return null
}

const tieneRangoModalValido = computed(() => {
  if (lastSelectedDatesModal.value.length >= 2) return true
  return parsearRangoModal(rangoFechasModal.value) !== null
})

function abrirModalFechas() {
  const { fecha_desde, fecha_hasta } = formSolicitud.value
  rangoFechasModal.value = fecha_desde && fecha_hasta ? `${fecha_desde}, ${fecha_hasta}` : ''
  lastSelectedDatesModal.value = []
  if (fecha_desde && fecha_hasta) {
    lastSelectedDatesModal.value = [
      new Date(fecha_desde + 'T12:00:00'),
      new Date(fecha_hasta + 'T12:00:00'),
    ]
  }
  modalFechasKey.value += 1
  modalFechasAbierto.value = true
}

function cerrarModalFechas() {
  modalFechasAbierto.value = false
}

function toYYYYMMDD(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function onModalRangoChange(selectedDates: unknown) {
  const arr = Array.isArray(selectedDates) ? selectedDates : []
  lastSelectedDatesModal.value = arr.filter((d): d is Date => d instanceof Date)
}

function aplicarModalFechas() {
  let desde = ''
  let hasta = ''
  if (lastSelectedDatesModal.value.length >= 2) {
    desde = toYYYYMMDD(lastSelectedDatesModal.value[0])
    hasta = toYYYYMMDD(lastSelectedDatesModal.value[1])
  } else {
    const parsed = parsearRangoModal(rangoFechasModal.value)
    if (parsed) {
      desde = parsed[0]
      hasta = parsed[1]
    }
  }
  if (desde && hasta) {
    formSolicitud.value.fecha_desde = desde
    formSolicitud.value.fecha_hasta = hasta
  }
  cerrarModalFechas()
}

const saldo = computed(() => Math.max(0, saldoPuntosComprados.value - puntosUsadosEnReservas.value))

const tieneRangoValido = computed(() =>
  !!formSolicitud.value.fecha_desde && !!formSolicitud.value.fecha_hasta && formSolicitud.value.fecha_desde <= formSolicitud.value.fecha_hasta
)

const diasEnRango = computed(() => {
  if (!tieneRangoValido.value) return 0
  return daysBetween(formSolicitud.value.fecha_desde, formSolicitud.value.fecha_hasta)
})

const periodoSolicitudSeleccionado = computed(() =>
  formSolicitud.value.periodo_id
    ? periodosDeOtros.value.find((p) => p.id === formSolicitud.value.periodo_id)
    : null
)

const diasEfectivos = computed(() => {
  const p = periodoSolicitudSeleccionado.value
  const { fecha_desde, fecha_hasta } = formSolicitud.value
  if (!p || !fecha_desde || !fecha_hasta) return 0
  return diasEfectivosOpcion(fecha_desde, fecha_hasta, p)
})

const puntosSolicitud = computed(() => {
  const p = periodoSolicitudSeleccionado.value
  const d = diasEfectivos.value
  if (!p || !d) return 0
  return p.puntos_por_dia * d
})

const puedeEnviarSolicitud = computed(() => {
  const p = periodoSolicitudSeleccionado.value
  if (!p || !tieneRangoValido.value || diasEfectivos.value < 1) return false
  return saldo.value >= puntosSolicitud.value
})

/** Opciones que solapan con el rango de fechas elegido (si hay rango). */
const opcionesQueCoincidenConRango = computed(() => {
  const { fecha_desde, fecha_hasta } = formSolicitud.value
  if (!fecha_desde || !fecha_hasta) return opcionesDelProyecto.value
  return opcionesDelProyecto.value.filter((p) => solapaConOpcion(fecha_desde, fecha_hasta, p))
})

/** Opciones a mostrar: con rango válido solo las que coinciden; si no, todas las del proyecto. */
const opcionesAMostrar = computed(() => {
  if (tieneRangoValido.value) return opcionesQueCoincidenConRango.value
  return opcionesDelProyecto.value
})

/** Si "Fechas disponibles" está activo, mostramos todas; si solo hay rango sin proyecto, las que coinciden con el rango; si no, las del proyecto. */
const opcionesParaCards = computed(() => {
  if (mostrarFechasDisponibles.value) return periodosFiltrados.value
  const { fecha_desde, fecha_hasta } = formSolicitud.value
  if (tieneRangoValido.value && !filtroProyectoId.value && fecha_desde && fecha_hasta)
    return periodosFiltrados.value.filter((p) => solapaConOpcion(fecha_desde, fecha_hasta, p))
  return opcionesAMostrar.value
})

const mostrarFechasDisponibles = ref(false)
const cardsRef = ref<HTMLElement | null>(null)

function seleccionarOpcion(p: PeriodoOtro) {
  formSolicitud.value.periodo_id = p.id
  if (mostrarFechasDisponibles.value || !filtroProyectoId.value) filtroProyectoId.value = p.proyecto_id
}

function precioParaOpcion(p: PeriodoOtro): number | null {
  if (!tieneRangoValido.value) return null
  const d = diasEfectivosOpcion(formSolicitud.value.fecha_desde, formSolicitud.value.fecha_hasta, p)
  if (d < 1) return null
  return d * p.puntos_por_dia
}

const localidadesDisponibles = computed(() => {
  const set = new Set<string>()
  for (const p of periodosDeOtros.value) {
    const loc = p.localidad?.trim()
    if (loc) set.add(loc)
  }
  return [...set].sort((a, b) => a.localeCompare(b))
})

const periodosFiltrados = computed(() => {
  const loc = filtroLocalidad.value?.trim()
  if (!loc) return periodosDeOtros.value
  return periodosDeOtros.value.filter((p) => (p.localidad ?? '').trim() === loc)
})

/** Proyectos únicos con disponibilidad (para el selector) */
const proyectosDisponibles = computed(() => {
  const seen = new Set<string>()
  const list: { id: string; nombre: string; localidad: string | null; localizacion: string | null }[] = []
  for (const p of periodosFiltrados.value) {
    if (seen.has(p.proyecto_id)) continue
    seen.add(p.proyecto_id)
    list.push({
      id: p.proyecto_id,
      nombre: p.proyecto_nombre,
      localidad: p.localidad,
      localizacion: p.localizacion,
    })
  }
  return list.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''))
})

/** Datos del proyecto seleccionado (para mostrar localización) */
const proyectoSeleccionado = computed(() => {
  const pid = filtroProyectoId.value?.trim()
  if (!pid) return null
  return proyectosDisponibles.value.find((proy) => proy.id === pid) ?? null
})

/** Opciones de disponibilidad del proyecto seleccionado (para las cards) */
const opcionesDelProyecto = computed(() => {
  const pid = filtroProyectoId.value?.trim()
  if (!pid) return []
  return periodosFiltrados.value.filter((p) => p.proyecto_id === pid)
})

const mapaEmbedUrl = computed(() => {
  const loc = filtroLocalidad.value?.trim()
  if (loc) {
    const primero = periodosDeOtros.value.find((p) => (p.localidad ?? '').trim() === loc)
    const q = (primero?.localizacion || primero?.localidad || loc).trim()
    if (q) return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
  }
  const primero = periodosDeOtros.value[0]
  const q = (primero?.localizacion || primero?.localidad || 'España').trim()
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
})

const textoMapa = computed(() => {
  const loc = filtroLocalidad.value?.trim()
  if (loc) return `Mapa: ${loc}`
  if (periodosDeOtros.value.length > 0) return 'Mapa: todas las localidades con periodos disponibles. Selecciona una localidad para centrar el mapa.'
  return 'No hay periodos disponibles. El mapa se actualizará cuando haya ofertas.'
})

function formatoFecha(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function etiquetaMotivo(tipo: TipoOpcion): string {
  if (tipo === 'flextime') return 'Flextime'
  if (tipo === 'libre_agosto') return 'Agosto libre'
  return 'Libre'
}

function etiquetaOpcion(p: PeriodoOtro): string {
  const proy = p.proyecto_nombre ?? ''
  const loc = p.localidad ? ` · ${p.localidad}` : ''
  const fechas = `${formatoFecha(p.fecha_desde)} – ${formatoFecha(p.fecha_hasta)}`
  const pts = ` (${p.puntos_por_dia} pts/día)`
  if (p.tipo === 'libre_agosto') {
    return `Loft ${p.loft_num} - Agosto libre (desalojo agosto) · ${proy}${loc} · ${fechas}${pts}`
  }
  if (p.tipo === 'libre') {
    return `Loft ${p.loft_num} - Libre temporada (sep–ago, sin inquilino) · ${proy}${loc} · ${fechas}${pts}`
  }
  return `${p.propietario_nombre ?? ''} (Loft ${p.loft_num}) · ${proy}${loc} · ${fechas}${pts}`
}

async function cargarSaldoPuntos() {
  const id = comprador.value?.id
  if (!id) return
  const { data, error: err } = await insforge.database
    .from('comprador_compra_puntos')
    .select('puntos')
    .eq('comprador_id', id)
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    saldoPuntosComprados.value = 0
    return
  }
  const rows = (data ?? []) as { puntos: number }[]
  saldoPuntosComprados.value = rows.reduce((s, r) => s + Number(r.puntos ?? 0), 0)
}

async function cargarPuntosUsadosEnReservas() {
  const id = comprador.value?.id
  if (!id) return
  let total = 0
  const { data, error: err } = await insforge.database
    .from('comprador_reserva_puntos')
    .select('puntos')
    .eq('comprador_id', id)
    .eq('estado', 'aprobado')
  if (!err && data) {
    total += (data as { puntos: number }[]).reduce((s, r) => s + Number(r.puntos ?? 0), 0)
  }
  try {
    const { data: dataVacio } = await insforge.database
      .from('comprador_reserva_loft_vacio')
      .select('puntos')
      .eq('comprador_id', id)
      .eq('estado', 'aprobado')
    if (dataVacio) {
      total += (dataVacio as { puntos: number }[]).reduce((s, r) => s + Number(r.puntos ?? 0), 0)
    }
  } catch {
    // Tabla comprador_reserva_loft_vacio puede no existir aún
  }
  puntosUsadosEnReservas.value = total
}

/** Carga opciones desde la tabla disponibilidad (Insforge): Flextime, Libre agosto, Libre temporada + coste puntos */
async function cargarDisponibilidad() {
  const { data: dispData, error: errDisp } = await insforge.database
    .from('disponibilidad')
    .select('id, proyecto_id, loft_num, inquilino_id, motivo, fecha_desde, fecha_hasta, puntos_por_dia, periodo_id')
    .order('motivo', { ascending: true })
    .order('fecha_desde', { ascending: true })

  if (errDisp) {
    if (isSessionExpiredError(errDisp)) { handleSessionExpired(); return }
    periodosDeOtros.value = []
    return
  }

  const rows = (dispData ?? []) as Array<{
    id: string
    proyecto_id: string
    loft_num: number
    inquilino_id: string | null
    motivo: string
    fecha_desde: string | null
    fecha_hasta: string | null
    puntos_por_dia: number
    periodo_id: string | null
  }>

  if (rows.length === 0) {
    periodosDeOtros.value = []
    return
  }

  const proyectoIds = [...new Set(rows.map((r) => r.proyecto_id))]
  const inquilinoIds = [...new Set(rows.map((r) => r.inquilino_id).filter(Boolean))] as string[]

  const [proyRes, inqRes] = await Promise.all([
    insforge.database.from('proyectos').select('id, nombre_proyecto, localidad, localizacion').in('id', proyectoIds),
    inquilinoIds.length > 0
      ? insforge.database.from('inquilinos').select('id, nombre').in('id', inquilinoIds)
      : Promise.resolve({ data: [] })
  ])

  const proyectosMap: Record<string, { nombre_proyecto: string; localidad: string | null; localizacion: string | null }> = {}
  for (const r of proyRes.data ?? []) {
    const x = r as { id: string; nombre_proyecto: string; localidad: string | null; localizacion: string | null }
    proyectosMap[x.id] = { nombre_proyecto: x.nombre_proyecto, localidad: x.localidad ?? null, localizacion: x.localizacion ?? null }
  }
  const inquilinosMap: Record<string, string> = {}
  for (const r of inqRes.data ?? []) {
    const x = r as { id: string; nombre: string }
    inquilinosMap[x.id] = x.nombre
  }

  const opciones: PeriodoOtro[] = rows.map((d) => {
    const proy = proyectosMap[d.proyecto_id]
    const motivo = d.motivo as TipoOpcion
    let id: string
    if (motivo === 'flextime' && d.periodo_id) id = d.periodo_id
    else if (motivo === 'libre_agosto' && d.inquilino_id) id = `agosto:${d.inquilino_id}`
    else id = `vacio:${d.proyecto_id}:${d.loft_num}`

    return {
      id,
      tipo: motivo,
      proyecto_id: d.proyecto_id,
      loft_num: Number(d.loft_num),
      inquilino_id: d.inquilino_id,
      propietario_nombre: d.inquilino_id ? (inquilinosMap[d.inquilino_id] ?? null) : null,
      proyecto_nombre: proy?.nombre_proyecto ?? '',
      localidad: proy?.localidad ?? null,
      localizacion: proy?.localizacion ?? null,
      fecha_desde: d.fecha_desde ?? '',
      fecha_hasta: d.fecha_hasta ?? '',
      puntos_por_dia: Number(d.puntos_por_dia) || 33,
      periodo_id: d.periodo_id,
    }
  })

  periodosDeOtros.value = opciones
}

async function enviarSolicitud() {
  const c = comprador.value
  const p = periodoSolicitudSeleccionado.value
  if (!c || !p || !puedeEnviarSolicitud.value) return
  const dias = diasEfectivos.value
  const puntos = puntosSolicitud.value
  if (dias < 1 || saldo.value < puntos) {
    error.value = 'No tienes suficiente saldo de puntos.'
    return
  }
  error.value = ''
  success.value = ''
  guardandoSolicitud.value = true
  try {
    if (p.tipo === 'libre_agosto' && p.id.startsWith('agosto:')) {
      const inquilinoId = p.id.slice(7)
      const anio = new Date().getFullYear()
      const agostoDesde = `${anio}-08-01`
      const agostoHasta = `${anio}-08-31`
      let periodoId: string
      const { data: existente } = await insforge.database
        .from('flextime_periodos')
        .select('id')
        .eq('inquilino_id', inquilinoId)
        .gte('fecha_desde', agostoDesde)
        .lte('fecha_hasta', agostoHasta)
        .maybeSingle()
      if (existente?.id) {
        periodoId = (existente as { id: string }).id
      } else {
        const { data: nuevo, error: errIns } = await insforge.database
          .from('flextime_periodos')
          .insert({
            inquilino_id: inquilinoId,
            fecha_desde: agostoDesde,
            fecha_hasta: agostoHasta,
            puntos_por_dia: p.puntos_por_dia,
          })
          .select('id')
          .single()
        if (errIns || !nuevo) throw new Error(errIns?.message || 'Error creando periodo agosto')
        periodoId = (nuevo as { id: string }).id
      }
      await insforge.database.from('comprador_reserva_puntos').insert({
        comprador_id: c.id,
        periodo_id: periodoId,
        dias_usados: dias,
        puntos,
        estado: 'aprobado',
      })
    } else if (p.tipo === 'libre' && p.id.startsWith('vacio:')) {
      const parts = p.id.slice(6).split(':')
      const [proyectoId, loftNumStr] = parts
      const loftNum = parseInt(loftNumStr || '0', 10)
      if (!proyectoId || !loftNum) throw new Error('Datos de loft vacío incorrectos')
      const { error: errVacio } = await insforge.database.from('comprador_reserva_loft_vacio').insert({
        comprador_id: c.id,
        proyecto_id: proyectoId,
        loft_num: loftNum,
        fecha_desde: formSolicitud.value.fecha_desde,
        fecha_hasta: formSolicitud.value.fecha_hasta,
        dias_usados: dias,
        puntos,
        estado: 'aprobado',
      })
      if (errVacio) {
        if (errVacio.message?.includes('does not exist') || errVacio.message?.includes('relation')) {
          error.value = 'Reserva de loft vacío en proceso. Contacta con el equipo para confirmar disponibilidad.'
          return
        }
        throw errVacio
      }
    } else {
      const periodoId = p.tipo === 'flextime' ? p.id : (p.periodo_id ?? p.id)
      const { error: err } = await insforge.database.from('comprador_reserva_puntos').insert({
        comprador_id: c.id,
        periodo_id: periodoId,
        dias_usados: dias,
        puntos,
        estado: 'aprobado',
      })
      if (err) throw err
    }

    success.value = 'Reserva registrada y aprobada. Puedes usar el loft en las fechas indicadas.'
    formSolicitud.value = { periodo_id: '', fecha_desde: '', fecha_hasta: '' }
    await load()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error enviando solicitud'
  } finally {
    guardandoSolicitud.value = false
  }
}

async function load() {
  if (!comprador.value?.id) return
  await cargarSaldoPuntos()
  await cargarPuntosUsadosEnReservas()
  await cargarDisponibilidad()
}

watch(comprador, (c) => {
  if (c?.id) load()
}, { immediate: true })

watch(filtroProyectoId, (pid) => {
  if (!pid) {
    formSolicitud.value.periodo_id = ''
    return
  }
  const enProyecto = opcionesDelProyecto.value.some((p) => p.id === formSolicitud.value.periodo_id)
  if (!enProyecto) formSolicitud.value.periodo_id = ''
})

watch(opcionesAMostrar, (opciones) => {
  if (formSolicitud.value.periodo_id && !opciones.some((p) => p.id === formSolicitud.value.periodo_id)) {
    formSolicitud.value.periodo_id = ''
  }
}, { deep: true })

onMounted(load)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
