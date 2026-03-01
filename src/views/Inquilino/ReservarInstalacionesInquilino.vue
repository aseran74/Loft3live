<template>
  <InquilinoLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Reservar instalaciones</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Reserva zonas comunes (sala, piscina, pista de pádel, etc.) de tu proyecto. Solo se muestran las instalaciones disponibles en <strong>{{ inquilino?.proyecto_nombre }}</strong>.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <!-- Vista diaria: croquis huecos libres / reservados -->
    <div
      v-if="inquilino?.proyecto_id && instalacionesOpciones.length > 0"
      class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
    >
      <h2 class="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Vista del día</h2>
      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Huecos libres y reservados para el <strong>{{ fechaVistaFormateada }}</strong>. Elige fecha en el formulario de abajo para ver otro día.
      </p>
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-600">
                <th class="sticky left-0 z-10 w-28 bg-gray-50 py-2 pl-2 pr-1 text-left font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  Instalación
                </th>
                <th
                  v-for="slot in slotsDelDia"
                  :key="slot.hora"
                  class="border-l border-gray-100 px-0.5 py-2 text-center font-medium text-gray-600 dark:border-gray-700 dark:text-gray-400"
                >
                  {{ slot.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="inst in instalacionesOpciones"
                :key="inst.value"
                class="border-b border-gray-100 dark:border-gray-700"
              >
                <td class="sticky left-0 z-10 w-28 bg-white py-1 pl-2 pr-1 font-medium text-gray-800 dark:bg-gray-800 dark:text-white">
                  {{ inst.label }}
                </td>
                <td
                  v-for="slot in slotsDelDia"
                  :key="`${inst.value}-${slot.hora}`"
                  class="h-8 min-w-[28px] border-l border-gray-100 dark:border-gray-700"
                  :class="claseCelda(inst.value, slot)"
                  :title="tituloCelda(inst.value, slot)"
                />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span class="inline-flex items-center gap-1.5">
          <span class="h-4 w-4 rounded bg-emerald-400 dark:bg-emerald-600" /> Libre
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="h-4 w-4 rounded bg-amber-400 dark:bg-amber-600" /> Reservado
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="h-4 w-4 rounded bg-brand-500" /> Tu reserva
        </span>
      </div>
    </div>

    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Nueva reserva</h2>
      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Loft {{ inquilino?.loft_num }} · {{ inquilino?.nombre }}
      </p>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Instalación</label>
          <select
            v-model="form.instalacion_tipo"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option value="">Selecciona instalación</option>
            <option v-for="opt in instalacionesOpciones" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <p v-if="inquilino?.proyecto_id && instalacionesOpciones.length === 0" class="mt-1 text-xs text-amber-600 dark:text-amber-400">
            No hay instalaciones configuradas para tu proyecto.
          </p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha</label>
          <div class="flex gap-2">
            <div class="relative flex-1 min-w-0">
              <flat-pickr
                v-model="form.fecha"
                :config="configCalendario"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
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
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Hora inicio</label>
          <input
            v-model="form.hora_inicio"
            type="time"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Hora fin</label>
          <input
            v-model="form.hora_fin"
            type="time"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div class="lg:col-span-2">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Notas (opcional)</label>
          <input
            v-model.trim="form.notas"
            type="text"
            placeholder="Ej. Reunión de vecinos"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
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
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Mis reservas</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Fecha</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Instalación</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Horario</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Notas</th>
              <th class="px-3 py-2 w-24 text-left text-gray-700 dark:text-gray-300">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in misReservas"
              :key="r.id"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2">{{ formatoFecha(r.fecha) }}</td>
              <td class="px-3 py-2">{{ etiquetaInstalacion(r.instalacion_tipo) }}</td>
              <td class="px-3 py-2">{{ formatearHora(r.hora_inicio) }} – {{ formatearHora(r.hora_fin) }}</td>
              <td class="max-w-[180px] truncate px-3 py-2 text-gray-600 dark:text-gray-400">{{ r.notas || '—' }}</td>
              <td class="px-3 py-2">
                <button
                  type="button"
                  class="text-red-600 hover:underline text-xs dark:text-red-400"
                  @click="eliminarReserva(r)"
                >
                  Borrar
                </button>
              </td>
            </tr>
            <tr v-if="misReservas.length === 0">
              <td colspan="5" class="px-3 py-8 text-center text-gray-500 dark:text-gray-400">No tienes reservas.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <router-link to="/inquilino" class="mt-4 inline-block text-sm font-medium text-brand-500 hover:text-brand-600">
        Volver al dashboard
      </router-link>
    </div>
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
import { getInstalacionByTipo } from '@/utils/instalaciones'

const configCalendario = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'd/m/Y',
  locale: Spanish,
  allowInput: false,
}

interface ProyectoInstalacionRow {
  instalacion_tipo: string
  duracion_minutos: number | null
}

interface ReservaInstalacion {
  id: string
  instalacion_tipo: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  notas: string | null
  inquilino_id?: string
}

const { inquilino, isSessionExpiredError, handleSessionExpired } = useAuth()
const proyectoInstalaciones = ref<ProyectoInstalacionRow[]>([])
const reservas = ref<ReservaInstalacion[]>([])
const reservasDelDia = ref<ReservaInstalacion[]>([])
const error = ref('')
const success = ref('')
const guardando = ref(false)

const form = ref({
  instalacion_tipo: '',
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

const misReservas = computed(() => reservas.value)

const fechaVista = computed(() => form.value.fecha || hoyISO())

const fechaVistaFormateada = computed(() => {
  const f = fechaVista.value
  if (!f) return '—'
  return new Date(f + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const HORA_INICIO = 8
const HORA_FIN = 22
const slotsDelDia = computed(() => {
  const slots: { hora: string; label: string; startMin: number; endMin: number }[] = []
  for (let h = HORA_INICIO; h < HORA_FIN; h++) {
    const start = `${String(h).padStart(2, '0')}:00`
    const end = `${String(h + 1).padStart(2, '0')}:00`
    slots.push({
      hora: start,
      label: start,
      startMin: h * 60,
      endMin: (h + 1) * 60,
    })
  }
  return slots
})

function horaAMinutos(h: string): number {
  const [hh, mm] = String(h).slice(0, 5).split(':').map(Number)
  return (hh ?? 0) * 60 + (mm ?? 0)
}

function slotOcupado(instalacionTipo: string, slotStartMin: number, slotEndMin: number): { ocupado: boolean; esMio: boolean } {
  const reservasInst = reservasDelDia.value.filter((r) => r.instalacion_tipo === instalacionTipo)
  const miId = inquilino.value?.id
  for (const r of reservasInst) {
    const start = horaAMinutos(r.hora_inicio)
    const end = horaAMinutos(r.hora_fin)
    if (start < slotEndMin && end > slotStartMin) {
      return { ocupado: true, esMio: miId != null && r.inquilino_id === miId }
    }
  }
  return { ocupado: false, esMio: false }
}

function claseCelda(instalacionTipo: string, slot: { startMin: number; endMin: number }): string {
  const { ocupado, esMio } = slotOcupado(instalacionTipo, slot.startMin, slot.endMin)
  if (esMio) return 'bg-brand-500 dark:bg-brand-600'
  if (ocupado) return 'bg-amber-400 dark:bg-amber-600'
  return 'bg-emerald-400/60 dark:bg-emerald-600/60'
}

function tituloCelda(instalacionTipo: string, slot: { startMin: number; endMin: number }): string {
  const { ocupado, esMio } = slotOcupado(instalacionTipo, slot.startMin, slot.endMin)
  const fin = slot.endMin
  const finStr = `${String(Math.floor(fin / 60)).padStart(2, '0')}:${String(fin % 60).padStart(2, '0')}`
  const slotLabel = `${slot.startMin / 60 | 0}:00-${finStr}`
  if (esMio) return `Tu reserva (${slotLabel})`
  if (ocupado) return `Reservado (${slotLabel})`
  return `Libre (${slotLabel})`
}

const puedeGuardar = computed(() => {
  const f = form.value
  const i = inquilino.value
  return !!i && !!f.instalacion_tipo && !!f.fecha && !!f.hora_inicio && !!f.hora_fin
})

function hoyISO() {
  return new Date().toISOString().slice(0, 10)
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
  return `${(hour ?? '00').padStart(2, '0')}:${(min || '00').padStart(2, '0')}`
}

async function cargarProyectoInstalaciones(proyectoId: string) {
  const { data, error: err } = await insforge.database
    .from('proyecto_instalaciones')
    .select('instalacion_tipo, duracion_minutos')
    .eq('proyecto_id', proyectoId)
    .eq('activo', true)
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    proyectoInstalaciones.value = []
    return
  }
  proyectoInstalaciones.value = (data ?? []) as ProyectoInstalacionRow[]
}

async function cargarReservas() {
  const id = inquilino.value?.id
  if (!id) return
  const { data, error: err } = await insforge.database
    .from('reservas_instalaciones')
    .select('id, instalacion_tipo, fecha, hora_inicio, hora_fin, notas, inquilino_id')
    .eq('inquilino_id', id)
    .order('fecha', { ascending: false })
    .order('hora_inicio', { ascending: true })
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    error.value = err.message || 'No se pudieron cargar reservas'
    return
  }
  reservas.value = (data ?? []) as ReservaInstalacion[]
}

async function cargarReservasDelDia() {
  const pid = inquilino.value?.proyecto_id
  const fecha = fechaVista.value
  if (!pid || !fecha) {
    reservasDelDia.value = []
    return
  }
  const { data, error: err } = await insforge.database
    .from('reservas_instalaciones')
    .select('id, instalacion_tipo, fecha, hora_inicio, hora_fin, notas, inquilino_id')
    .eq('proyecto_id', pid)
    .eq('fecha', fecha)
    .order('hora_inicio', { ascending: true })
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    reservasDelDia.value = []
    return
  }
  reservasDelDia.value = (data ?? []) as ReservaInstalacion[]
}

async function guardarReserva() {
  const i = inquilino.value
  if (!i || !puedeGuardar.value) return
  const f = form.value
  if (f.hora_fin <= f.hora_inicio) {
    error.value = 'La hora fin debe ser posterior a la hora de inicio.'
    return
  }
  error.value = ''
  success.value = ''
  guardando.value = true
  try {
    const { error: err } = await insforge.database.from('reservas_instalaciones').insert({
      proyecto_id: i.proyecto_id,
      instalacion_tipo: f.instalacion_tipo,
      inquilino_id: i.id,
      fecha: f.fecha,
      hora_inicio: f.hora_inicio,
      hora_fin: f.hora_fin,
      notas: f.notas || null,
    })
    if (err) throw err
    success.value = 'Reserva guardada correctamente.'
    form.value.notas = ''
    await cargarReservas()
    await cargarReservasDelDia()
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
  await cargarReservasDelDia()
}

async function load() {
  const pid = inquilino.value?.proyecto_id
  if (!pid) return
  await cargarProyectoInstalaciones(pid)
  await cargarReservas()
  await cargarReservasDelDia()
}

watch(fechaVista, () => {
  cargarReservasDelDia()
})

watch(inquilino, (i) => {
  if (i?.proyecto_id) load()
}, { immediate: true })

onMounted(load)
</script>
