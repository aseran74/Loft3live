<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Reserva de instalaciones</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Reserva de sala, piscina u otras instalaciones comunes por inquilinos. Selecciona proyecto, instalación, fecha y horario.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold">Nueva reserva</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label class="mb-2 block text-sm font-medium">Proyecto</label>
          <select
            v-model="form.proyecto_id"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Selecciona proyecto</option>
            <option v-for="p in proyectos" :key="p.id" :value="p.id">{{ p.nombre_proyecto }}</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Instalación</label>
          <select
            v-model="form.instalacion_tipo"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Selecciona instalación</option>
            <option v-for="opt in instalacionesOpciones" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <p v-if="form.proyecto_id && instalacionesOpciones.length === 0" class="mt-1 text-xs text-amber-600 dark:text-amber-400">
            Añade instalaciones en el detalle del proyecto.
          </p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Inquilino</label>
          <select
            v-model="form.inquilino_id"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Selecciona inquilino</option>
            <option v-for="i in inquilinosProyecto" :key="i.id" :value="i.id">Loft {{ i.loft_num }} · {{ i.nombre }}</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Fecha</label>
          <div class="flex gap-2">
            <div class="relative flex-1 min-w-0">
              <flat-pickr
                v-model="form.fecha"
                :config="configCalendario"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm dark:border-gray-600 dark:bg-gray-900"
                placeholder="Elegir fecha"
              />
              <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </span>
            </div>
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              @click="form.fecha = hoyISO()"
            >
              Hoy
            </button>
          </div>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Hora inicio</label>
          <input
            v-model="form.hora_inicio"
            type="time"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Hora fin</label>
          <input
            v-model="form.hora_fin"
            type="time"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div class="lg:col-span-2">
          <label class="mb-2 block text-sm font-medium">Notas (opcional)</label>
          <input
            v-model.trim="form.notas"
            type="text"
            placeholder="Ej. Reunión de vecinos"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div class="flex items-end">
          <button
            type="button"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            :disabled="guardando || !puedeGuardar"
            @click="guardarReserva"
          >
            {{ guardando ? 'Guardando…' : 'Reservar' }}
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold">Reservas</h2>
      <div class="mb-4 flex flex-wrap items-end gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">Proyecto</label>
          <select
            v-model="filtroProyectoId"
            class="w-full min-w-[180px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Todos</option>
            <option v-for="p in proyectos" :key="p.id" :value="p.id">{{ p.nombre_proyecto }}</option>
          </select>
        </div>
        <div class="flex flex-wrap items-end gap-2">
          <div>
            <label class="mb-2 block text-sm font-medium">Rango de fechas</label>
            <div class="flex flex-wrap items-center gap-2">
              <div class="relative">
                <flat-pickr
                  v-model="filtroFechaDesde"
                  :config="configCalendario"
                  class="min-w-[140px] rounded-lg border border-gray-300 bg-white px-3 py-2 pr-9 text-sm dark:border-gray-600 dark:bg-gray-900"
                  placeholder="Desde"
                />
                <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </span>
              </div>
              <span class="text-gray-400">–</span>
              <div class="relative">
                <flat-pickr
                  v-model="filtroFechaHasta"
                  :config="configCalendario"
                  class="min-w-[140px] rounded-lg border border-gray-300 bg-white px-3 py-2 pr-9 text-sm dark:border-gray-600 dark:bg-gray-900"
                  placeholder="Hasta"
                />
                <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </span>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5 items-center">
            <button
              v-for="preset in presetsRango"
              :key="preset.label"
              type="button"
              class="rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              :class="filtroPresetActivo === preset.label ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400' : 'border-gray-300 dark:border-gray-600'"
              @click="aplicarPresetRango(preset)"
            >
              {{ preset.label }}
            </button>
            <button
              v-if="filtroFechaDesde || filtroFechaHasta"
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              @click="limpiarRangoFechas"
            >
              Ver todas
            </button>
          </div>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left">Fecha</th>
              <th class="px-3 py-2 text-left">Instalación</th>
              <th class="px-3 py-2 text-left">Inquilino</th>
              <th class="px-3 py-2 text-left">Horario</th>
              <th class="px-3 py-2 text-left">Notas</th>
              <th class="px-3 py-2 w-24">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in reservasFiltradas"
              :key="r.id"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2">{{ formatoFecha(r.fecha) }}</td>
              <td class="px-3 py-2">{{ etiquetaInstalacion(r.instalacion_tipo) }}</td>
              <td class="px-3 py-2">{{ nombreInquilino(r.inquilino_id) }}</td>
              <td class="px-3 py-2">{{ formatearHora(r.hora_inicio) }} – {{ formatearHora(r.hora_fin) }}</td>
              <td class="max-w-[180px] truncate px-3 py-2 text-gray-600 dark:text-gray-400">{{ r.notas || '—' }}</td>
              <td class="px-3 py-2">
                <button
                  type="button"
                  class="text-red-600 hover:underline text-xs"
                  @click="eliminarReserva(r)"
                >
                  Borrar
                </button>
              </td>
            </tr>
            <tr v-if="reservasFiltradas.length === 0">
              <td colspan="6" class="px-3 py-8 text-center text-gray-500">No hay reservas.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import flatPickr from 'vue-flatpickr-component'
