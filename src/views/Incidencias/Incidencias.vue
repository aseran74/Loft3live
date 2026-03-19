<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Incidencias</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Los inquilinos pueden reportar incidencias (malos olores, ruidos, frío/calor, otros). Gestiona el estado: tratado, resuelto u otro.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold">Nueva incidencia</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <label class="mb-2 block text-sm font-medium">Inquilino (Apartamento)</label>
          <select
            v-model="form.inquilino_id"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Selecciona inquilino</option>
            <option v-for="i in inquilinosProyecto" :key="i.id" :value="i.id">Apartamento {{ i.loft_num }} · {{ i.nombre }}</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium">Tipo de incidencia</label>
          <select
            v-model="form.tipo"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="malos_olores">Malos olores</option>
            <option value="ruidos">Ruidos</option>
            <option value="frio_calor">Frío/calor</option>
            <option value="otros">Otros</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="mb-2 block text-sm font-medium">Descripción (opcional)</label>
          <textarea
            v-model.trim="form.descripcion"
            rows="2"
            placeholder="Detalles de la incidencia..."
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <button
            type="button"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            :disabled="guardando || !form.proyecto_id || !form.inquilino_id || !form.tipo"
            @click="crearIncidencia"
          >
            {{ guardando ? 'Guardando…' : 'Crear incidencia' }}
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold">Listado de incidencias</h2>
      <div class="mb-4">
        <label class="mb-2 block text-sm font-medium">Filtrar por proyecto</label>
        <select
          v-model="filtroProyectoId"
          class="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
        >
          <option value="">Todos los proyectos</option>
          <option v-for="p in proyectos" :key="p.id" :value="p.id">{{ p.nombre_proyecto }}</option>
        </select>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left">Fecha</th>
              <th class="px-3 py-2 text-left">Proyecto</th>
              <th class="px-3 py-2 text-left">Inquilino</th>
              <th class="px-3 py-2 text-left">Tipo</th>
              <th class="px-3 py-2 text-left">Estado</th>
              <th class="px-3 py-2 text-left">Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="inc in incidenciasFiltradas"
              :key="inc.id"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2 text-gray-600 dark:text-gray-400">{{ formatoFecha(inc.created_at) }}</td>
              <td class="px-3 py-2">{{ nombreProyecto(inc.proyecto_id) }}</td>
              <td class="px-3 py-2">{{ nombreInquilino(inc.inquilino_id) }}</td>
              <td class="px-3 py-2">
                <span class="rounded px-2 py-0.5 text-xs font-medium" :class="claseTipo(inc.tipo)">{{ etiquetaTipo(inc.tipo) }}</span>
              </td>
              <td class="px-3 py-2">
                <select
                  :value="inc.estado"
                  class="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-900"
                  @change="cambiarEstado(inc, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="tratado">Tratado</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="otro">Otro</option>
                </select>
              </td>
              <td class="max-w-[200px] truncate px-3 py-2 text-gray-600 dark:text-gray-400" :title="inc.descripcion || ''">{{ inc.descripcion || '—' }}</td>
            </tr>
            <tr v-if="incidenciasFiltradas.length === 0">
              <td colspan="6" class="px-3 py-8 text-center text-gray-500">No hay incidencias o selecciona otro filtro.</td>
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

interface InquilinoLite {
  id: string
  proyecto_id: string
  loft_num: number
  nombre: string
}

interface Incidencia {
  id: string
  proyecto_id: string
  inquilino_id: string
  tipo: string
  estado: string
  descripcion: string | null
  created_at: string
}

const TIPOS: Record<string, string> = {
  malos_olores: 'Malos olores',
  ruidos: 'Ruidos',
  frio_calor: 'Frío/calor',
  otros: 'Otros',
}

const proyectos = ref<ProyectoLite[]>([])
const inquilinos = ref<InquilinoLite[]>([])
const incidencias = ref<Incidencia[]>([])

const error = ref('')
const success = ref('')
const guardando = ref(false)
const filtroProyectoId = ref('')

const form = ref({
  proyecto_id: '',
  inquilino_id: '',
  tipo: 'ruidos' as string,
  descripcion: '',
})

const inquilinosProyecto = computed(() => {
  if (!form.value.proyecto_id) return []
  return inquilinos.value.filter((i) => i.proyecto_id === form.value.proyecto_id)
})

const incidenciasFiltradas = computed(() => {
  if (!filtroProyectoId.value) return incidencias.value
  return incidencias.value.filter((i) => i.proyecto_id === filtroProyectoId.value)
})

function nombreProyecto(id: string) {
  return proyectos.value.find((p) => p.id === id)?.nombre_proyecto || id
}

function nombreInquilino(id: string) {
  const i = inquilinos.value.find((x) => x.id === id)
  return i ? `Apartamento ${i.loft_num} · ${i.nombre}` : id
}

function formatoFecha(iso: string) {
  return new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
}

function etiquetaTipo(tipo: string) {
  return TIPOS[tipo] || tipo
}

function claseTipo(tipo: string) {
  const clases: Record<string, string> = {
    malos_olores: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    ruidos: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    frio_calor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    otros: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  }
  return clases[tipo] || 'bg-gray-100 text-gray-800'
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

async function cargarIncidencias() {
  const { data, error: err } = await insforge.database
    .from('incidencias')
    .select('id, proyecto_id, inquilino_id, tipo, estado, descripcion, created_at')
    .order('created_at', { ascending: false })
  if (err) {
    error.value = err.message || 'No se pudieron cargar incidencias'
    return
  }
  incidencias.value = (data ?? []) as Incidencia[]
}

async function crearIncidencia() {
  error.value = ''
  success.value = ''
  const { proyecto_id, inquilino_id, tipo, descripcion } = form.value
  if (!proyecto_id || !inquilino_id || !tipo) return
  guardando.value = true
  try {
    const { error: err } = await insforge.database.from('incidencias').insert({
      proyecto_id,
      inquilino_id,
      tipo,
      estado: 'pendiente',
      descripcion: descripcion || null,
    })
    if (err) throw err
    success.value = 'Incidencia creada correctamente.'
    form.value.descripcion = ''
    await cargarIncidencias()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error creando incidencia'
  } finally {
    guardando.value = false
  }
}

async function cambiarEstado(inc: Incidencia, nuevoEstado: string) {
  const { error: err } = await insforge.database
    .from('incidencias')
    .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
    .eq('id', inc.id)
  if (err) {
    error.value = err.message || 'Error actualizando estado'
    return
  }
  success.value = 'Estado actualizado.'
  inc.estado = nuevoEstado
}

watch(
  form,
  (f) => {
    if (f.proyecto_id && f.inquilino_id && inquilinosProyecto.value.every((i) => i.id !== f.inquilino_id)) {
      form.value.inquilino_id = ''
    }
  },
  { deep: true }
)

onMounted(async () => {
  await cargarProyectos()
  await cargarInquilinos()
  await cargarIncidencias()
})
</script>
