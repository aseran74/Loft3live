<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Reserva Corta Estancia</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Disponibilidad por apartamento según inquilinos (vacío, desalojo agosto, reserva específica). Crea reservas de corta estancia con persistencia en InsForge.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <div class="mb-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
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
          <label class="mb-2 block text-sm font-medium">Año de referencia</label>
          <select
            v-model="anioRef"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option v-for="y in añosDisponibles" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold">Disponibilidad y reservas por apartamento</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left">Apartamento</th>
              <th class="px-3 py-2 text-left">Disponibilidad (libre para corta estancia)</th>
              <th class="px-3 py-2 text-left">Reservas corta estancia</th>
              <th class="px-3 py-2 text-right w-32">Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="fila in tablaLofts"
              :key="fila.loft_num"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2 font-medium">Apartamento {{ fila.loft_num }}</td>
              <td class="px-3 py-2">
                <span v-if="fila.disponibilidad.length === 0" class="text-gray-500">Sin disponibilidad</span>
                <ul v-else class="list-inside list-disc space-y-0.5 text-xs">
                  <li v-for="(p, idx) in fila.disponibilidad" :key="idx">
                    {{ formatoRango(p.inicio, p.fin) }}
                  </li>
                </ul>
              </td>
              <td class="px-3 py-2">
                <ul v-if="fila.reservas.length" class="space-y-1 text-xs">
                  <li
                    v-for="r in fila.reservas"
                    :key="r.id"
                    class="flex items-center justify-between gap-2 rounded bg-gray-100 px-2 py-1 dark:bg-gray-700"
                  >
                    <span>{{ formatoRango(r.fecha_inicio, r.fecha_fin) }}{{ r.notas ? ` · ${r.notas}` : '' }}</span>
                    <button
                      type="button"
                      class="text-red-600 hover:underline"
                      @click="eliminarReserva(r)"
                    >
                      Borrar
                    </button>
                  </li>
                </ul>
                <span v-else class="text-gray-500">—</span>
              </td>
              <td class="px-3 py-2 text-right">
                <button
                  type="button"
                  class="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                  :disabled="fila.disponibilidad.length === 0"
                  @click="abrirModalNuevaReserva(fila.loft_num)"
                >
                  Nueva reserva
                </button>
              </td>
            </tr>
            <tr v-if="tablaLofts.length === 0">
              <td colspan="4" class="px-3 py-8 text-center text-gray-500">Selecciona un proyecto.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal nueva reserva -->
    <Teleport to="body">
      <div
        v-if="modalNuevaVisible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        @click.self="cerrarModalNueva"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-800">
          <h3 class="mb-4 text-lg font-semibold">Nueva reserva corta estancia · Apartamento {{ formReserva.loft_num }}</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium">Fecha entrada</label>
              <input
                v-model="formReserva.fecha_inicio"
                type="date"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Fecha salida</label>
              <input
                v-model="formReserva.fecha_fin"
                type="date"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Notas (opcional)</label>
              <input
                v-model.trim="formReserva.notas"
                type="text"
                placeholder="Ej. Cliente, contacto..."
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
          </div>
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold dark:border-gray-600" @click="cerrarModalNueva">
              Cancelar
            </button>
            <button
              type="button"
              class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
              :disabled="guardandoReserva"
              @click="guardarReserva"
            >
              {{ guardandoReserva ? 'Guardando…' : 'Guardar reserva' }}
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

interface ProyectoLite {
  id: string
  nombre_proyecto: string
}

interface LoftInquilino {
  loft_num: number
  inquilino_id: string | null
}

interface InquilinoDatos {
  loft_num: number
  desalojo_agosto: boolean
  es_toda_temporada: boolean
  fecha_inicio_alquiler: string | null
  fecha_fin_alquiler: string | null
}

interface Periodo {
  inicio: string
  fin: string
}

interface ReservaCorta {
  id: string
  proyecto_id: string
  loft_num: number
  fecha_inicio: string
  fecha_fin: string
  notas: string | null
}