import { Spanish } from 'flatpickr/dist/l10n/es.js'
import 'flatpickr/dist/flatpickr.css'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { insforge } from '@/lib/insforge'
import { getInstalacionByTipo } from '@/utils/instalaciones'

const configCalendario = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'd/m/Y',
  locale: Spanish,
  allowInput: false,
}

interface ProyectoLite {
  id: string
  nombre_proyecto: string
}

interface InquilinoLite {
  id: string
  proyecto_id: string
  loft_num: number
  nombre: string
}

interface ProyectoInstalacionRow {
  instalacion_tipo: string
  duracion_minutos: number | null
}

interface ReservaInstalacion {
  id: string
  proyecto_id: string
  instalacion_tipo: string
  inquilino_id: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  notas: string | null
}

const proyectos = ref<ProyectoLite[]>([])
const proyectoInstalaciones = ref<ProyectoInstalacionRow[]>([])
const inquilinos = ref<InquilinoLite[]>([])
const reservas = ref<ReservaInstalacion[]>([])

const error = ref('')
const success = ref('')
const guardando = ref(false)
const filtroProyectoId = ref('')
const filtroFechaDesde = ref('')
const filtroFechaHasta = ref('')
const filtroPresetActivo = ref<string | null>(null)

function hoyISO() {
  return new Date().toISOString().slice(0, 10)
}
function sumarDias(iso: string, dias: number) {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

type PresetRango = { label: string; getRange: () => [string, string] }

const presetsRango: PresetRango[] = [
  { label: 'Hoy', getRange: () => { const h = hoyISO(); return [h, h] } },
  { label: 'Esta semana', getRange: () => { const h = new Date(); const lunes = new Date(h); lunes.setDate(h.getDate() - h.getDay() + (h.getDay() === 0 ? -6 : 1)); const domingo = sumarDias(lunes.toISOString().slice(0, 10), 6); return [lunes.toISOString().slice(0, 10), domingo] } },
  { label: 'Este mes', getRange: () => { const h = new Date(); const ini = `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, '0')}-01`; const ult = new Date(h.getFullYear(), h.getMonth() + 1, 0); const fin = ult.toISOString().slice(0, 10); return [ini, fin] } },
  { label: 'Próx. 7 días', getRange: () => [hoyISO(), sumarDias(hoyISO(), 6)] },
  { label: 'Próx. 30 días', getRange: () => [hoyISO(), sumarDias(hoyISO(), 29)] },
]

function aplicarPresetRango(preset: PresetRango) {
  const [desde, hasta] = preset.getRange()
  filtroFechaDesde.value = desde
  filtroFechaHasta.value = hasta
  filtroPresetActivo.value = preset.label
}

function limpiarRangoFechas() {
  filtroFechaDesde.value = ''
  filtroFechaHasta.value = ''
  filtroPresetActivo.value = null
}

watch([filtroFechaDesde, filtroFechaHasta], () => {
  const desde = filtroFechaDesde.value
  const hasta = filtroFechaHasta.value
  const coincide = presetsRango.some((p) => {
    const [d, h] = p.getRange()
    return d === desde && h === hasta
  })
  if (!coincide) filtroPresetActivo.value = null
})

const form = ref({
  proyecto_id: '',
  instalacion_tipo: '',
  inquilino_id: '',
  fecha: '',
  hora_inicio: '10:00',
  hora_fin: '12:00',
  notas: '',
})

const instalacionesOpciones = computed(() =>
  proyectoInstalaciones.value.map((row) => ({
    value: row.instalacion_tipo,
    label: getInstalacionByTipo(row.instalacion_tipo)?.label ?? row.instalacion_tipo,
  }))
)

const inquilinosProyecto = computed(() => {
  if (!form.value.proyecto_id) return []
  return inquilinos.value.filter((i) => i.proyecto_id === form.value.proyecto_id)
})

const reservasFiltradas = computed(() => {
  let list = reservas.value
  if (filtroProyectoId.value) {
    list = list.filter((r) => r.proyecto_id === filtroProyectoId.value)
  }
  if (filtroFechaDesde.value) {
    list = list.filter((r) => r.fecha >= filtroFechaDesde.value)
  }
  if (filtroFechaHasta.value) {
    list = list.filter((r) => r.fecha <= filtroFechaHasta.value)
  }
  return list
})

const puedeGuardar = computed(() => {
  const f = form.value
  return !!f.proyecto_id && !!f.instalacion_tipo && !!f.inquilino_id && !!f.fecha && !!f.hora_inicio && !!f.hora_fin
})

function nombreInquilino(id: string) {
  const i = inquilinos.value.find((x) => x.id === id)
  return i ? `Loft ${i.loft_num} · ${i.nombre}` : id
}

function etiquetaInstalacion(tipo: string) {
  return getInstalacionByTipo(tipo)?.label ?? tipo
}

function formatoFecha(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatearHora(h: string) {
  if (!h) return '—'
  const [hour, min] = String(h).split(':')
  return `${hour.padStart(2, '0')}:${(min || '00').padStart(2, '0')}`
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
}

async function cargarInquilinos() {
  const { data, error: err } = await insforge.database
    .from('inquilinos')
    .select('id, proyecto_id, loft_num, nombre')
  if (err) {
    error.value = err.message || 'No se pudieron cargar inquilinos'
    return
  }
  inquilinos.value = (data ?? []) as InquilinoLite[]
}

async function cargarProyectoInstalaciones(proyectoId: string) {
  const { data, error: err } = await insforge.database
    .from('proyecto_instalaciones')
    .select('instalacion_tipo, duracion_minutos')
    .eq('proyecto_id', proyectoId)
    .eq('activo', true)
  if (err) {
    proyectoInstalaciones.value = []
    return
  }
  proyectoInstalaciones.value = (data ?? []) as ProyectoInstalacionRow[]
}

async function cargarReservas() {
  const { data, error: err } = await insforge.database
    .from('reservas_instalaciones')
    .select('id, proyecto_id, instalacion_tipo, inquilino_id, fecha, hora_inicio, hora_fin, notas')
    .order('fecha', { ascending: false })
    .order('hora_inicio', { ascending: true })
  if (err) {
    error.value = err.message || 'No se pudieron cargar reservas'
    return
 }
  reservas.value = (data ?? []) as ReservaInstalacion[]
}

async function guardarReserva() {
  error.value = ''
  success.value = ''
  const f = form.value
  if (!f.proyecto_id || !f.inquilino_id || !f.fecha || !f.hora_inicio || !f.hora_fin) return
  if (f.hora_fin <= f.hora_inicio) {
    error.value = 'La hora fin debe ser posterior a la hora de inicio.'
    return
  }
  guardando.value = true
  try {
    const { error: err } = await insforge.database.from('reservas_instalaciones').insert({
      proyecto_id: f.proyecto_id,
      instalacion_tipo: f.instalacion_tipo,
      inquilino_id: f.inquilino_id,
      fecha: f.fecha,
      hora_inicio: f.hora_inicio,
      hora_fin: f.hora_fin,
      notas: f.notas || null,
    })
    if (err) throw err
    success.value = 'Reserva guardada correctamente.'
    form.value.notas = ''
    await cargarReservas()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error guardando reserva'
  } finally {
    guardando.value = false
  }
}

async function eliminarReserva(r: ReservaInstalacion) {
  if (!confirm('¿Eliminar esta reserva?')) return
  const { error: err } = await insforge.database.from('reservas_instalaciones').delete().eq('id', r.id)
  if (err) {
    error.value = err.message || 'Error eliminando reserva'
    return
  }
  success.value = 'Reserva eliminada.'
  await cargarReservas()
}

watch(
  () => form.value.proyecto_id,
  async (nuevoId) => {
    if (nuevoId) {
      await cargarProyectoInstalaciones(nuevoId)
      const sigueValida = instalacionesOpciones.value.some((o) => o.value === form.value.instalacion_tipo)
      if (!sigueValida) form.value.instalacion_tipo = ''
    } else {
      proyectoInstalaciones.value = []
      form.value.instalacion_tipo = ''
    }
    if (form.value.proyecto_id && inquilinosProyecto.value.every((i) => i.id !== form.value.inquilino_id)) {
      form.value.inquilino_id = ''
    }
  }
)

onMounted(async () => {
  await cargarProyectos()
  await cargarInquilinos()
  await cargarReservas()
})
</script>
