<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Gestión Compradores</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Crea, edita y elimina compradores persistentes en InsForge.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
      {{ success }}
    </div>

    <!-- Recopilatorio tickets por proyecto -->
    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Tickets por proyecto</h2>
      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Tickets en proyecto = <em>num_tickets</em> del proyecto (si está definido); si no, se usa <em>num_lofts</em>. Tickets comprados = suma de tickets de los compradores. Deben coincidir.
      </p>
      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Proyecto</th>
              <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Tickets en proyecto</th>
              <th class="px-3 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Tickets comprados</th>
              <th class="px-3 py-2 text-center font-medium text-gray-700 dark:text-gray-300">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in resumenTickets"
              :key="r.proyecto_id"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2">{{ r.nombre_proyecto }}</td>
              <td class="px-3 py-2 text-right">{{ r.tickets_en_proyecto }}</td>
              <td class="px-3 py-2 text-right">{{ r.tickets_comprados }}</td>
              <td class="px-3 py-2 text-center">
                <span
                  :class="r.coincide ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'"
                  class="rounded-full px-2 py-0.5 text-xs font-medium"
                >
                  {{ r.coincide ? 'Coincide' : 'No coincide' }}
                </span>
              </td>
            </tr>
            <tr v-if="resumenTickets.length === 0">
              <td colspan="4" class="px-3 py-6 text-center text-gray-500">No hay proyectos.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Crear nuevo comprador -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Crear comprador nuevo</h2>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Proyecto</label>
          <select
            v-model="createForm.proyecto_id"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Selecciona un proyecto</option>
            <option v-for="p in proyectos" :key="p.id" :value="p.id">
              {{ p.nombre_proyecto }}
            </option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Comprador (desde perfiles con rol Comprador)</label>
          <select
            v-model="perfilCompradorSeleccionado"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
            @change="aplicarPerfilCompradorAlFormulario"
          >
            <option value="">— Seleccionar de perfiles —</option>
            <option
              v-for="p in perfilesCompradores"
              :key="p.email"
              :value="p.email"
            >
              {{ p.nombre?.trim() || p.email }} {{ p.nombre?.trim() ? `(${p.email})` : '' }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre comprador</label>
          <input
            v-model.trim="createForm.nombre"
            type="text"
            placeholder="Comprador La Granja 1"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Tickets</label>
          <input
            v-model.number="createForm.tickets"
            type="number"
            min="0"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Teléfono</label>
          <input
            v-model.trim="createForm.telefono"
            type="text"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Correo</label>
          <input
            v-model.trim="createForm.correo"
            type="email"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Avatar (URL)</label>
          <input
            v-model.trim="createForm.avatar"
            type="url"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>

        <div class="flex items-end">
          <label class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600">
            <input v-model="createForm.es_inquilino" type="checkbox" class="h-4 w-4" />
            Es también inquilino
          </label>
        </div>
      </div>

      <div class="mt-4">
        <button
          type="button"
          class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          :disabled="guardandoCreate"
          @click="crearComprador"
        >
          {{ guardandoCreate ? 'Guardando...' : 'Crear comprador' }}
        </button>
      </div>
    </div>

    <!-- Listado + filtros -->
    <div class="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Filtrar por comprador</label>
          <input
            v-model.trim="filtroNombre"
            type="text"
            placeholder="Nombre comprador..."
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Filtrar por proyecto</label>
          <select
            v-model="filtroProyectoId"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Todos los proyectos</option>
            <option v-for="p in proyectos" :key="p.id" :value="p.id">
              {{ p.nombre_proyecto }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <div class="text-sm text-gray-500">Total filtrado: {{ compradoresFiltrados.length }}</div>
        </div>
      </div>

      <div class="max-h-[28rem] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left">Avatar</th>
              <th class="px-3 py-2 text-left">Proyecto</th>
              <th class="px-3 py-2 text-left">Comprador</th>
              <th class="px-3 py-2 text-left">Correo</th>
              <th class="px-3 py-2 text-left">Teléfono</th>
              <th class="px-3 py-2 text-left">Inquilino</th>
              <th class="px-3 py-2 text-right">Tickets</th>
              <th class="px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in compradoresFiltrados" :key="c.id" class="border-t border-gray-100 dark:border-gray-700">
              <td class="px-3 py-2">
                <img
                  v-if="c.avatar"
                  :src="c.avatar"
                  alt="avatar comprador"
                  class="h-8 w-8 rounded-full object-cover"
                />
                <div v-else class="h-8 w-8 rounded-full bg-gray-200"></div>
              </td>
              <td class="px-3 py-2">{{ nombreProyecto(c.proyecto_id) }}</td>
              <td class="px-3 py-2">{{ c.nombre }}</td>
              <td class="px-3 py-2">{{ c.correo || '—' }}</td>
              <td class="px-3 py-2">{{ c.telefono || '—' }}</td>
              <td class="px-3 py-2">
                <span
                  class="rounded-full px-2 py-0.5 text-xs"
                  :class="c.es_inquilino ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
                >
                  {{ c.es_inquilino ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="px-3 py-2 text-right">{{ c.tickets }}</td>
              <td class="px-3 py-2">
                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                    @click="abrirModalEdicion(c)"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                    @click="eliminarComprador(c)"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="compradoresFiltrados.length === 0">
              <td colspan="8" class="px-3 py-8 text-center text-gray-500">
                No hay compradores con ese filtro.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal editar -->
    <Teleport to="body">
      <div
        v-if="modalEditarAbierto"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        @click.self="cerrarModalEdicion"
      >
        <div class="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-800">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Editar comprador</h3>
            <button type="button" class="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700" @click="cerrarModalEdicion">
              ✕
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium">Proyecto</label>
              <select v-model="editForm.proyecto_id" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900">
                <option value="">Selecciona un proyecto</option>
                <option v-for="p in proyectos" :key="p.id" :value="p.id">{{ p.nombre_proyecto }}</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="mb-2 block text-sm font-medium">Comprador (desde perfiles con rol Comprador)</label>
              <select
                v-model="perfilCompradorSeleccionadoEdit"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                @change="aplicarPerfilCompradorAlFormularioEdicion"
              >
                <option value="">— Seleccionar de perfiles —</option>
                <option
                  v-for="p in perfilesCompradores"
                  :key="p.email"
                  :value="p.email"
                >
                  {{ p.nombre?.trim() || p.email }} {{ p.nombre?.trim() ? `(${p.email})` : '' }}
                </option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Nombre comprador</label>
              <input v-model.trim="editForm.nombre" type="text" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" placeholder="Nombre del comprador" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Tickets</label>
              <input v-model.number="editForm.tickets" type="number" min="0" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Teléfono</label>
              <input v-model.trim="editForm.telefono" type="text" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Correo</label>
              <input v-model.trim="editForm.correo" type="email" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Avatar (URL)</label>
              <input v-model.trim="editForm.avatar" type="url" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" />
            </div>
            <div class="md:col-span-2">
              <label class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600">
                <input v-model="editForm.es_inquilino" type="checkbox" class="h-4 w-4" />
                Es también inquilino
              </label>
            </div>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700" @click="cerrarModalEdicion">
              Cancelar
            </button>
            <button type="button" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60" :disabled="guardandoEdit" @click="guardarEdicionComprador">
              {{ guardandoEdit ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </admin-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { insforge } from '@/lib/insforge'

interface ProyectoLite {
  id: string
  nombre_proyecto: string
  num_lofts: number
  num_tickets: number | null
}

interface PerfilComprador {
  email: string
  nombre: string | null
  telefono: string | null
}

interface Comprador {
  id: string
  proyecto_id: string
  nombre: string
  tickets: number
  telefono?: string | null
  correo?: string | null
  avatar?: string | null
  es_inquilino?: boolean
}

interface CompradorForm {
  proyecto_id: string
  nombre: string
  tickets: number
  telefono: string
  correo: string
  avatar: string
  es_inquilino: boolean
}

const proyectos = ref<ProyectoLite[]>([])
const compradores = ref<Comprador[]>([])
const perfilesCompradores = ref<PerfilComprador[]>([])
const perfilCompradorSeleccionado = ref('')
const perfilCompradorSeleccionadoEdit = ref('')
const error = ref('')
const success = ref('')
const guardandoCreate = ref(false)
const guardandoEdit = ref(false)

const filtroNombre = ref('')
const filtroProyectoId = ref('')

const modalEditarAbierto = ref(false)
const compradorEditandoId = ref<string | null>(null)

const createForm = ref<CompradorForm>({
  proyecto_id: '',
  nombre: '',
  tickets: 0,
  telefono: '',
  correo: '',
  avatar: '',
  es_inquilino: false,
})

const editForm = ref<CompradorForm>({
  proyecto_id: '',
  nombre: '',
  tickets: 0,
  telefono: '',
  correo: '',
  avatar: '',
  es_inquilino: false,
})

const compradoresFiltrados = computed(() => {
  const nombre = filtroNombre.value.trim().toLowerCase()
  const proyectoId = filtroProyectoId.value
  return compradores.value.filter((c) => {
    const matchNombre = !nombre || c.nombre.toLowerCase().includes(nombre)
    const matchProyecto = !proyectoId || c.proyecto_id === proyectoId
    return matchNombre && matchProyecto
  })
})

const resumenTickets = computed(() => {
  return proyectos.value.map((p) => {
    const ticketsComprados = compradores.value
      .filter((c) => c.proyecto_id === p.id)
      .reduce((sum, c) => sum + (Number(c.tickets) || 0), 0)
    const ticketsEnProyecto = p.num_tickets != null ? Number(p.num_tickets) : (Number(p.num_lofts) || 0)
    return {
      proyecto_id: p.id,
      nombre_proyecto: p.nombre_proyecto,
      tickets_en_proyecto: ticketsEnProyecto,
      tickets_comprados: ticketsComprados,
      coincide: Number(ticketsComprados) === Number(ticketsEnProyecto),
    }
  })
})

function limpiarMensajes() {
  error.value = ''
  success.value = ''
}

function nombreProyecto(proyectoId: string): string {
  return proyectos.value.find((p) => p.id === proyectoId)?.nombre_proyecto || 'Sin proyecto'
}

function resetCreateForm() {
  perfilCompradorSeleccionado.value = ''
  createForm.value = {
    proyecto_id: proyectos.value[0]?.id || '',
    nombre: '',
    tickets: 0,
    telefono: '',
    correo: '',
    avatar: '',
    es_inquilino: false,
  }
}

function validarForm(form: CompradorForm): string | null {
  if (!form.proyecto_id) return 'Selecciona un proyecto'
  if (!form.nombre.trim()) return 'Introduce el nombre del comprador'
  if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) return 'El correo no es válido'
  if (!Number.isFinite(form.tickets) || form.tickets < 0) return 'Los tickets deben ser un número válido mayor o igual a 0'
  return null
}

async function cargarProyectos() {
  const { data, error: err } = await insforge.database
    .from('proyectos')
    .select('id, nombre_proyecto, num_lofts, num_tickets')
    .order('created_at', { ascending: false })

  if (err) {
    error.value = err.message || 'No se pudieron cargar proyectos'
    return
  }

  proyectos.value = (data || []).map((r: { id: string; nombre_proyecto: string; num_lofts?: number; num_tickets?: number | null }) => ({
    id: r.id,
    nombre_proyecto: r.nombre_proyecto,
    num_lofts: r.num_lofts ?? 0,
    num_tickets: r.num_tickets != null ? Number(r.num_tickets) : null,
  }))
  if (!createForm.value.proyecto_id && proyectos.value.length > 0) {
    createForm.value.proyecto_id = proyectos.value[0].id
  }
}

async function cargarPerfilesCompradores() {
  const { data, error: err } = await insforge.database
    .from('perfiles')
    .select('email, nombre, telefono')
    .eq('rol', 'comprador')
    .order('email', { ascending: true })
  if (err) return
  perfilesCompradores.value = (data || []).map((r: { email?: string; nombre?: string | null; telefono?: string | null }) => ({
    email: (r.email ?? '').trim().toLowerCase(),
    nombre: r.nombre?.trim() || null,
    telefono: r.telefono?.trim() || null,
  })).filter((p) => p.email)
}

function aplicarPerfilCompradorAlFormulario() {
  const email = perfilCompradorSeleccionado.value
  if (!email) return
  const p = perfilesCompradores.value.find((x) => x.email === email)
  if (!p) return
  createForm.value.nombre = p.nombre?.trim() || p.email
  createForm.value.correo = p.email
  createForm.value.telefono = p.telefono ?? ''
}

function aplicarPerfilCompradorAlFormularioEdicion() {
  const email = perfilCompradorSeleccionadoEdit.value
  if (!email) return
  const p = perfilesCompradores.value.find((x) => x.email === email)
  if (!p) return
  editForm.value.nombre = p.nombre?.trim() || p.email
  editForm.value.correo = p.email
  editForm.value.telefono = p.telefono ?? ''
}

async function cargarCompradores() {
  const { data, error: err } = await insforge.database
    .from('compradores')
    .select()
    .order('created_at', { ascending: false })

  if (err) {
    error.value = err.message || 'No se pudieron cargar compradores'
    return
  }

  compradores.value = (data || []) as Comprador[]
}

async function crearComprador() {
  limpiarMensajes()
  const errMsg = validarForm(createForm.value)
  if (errMsg) {
    error.value = errMsg
    return
  }

  guardandoCreate.value = true
  try {
    const { error: err } = await insforge.database
      .from('compradores')
      .insert({
        proyecto_id: createForm.value.proyecto_id,
        nombre: createForm.value.nombre.trim(),
        tickets: Number(createForm.value.tickets),
        telefono: createForm.value.telefono.trim() || null,
        correo: createForm.value.correo.trim() || null,
        avatar: createForm.value.avatar.trim() || null,
        es_inquilino: createForm.value.es_inquilino,
      })

    if (err) throw new Error(err.message || 'Error creando comprador')

    success.value = 'Comprador creado correctamente.'
    resetCreateForm()
    await cargarCompradores()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error guardando comprador'
  } finally {
    guardandoCreate.value = false
  }
}

function abrirModalEdicion(comprador: Comprador) {
  limpiarMensajes()
  compradorEditandoId.value = comprador.id
  editForm.value = {
    proyecto_id: comprador.proyecto_id,
    nombre: comprador.nombre,
    tickets: comprador.tickets,
    telefono: comprador.telefono || '',
    correo: comprador.correo || '',
    avatar: comprador.avatar || '',
    es_inquilino: Boolean(comprador.es_inquilino),
  }
  const correoNorm = (comprador.correo ?? '').trim().toLowerCase()
  perfilCompradorSeleccionadoEdit.value = perfilesCompradores.value.some((p) => p.email === correoNorm) ? correoNorm : ''
  modalEditarAbierto.value = true
}

function cerrarModalEdicion() {
  modalEditarAbierto.value = false
  compradorEditandoId.value = null
  perfilCompradorSeleccionadoEdit.value = ''
}

async function guardarEdicionComprador() {
  limpiarMensajes()
  if (!compradorEditandoId.value) return

  const errMsg = validarForm(editForm.value)
  if (errMsg) {
    error.value = errMsg
    return
  }

  guardandoEdit.value = true
  try {
    const { error: err } = await insforge.database
      .from('compradores')
      .update({
        proyecto_id: editForm.value.proyecto_id,
        nombre: editForm.value.nombre.trim(),
        tickets: Number(editForm.value.tickets),
        telefono: editForm.value.telefono.trim() || null,
        correo: editForm.value.correo.trim() || null,
        avatar: editForm.value.avatar.trim() || null,
        es_inquilino: editForm.value.es_inquilino,
        updated_at: new Date().toISOString(),
      })
      .eq('id', compradorEditandoId.value)

    if (err) throw new Error(err.message || 'Error actualizando comprador')

    success.value = 'Comprador actualizado correctamente.'
    cerrarModalEdicion()
    await cargarCompradores()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error guardando cambios'
  } finally {
    guardandoEdit.value = false
  }
}

async function eliminarComprador(comprador: Comprador) {
  limpiarMensajes()
  const confirmado = confirm(`¿Seguro que quieres eliminar "${comprador.nombre}"?`)
  if (!confirmado) return

  const { error: err } = await insforge.database
    .from('compradores')
    .delete()
    .eq('id', comprador.id)

  if (err) {
    error.value = err.message || 'Error eliminando comprador'
    return
  }

  success.value = 'Comprador eliminado correctamente.'
  await cargarCompradores()
}

onMounted(async () => {
  await cargarProyectos()
  await cargarPerfilesCompradores()
  resetCreateForm()
  await cargarCompradores()
})
</script>