const proyectos = ref<ProyectoLite[]>([])
const proyectoId = ref('')
const anioRef = ref(2025)
const añosDisponibles = [2024, 2025, 2026]

const loftsConInquilino = ref<LoftInquilino[]>([])
const inquilinosDatos = ref<InquilinoDatos[]>([])
const reservas = ref<ReservaCorta[]>([])

const error = ref('')
const success = ref('')
const modalNuevaVisible = ref(false)
const guardandoReserva = ref(false)

const formReserva = ref({
  loft_num: 0,
  fecha_inicio: '',
  fecha_fin: '',
  notas: '',
})

function formatoRango(inicio: string, fin: string): string {
  if (!inicio || !fin) return '—'
  const d1 = new Date(inicio + 'T12:00:00')
  const d2 = new Date(fin + 'T12:00:00')
  return `${d1.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${d2.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

function disponibilidadPorLoft(loftNum: number): Periodo[] {
  const anio = anioRef.value
  const inquilino = inquilinosDatos.value.find((i) => i.loft_num === loftNum)
  const tieneInquilino = loftsConInquilino.value.some((l) => l.loft_num === loftNum && l.inquilino_id)
  if (!tieneInquilino) {
    return [{ inicio: `${anio}-01-01`, fin: `${anio}-12-31` }]
  }
  if (!inquilino) return []
  if (inquilino.es_toda_temporada) {
    if (inquilino.desalojo_agosto) {
      return [{ inicio: `${anio}-08-01`, fin: `${anio}-08-31` }]
    }
    return []
  }
  if (inquilino.fecha_inicio_alquiler && inquilino.fecha_fin_alquiler) {
    const finOcup = inquilino.fecha_fin_alquiler
    const inicioLibre = sumarDias(finOcup, 1)
    const yInicio = parseInt(inquilino.fecha_inicio_alquiler.slice(0, 4), 10)
    const finLibre = restarDias(`${yInicio + 1}-${inquilino.fecha_inicio_alquiler.slice(5)}`, 1)
    return [{ inicio: inicioLibre, fin: finLibre }]
  }
  return []
}

function sumarDias(iso: string, dias: number): string {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

function restarDias(iso: string, dias: number): string {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() - dias)
  return d.toISOString().slice(0, 10)
}

const tablaLofts = computed(() => {
  const lofts = loftsConInquilino.value
  if (lofts.length === 0) return []
  return lofts.map((l) => ({
    loft_num: l.loft_num,
    disponibilidad: disponibilidadPorLoft(l.loft_num),
    reservas: reservas.value.filter((r) => r.loft_num === l.loft_num),
  }))
})

function rangoDentroDeDisponibilidad(loftNum: number, inicio: string, fin: string): boolean {
  const periodos = disponibilidadPorLoft(loftNum)
  const ini = new Date(inicio).getTime()
  const end = new Date(fin).getTime()
  for (const p of periodos) {
    const pIni = new Date(p.inicio).getTime()
    const pFin = new Date(p.fin).getTime()
    if (ini >= pIni && end <= pFin) return true
  }
  return false
}

function solapaOtraReserva(loftNum: number, inicio: string, fin: string, excluirId?: string): boolean {
  const ini = new Date(inicio).getTime()
  const end = new Date(fin).getTime()
  for (const r of reservas.value) {
    if (r.loft_num !== loftNum || r.id === excluirId) continue
    const rIni = new Date(r.fecha_inicio).getTime()
    const rFin = new Date(r.fecha_fin).getTime()
    if (ini <= rFin && end >= rIni) return true
  }
  return false
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

async function cargarLoftsYInquilinos() {
  if (!proyectoId.value) return
  const { data: dataFa, error: errFa } = await insforge.database
    .from('facturacion_alquiler')
    .select('loft_num, inquilino_id')
    .eq('proyecto_id', proyectoId.value)
    .order('loft_num', { ascending: true })
  if (errFa) {
    error.value = errFa.message || 'No se pudo cargar facturación'
    return
  }
  loftsConInquilino.value = (dataFa ?? []) as LoftInquilino[]

  const { data: dataInq, error: errInq } = await insforge.database
    .from('inquilinos')
    .select('loft_num, desalojo_agosto, es_toda_temporada, fecha_inicio_alquiler, fecha_fin_alquiler')
    .eq('proyecto_id', proyectoId.value)
  if (errInq) {
    error.value = errInq.message || 'No se pudieron cargar inquilinos'
    return
  }
  inquilinosDatos.value = ((dataInq ?? []) as any[]).map((x) => ({
    loft_num: Number(x.loft_num),
    desalojo_agosto: Boolean(x.desalojo_agosto),
    es_toda_temporada: x.es_toda_temporada !== false,
    fecha_inicio_alquiler: x.fecha_inicio_alquiler || null,
    fecha_fin_alquiler: x.fecha_fin_alquiler || null,
  }))
}

async function cargarReservas() {
  if (!proyectoId.value) return
  const { data, error: err } = await insforge.database
    .from('reservas_corta_estancia')
    .select('id, proyecto_id, loft_num, fecha_inicio, fecha_fin, notas')
    .eq('proyecto_id', proyectoId.value)
    .order('fecha_inicio', { ascending: true })
  if (err) {
    error.value = err.message || 'No se pudieron cargar reservas'
    return
  }
  reservas.value = (data ?? []) as ReservaCorta[]
}

function abrirModalNuevaReserva(loftNum: number) {
  formReserva.value = {
    loft_num: loftNum,
    fecha_inicio: '',
    fecha_fin: '',
    notas: '',
  }
  modalNuevaVisible.value = true
}

function cerrarModalNueva() {
  modalNuevaVisible.value = false
}

async function guardarReserva() {
  error.value = ''
  success.value = ''
  const { loft_num, fecha_inicio, fecha_fin, notas } = formReserva.value
  if (!proyectoId.value || !fecha_inicio || !fecha_fin) {
    error.value = 'Indica fecha de entrada y salida.'
    return
  }
  if (new Date(fecha_fin) < new Date(fecha_inicio)) {
    error.value = 'La fecha de salida debe ser posterior a la de entrada.'
    return
  }
  if (!rangoDentroDeDisponibilidad(loft_num, fecha_inicio, fecha_fin)) {
    error.value = 'El rango de fechas no está dentro de la disponibilidad del apartamento.'
    return
  }
  if (solapaOtraReserva(loft_num, fecha_inicio, fecha_fin)) {
    error.value = 'El rango solapa con otra reserva existente.'
    return
  }
  guardandoReserva.value = true
  try {
    const { error: err } = await insforge.database
      .from('reservas_corta_estancia')
      .insert({
        proyecto_id: proyectoId.value,
        loft_num: Number(loft_num),
        fecha_inicio,
        fecha_fin,
        notas: notas || null,
      })
    if (err) throw err
    success.value = 'Reserva guardada correctamente.'
    cerrarModalNueva()
    await cargarReservas()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error guardando reserva'
  } finally {
    guardandoReserva.value = false
  }
}

async function eliminarReserva(r: ReservaCorta) {
  if (!confirm(`¿Eliminar reserva ${formatoRango(r.fecha_inicio, r.fecha_fin)}?`)) return
  const { error: err } = await insforge.database
    .from('reservas_corta_estancia')
    .delete()
    .eq('id', r.id)
  if (err) {
    error.value = err.message || 'Error eliminando reserva'
    return
  }
  success.value = 'Reserva eliminada.'
  await cargarReservas()
}

watch(
  proyectoId,
  async () => {
    if (proyectoId.value) {
      await cargarLoftsYInquilinos()
      await cargarReservas()
    }
  },
  { immediate: false }
)

onMounted(async () => {
  await cargarProyectos()
  if (proyectoId.value) {
    await cargarLoftsYInquilinos()
    await cargarReservas()
  }
})
</script>
