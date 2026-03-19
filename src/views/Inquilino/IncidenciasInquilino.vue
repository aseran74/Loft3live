<template>
  <InquilinoLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Incidencias</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Reporta incidencias (ruidos, malos olores, frío/calor, etc.) y consulta el estado. El administrador las verá y podrá marcarlas como tratadas o resueltas.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Nueva incidencia</h2>
      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Estás en <strong>{{ inquilino?.proyecto_nombre }}</strong>, Apartamento {{ inquilino?.loft_num }}.
      </p>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
          <select
            v-model="form.tipo"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option value="malos_olores">Malos olores</option>
            <option value="ruidos">Ruidos</option>
            <option value="frio_calor">Frío/calor</option>
            <option value="otros">Otros</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción (opcional)</label>
          <textarea
            v-model.trim="form.descripcion"
            rows="3"
            placeholder="Detalles de la incidencia..."
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <button
            type="button"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            :disabled="guardando || !form.tipo"
            @click="crearIncidencia"
          >
            {{ guardando ? 'Guardando…' : 'Reportar incidencia' }}
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Mis incidencias</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Fecha</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Tipo</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Estado</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="inc in incidencias"
              :key="inc.id"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2 text-gray-600 dark:text-gray-400">{{ formatoFecha(inc.created_at) }}</td>
              <td class="px-3 py-2">
                <span class="rounded px-2 py-0.5 text-xs font-medium" :class="claseTipo(inc.tipo)">{{ etiquetaTipo(inc.tipo) }}</span>
              </td>
              <td class="px-3 py-2">
                <span class="rounded px-2 py-0.5 text-xs font-medium" :class="claseEstado(inc.estado)">{{ etiquetaEstado(inc.estado) }}</span>
              </td>
              <td class="max-w-[280px] truncate px-3 py-2 text-gray-600 dark:text-gray-400" :title="inc.descripcion || ''">{{ inc.descripcion || '—' }}</td>
            </tr>
            <tr v-if="incidencias.length === 0">
              <td colspan="4" class="px-3 py-8 text-center text-gray-500 dark:text-gray-400">No tienes incidencias reportadas.</td>
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
import { ref, onMounted, watch } from 'vue'
import InquilinoLayout from '@/components/layout/InquilinoLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { insforge } from '@/lib/insforge'

const { inquilino, isSessionExpiredError, handleSessionExpired } = useAuth()

const TIPOS: Record<string, string> = {
  malos_olores: 'Malos olores',
  ruidos: 'Ruidos',
  frio_calor: 'Frío/calor',
  otros: 'Otros',
}

const ESTADOS: Record<string, string> = {
  pendiente: 'Pendiente',
  tratado: 'Tratado',
  resuelto: 'Resuelto',
  otro: 'Otro',
}

interface Incidencia {
  id: string
  tipo: string
  estado: string
  descripcion: string | null
  created_at: string
}

const incidencias = ref<Incidencia[]>([])
const error = ref('')
const success = ref('')
const guardando = ref(false)
const form = ref({ tipo: 'ruidos' as string, descripcion: '' })

function etiquetaTipo(tipo: string) {
  return TIPOS[tipo] || tipo
}

function etiquetaEstado(estado: string) {
  return ESTADOS[estado] || estado
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

function claseEstado(estado: string) {
  const clases: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    tratado: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    resuelto: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    otro: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  }
  return clases[estado] || 'bg-gray-100 text-gray-800'
}

function formatoFecha(iso: string) {
  return new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
}

async function cargarIncidencias() {
  const id = inquilino.value?.id
  if (!id) return
  const { data, error: err } = await insforge.database
    .from('incidencias')
    .select('id, tipo, estado, descripcion, created_at')
    .eq('inquilino_id', id)
    .order('created_at', { ascending: false })
  if (err) {
    if (isSessionExpiredError(err)) {
      handleSessionExpired()
      return
    }
    error.value = err.message || 'No se pudieron cargar incidencias'
    return
  }
  incidencias.value = (data ?? []) as Incidencia[]
}

async function crearIncidencia() {
  const i = inquilino.value
  if (!i || !form.value.tipo) return
  error.value = ''
  success.value = ''
  guardando.value = true
  try {
    const { error: err } = await insforge.database.from('incidencias').insert({
      proyecto_id: i.proyecto_id,
      inquilino_id: i.id,
      tipo: form.value.tipo,
      estado: 'pendiente',
      descripcion: form.value.descripcion || null,
    })
    if (err) throw err
    success.value = 'Incidencia reportada. El administrador la revisará.'
    form.value.descripcion = ''
    await cargarIncidencias()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error al reportar'
  } finally {
    guardando.value = false
  }
}

watch(inquilino, (i) => {
  if (i?.id) cargarIncidencias()
}, { immediate: true })

onMounted(cargarIncidencias)
</script>
