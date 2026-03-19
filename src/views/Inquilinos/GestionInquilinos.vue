<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Gestión Inquilinos</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Crea, edita y elimina inquilinos persistentes en InsForge.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
      {{ success }}
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Crear inquilino nuevo</h2>

      <div v-if="resumenProyecto.totalLofts > 0" class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-200">Resumen del proyecto</p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Apartamentos: <strong>{{ resumenProyecto.totalLofts }}</strong> · Alquilados: <strong>{{ resumenProyecto.alquilados }}</strong>
        </p>
      </div>

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

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Apartamento #</label>
          <select
            v-model.number="createForm.loft_num"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option v-for="n in opcionesLoft" :key="n" :value="n">
              Apartamento {{ n }}{{ loftsOcupados.includes(n) ? ' (ocupado)' : '' }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre inquilino</label>
          <select
            v-model="perfilInquilinoSeleccionado"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
            @change="aplicarPerfilInquilinoAlFormulario"
          >
            <option value="">— Seleccionar de perfiles con rol Inquilino —</option>
            <option
              v-for="p in perfilesInquilinos"
              :key="p.email"
              :value="p.email"
            >
              {{ p.nombre?.trim() || p.email }} {{ p.nombre?.trim() ? `(${p.email})` : '' }}
            </option>
          </select>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre (o escribir manual)</label>
          <input
            v-model.trim="createForm.nombre"
            type="text"
            placeholder="Nombre del inquilino"
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

        <div class="flex flex-wrap items-end gap-4">
          <label class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600">
            <input v-model="createForm.es_propietario_tambien" type="checkbox" class="h-4 w-4" />
            Propietario también
          </label>
          <label class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600">
            <input v-model="createForm.facturacion_dual" type="checkbox" class="h-4 w-4" />
            Facturación dual
          </label>
          <label class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600">
            <input v-model="createForm.desalojo_agosto" type="checkbox" class="h-4 w-4" />
            Desalojo agosto
          </label>
        </div>

        <div class="md:col-span-2 lg:col-span-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
          <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-200">Fechas de alquiler</p>
          <div class="flex flex-wrap gap-4">
            <label class="inline-flex items-center gap-2">
              <input v-model="createForm.es_toda_temporada" type="radio" :value="true" class="h-4 w-4" />
              Toda la temporada
            </label>
            <label class="inline-flex items-center gap-2">
              <input v-model="createForm.es_toda_temporada" type="radio" :value="false" class="h-4 w-4" />
              Reserva específica
            </label>
          </div>
          <p v-if="createForm.es_toda_temporada" class="mt-2 text-xs text-gray-600 dark:text-gray-400">
            1 Sep - 31 Jul · {{ createForm.desalojo_agosto ? '11 meses (con desalojo agosto)' : '12 meses' }}
          </p>
          <div v-else class="mt-2 flex items-center gap-2">
            <span v-if="createForm.fecha_inicio_alquiler && createForm.fecha_fin_alquiler" class="text-sm">
              {{ formatoFechaCorta(createForm.fecha_inicio_alquiler) }} - {{ formatoFechaCorta(createForm.fecha_fin_alquiler) }}
            </span>
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium dark:border-gray-600"
              @click="abrirModalFechas(true)"
            >
              {{ createForm.fecha_inicio_alquiler && createForm.fecha_fin_alquiler ? 'Cambiar fechas' : 'Indicar fechas' }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <button
          type="button"
          class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          :disabled="guardandoCreate"
          @click="crearInquilino"
        >
          {{ guardandoCreate ? 'Guardando...' : 'Crear inquilino' }}
        </button>
      </div>
    </div>

    <div class="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div class="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">Filtrar por inquilino</label>
          <input
            v-model.trim="filtroNombre"
            type="text"
            placeholder="Nombre inquilino..."
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
          <div class="text-sm text-gray-500">Total filtrado: {{ inquilinosFiltrados.length }}</div>
        </div>
      </div>

      <div class="max-h-[28rem] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left">Avatar</th>
              <th class="px-3 py-2 text-left">Proyecto</th>
              <th class="px-3 py-2 text-left">Apartamento</th>
              <th class="px-3 py-2 text-left">Inquilino</th>
              <th class="px-3 py-2 text-left">Correo</th>
              <th class="px-3 py-2 text-left">Teléfono</th>
              <th class="px-3 py-2 text-left">Propietario también</th>
              <th class="px-3 py-2 text-left">Fact. dual</th>
              <th class="px-3 py-2 text-left">Desalojo ago.</th>
              <th class="px-3 py-2 text-left">Fechas alquiler</th>
              <th class="px-3 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in inquilinosFiltrados" :key="i.id" class="border-t border-gray-100 dark:border-gray-700">
              <td class="px-3 py-2">
                <img
                  v-if="i.avatar"
                  :src="i.avatar"
                  alt="avatar inquilino"
                  class="h-8 w-8 rounded-full object-cover"
                />
                <div v-else class="h-8 w-8 rounded-full bg-gray-200"></div>
              </td>
              <td class="px-3 py-2">{{ nombreProyecto(i.proyecto_id) }}</td>
              <td class="px-3 py-2">{{ i.loft_num }}</td>
              <td class="px-3 py-2">{{ i.nombre }}</td>
              <td class="px-3 py-2">{{ i.correo || '—' }}</td>
              <td class="px-3 py-2">{{ i.telefono || '—' }}</td>
              <td class="px-3 py-2">
                <span
                  class="rounded-full px-2 py-0.5 text-xs"
                  :class="i.es_propietario_tambien ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
                >
                  {{ i.es_propietario_tambien ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="px-3 py-2">
                <span
                  class="rounded-full px-2 py-0.5 text-xs"
                  :class="i.facturacion_dual ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
                >
                  {{ i.facturacion_dual ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="px-3 py-2">
                <span
                  class="rounded-full px-2 py-0.5 text-xs"
                  :class="i.desalojo_agosto ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'"
                >
                  {{ i.desalojo_agosto ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="max-w-[12rem] px-3 py-2 text-xs">
                {{ textoFechasAlquiler(i) }}
              </td>
              <td class="px-3 py-2">
                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                    @click="abrirModalEdicion(i)"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                    @click="eliminarInquilino(i)"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="inquilinosFiltrados.length === 0">
              <td colspan="11" class="px-3 py-8 text-center text-gray-500">
                No hay inquilinos con ese filtro.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="modalEditarAbierto"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        @click.self="cerrarModalEdicion"
      >
        <div class="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-800">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">Editar inquilino</h3>
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
            <div>
              <label class="mb-2 block text-sm font-medium">Apartamento #</label>
              <input v-model.number="editForm.loft_num" type="number" min="1" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" />
            </div>
            <div class="md:col-span-2">
              <label class="mb-2 block text-sm font-medium">Inquilino (desde perfiles con rol Inquilino)</label>
              <select
                v-model="perfilInquilinoSeleccionadoEdit"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
                @change="aplicarPerfilInquilinoAlFormularioEdicion"
              >
                <option value="">— Seleccionar de perfiles —</option>
                <option
                  v-for="p in perfilesInquilinos"
                  :key="p.email"
                  :value="p.email"
                >
                  {{ p.nombre?.trim() || p.email }} {{ p.nombre?.trim() ? `(${p.email})` : '' }}
                </option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Nombre inquilino</label>
              <input v-model.trim="editForm.nombre" type="text" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" placeholder="Nombre del inquilino" />
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
            <div class="md:col-span-2 flex flex-wrap gap-4">
              <label class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600">
                <input v-model="editForm.es_propietario_tambien" type="checkbox" class="h-4 w-4" />
                Propietario también
              </label>
              <label class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600">
                <input v-model="editForm.facturacion_dual" type="checkbox" class="h-4 w-4" />
                Facturación dual
              </label>
              <label class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600">
                <input v-model="editForm.desalojo_agosto" type="checkbox" class="h-4 w-4" />
                Desalojo agosto
              </label>
            </div>
            <div class="md:col-span-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
              <p class="mb-3 text-sm font-medium">Fechas de alquiler</p>
              <div class="flex flex-wrap gap-4">
                <label class="inline-flex items-center gap-2">
                  <input v-model="editForm.es_toda_temporada" type="radio" :value="true" class="h-4 w-4" />
                  Toda la temporada
                </label>
                <label class="inline-flex items-center gap-2">
                  <input v-model="editForm.es_toda_temporada" type="radio" :value="false" class="h-4 w-4" />
                  Reserva específica
                </label>
              </div>
              <p v-if="editForm.es_toda_temporada" class="mt-2 text-xs text-gray-600 dark:text-gray-400">
                1 Sep - 31 Jul · {{ editForm.desalojo_agosto ? '11 meses' : '12 meses' }}
              </p>
              <div v-else class="mt-2 flex items-center gap-2">
                <span v-if="editForm.fecha_inicio_alquiler && editForm.fecha_fin_alquiler" class="text-sm">
                  {{ formatoFechaCorta(editForm.fecha_inicio_alquiler) }} - {{ formatoFechaCorta(editForm.fecha_fin_alquiler) }}
                </span>
                <button type="button" class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium dark:border-gray-600" @click="abrirModalFechas(false)">
                  {{ editForm.fecha_inicio_alquiler && editForm.fecha_fin_alquiler ? 'Cambiar fechas' : 'Indicar fechas' }}
                </button>
              </div>
            </div>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700" @click="cerrarModalEdicion">
              Cancelar
            </button>
            <button type="button" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60" :disabled="guardandoEdit" @click="guardarEdicionInquilino">
              {{ guardandoEdit ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal fechas reserva específica -->
    <Teleport to="body">
      <div
        v-if="modalFechasVisible"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
        @click.self="cerrarModalFechas"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-800">
          <h3 class="mb-4 text-lg font-semibold">Fechas reserva específica</h3>
          <p class="mb-3 text-xs text-gray-500">Ejemplo: del 1 de octubre al 31 de diciembre</p>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium">Fecha inicio</label>
              <input
                v-model="tempFechasInicio"
                type="date"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Fecha fin</label>
              <input
                v-model="tempFechasFin"
                type="date"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
          </div>
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold dark:border-gray-600" @click="cerrarModalFechas">
              Cancelar
            </button>
            <button type="button" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600" @click="guardarModalFechas">
              Aplicar fechas
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
import { useAuth } from '@/composables/useAuth'
import { insforge } from '@/lib/insforge'

const { isSessionExpiredError, handleSessionExpired } = useAuth()

interface ProyectoLite {
  id: string
  nombre_proyecto: string
}

interface Inquilino {
  id: string
  proyecto_id: string
  loft_num: number
  nombre: string
  telefono?: string | null
  correo?: string | null
  avatar?: string | null
  es_propietario_tambien?: boolean
  facturacion_dual?: boolean
  desalojo_agosto?: boolean
  es_toda_temporada?: boolean
  fecha_inicio_alquiler?: string | null
  fecha_fin_alquiler?: string | null
}

interface InquilinoForm {
  proyecto_id: string
  loft_num: number
  nombre: string
  telefono: string
  correo: string
  avatar: string
  es_propietario_tambien: boolean
  facturacion_dual: boolean
  desalojo_agosto: boolean
  es_toda_temporada: boolean
  fecha_inicio_alquiler: string
  fecha_fin_alquiler: string
}

interface PerfilInquilino {
  email: string
  nombre: string | null
  telefono: string | null
}

const proyectos = ref<ProyectoLite[]>([])
const inquilinos = ref<Inquilino[]>([])
const perfilesInquilinos = ref<PerfilInquilino[]>([])
const perfilInquilinoSeleccionado = ref('')
const perfilInquilinoSeleccionadoEdit = ref('')
const error = ref('')
const success = ref('')
const guardandoCreate = ref(false)
const guardandoEdit = ref(false)

const filtroNombre = ref('')
const filtroProyectoId = ref('')

const modalEditarAbierto = ref(false)
const inquilinoEditandoId = ref<string | null>(null)
const modalFechasVisible = ref(false)
const modalFechasParaCreate = ref(true)
const tempFechasInicio = ref('')
const tempFechasFin = ref('')

const resumenProyecto = ref({ totalLofts: 0, alquilados: 0 })

const createForm = ref<InquilinoForm>({
  proyecto_id: '',
  loft_num: 1,
  nombre: '',
  telefono: '',
  correo: '',
  avatar: '',
  es_propietario_tambien: false,
  facturacion_dual: false,
  desalojo_agosto: false,
  es_toda_temporada: true,
  fecha_inicio_alquiler: '',
  fecha_fin_alquiler: '',
})

const loftsOcupados = computed(() => {
  const pid = createForm.value.proyecto_id
  if (!pid) return []
  return inquilinos.value.filter((i) => i.proyecto_id === pid).map((i) => i.loft_num)
})

const opcionesLoft = computed(() => {
  const n = resumenProyecto.value.totalLofts
  return n > 0 ? Array.from({ length: n }, (_, i) => i + 1) : []
})

const editForm = ref<InquilinoForm>({
  proyecto_id: '',
  loft_num: 1,
  nombre: '',
  telefono: '',
  correo: '',
  avatar: '',
  es_propietario_tambien: false,
  facturacion_dual: false,
  desalojo_agosto: false,
  es_toda_temporada: true,
  fecha_inicio_alquiler: '',
  fecha_fin_alquiler: '',
})

const inquilinosFiltrados = computed(() => {
  const nombre = filtroNombre.value.trim().toLowerCase()
  const proyectoId = filtroProyectoId.value
  return inquilinos.value.filter((i) => {
    const matchNombre = !nombre || i.nombre.toLowerCase().includes(nombre)
    const matchProyecto = !proyectoId || i.proyecto_id === proyectoId
    return matchNombre && matchProyecto
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
  perfilInquilinoSeleccionado.value = ''
  createForm.value = {
    proyecto_id: proyectos.value[0]?.id || '',
    loft_num: 1,
    nombre: '',
    telefono: '',
    correo: '',
    avatar: '',
    es_propietario_tambien: false,
    facturacion_dual: false,
    desalojo_agosto: false,
    es_toda_temporada: true,
    fecha_inicio_alquiler: '',
    fecha_fin_alquiler: '',
  }
}

function formatoFechaCorta(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function textoFechasAlquiler(i: Inquilino): string {
  if (i.es_toda_temporada) {
    const meses = i.desalojo_agosto ? 11 : 12
    return `Toda (1 Sep - 31 Jul) · ${meses} meses`
  }
  if (i.fecha_inicio_alquiler && i.fecha_fin_alquiler) {
    return `Espec.: ${formatoFechaCorta(i.fecha_inicio_alquiler)} - ${formatoFechaCorta(i.fecha_fin_alquiler)}`
  }
  return 'Espec. (sin fechas)'
}

function abrirModalFechas(paraCreate: boolean) {
  modalFechasParaCreate.value = paraCreate
  const form = paraCreate ? createForm.value : editForm.value
  tempFechasInicio.value = form.fecha_inicio_alquiler || ''
  tempFechasFin.value = form.fecha_fin_alquiler || ''
  modalFechasVisible.value = true
}

function cerrarModalFechas() {
  modalFechasVisible.value = false
}

function guardarModalFechas() {
  if (modalFechasParaCreate.value) {
    createForm.value.fecha_inicio_alquiler = tempFechasInicio.value
    createForm.value.fecha_fin_alquiler = tempFechasFin.value
  } else {
    editForm.value.fecha_inicio_alquiler = tempFechasInicio.value
    editForm.value.fecha_fin_alquiler = tempFechasFin.value
  }
  modalFechasVisible.value = false
}

function validarForm(form: InquilinoForm): string | null {
  if (!form.proyecto_id) return 'Selecciona un proyecto'
  if (!Number.isFinite(form.loft_num) || form.loft_num < 1) return 'El número de apartamento debe ser mayor o igual a 1'
  if (!form.nombre.trim()) return 'Introduce el nombre del inquilino'
  if (form.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) return 'El correo no es válido'
  return null
}

async function cargarProyectos() {
  const { data, error: err } = await insforge.database
    .from('proyectos')
    .select('id, nombre_proyecto')
    .order('created_at', { ascending: false })

  if (err) {
    if (isSessionExpiredError(err)) {
      handleSessionExpired()
      return
    }
    error.value = err.message || 'No se pudieron cargar proyectos'
    return
  }

  proyectos.value = (data || []) as ProyectoLite[]
  if (!createForm.value.proyecto_id && proyectos.value.length > 0) {
    createForm.value.proyecto_id = proyectos.value[0].id
  }
}

async function cargarInquilinos() {
  const { data, error: err } = await insforge.database
    .from('inquilinos')
    .select()
    .order('loft_num', { ascending: true })

  if (err) {
    if (isSessionExpiredError(err)) {
      handleSessionExpired()
      return
    }
    error.value = err.message || 'No se pudieron cargar inquilinos'
    return
  }

  inquilinos.value = (data || []) as Inquilino[]
}

async function cargarResumenProyecto() {
  const pid = createForm.value.proyecto_id
  if (!pid) {
    resumenProyecto.value = { totalLofts: 0, alquilados: 0 }
    return
  }
  const { data, error: err } = await insforge.database
    .from('facturacion_alquiler')
    .select('loft_num')
    .eq('proyecto_id', pid)
  if (err) {
    resumenProyecto.value = { totalLofts: 0, alquilados: 0 }
    return
  }
  const totalLofts = (data || []).length
  const alquilados = inquilinos.value.filter((i) => i.proyecto_id === pid).length
  resumenProyecto.value = { totalLofts, alquilados }
  if (totalLofts > 0 && (!createForm.value.loft_num || createForm.value.loft_num > totalLofts)) {
    createForm.value.loft_num = 1
  }
}

async function cargarPerfilesInquilinos() {
  const { data, error: err } = await insforge.database
    .from('perfiles')
    .select('email, nombre, telefono')
    .eq('rol', 'inquilino')
    .order('email', { ascending: true })
  if (err) {
    if (isSessionExpiredError(err)) {
      handleSessionExpired()
      return
    }
    return
  }
  perfilesInquilinos.value = (data || []).map((r: { email?: string; nombre?: string | null; telefono?: string | null }) => ({
    email: (r.email ?? '').trim().toLowerCase(),
    nombre: r.nombre?.trim() || null,
    telefono: r.telefono?.trim() || null,
  })).filter((p) => p.email)
}

function aplicarPerfilInquilinoAlFormulario() {
  const email = perfilInquilinoSeleccionado.value
  if (!email) return
  const p = perfilesInquilinos.value.find((x) => x.email === email)
  if (!p) return
  createForm.value.nombre = p.nombre?.trim() || p.email
  createForm.value.correo = p.email
  createForm.value.telefono = p.telefono ?? ''
}

function aplicarPerfilInquilinoAlFormularioEdicion() {
  const email = perfilInquilinoSeleccionadoEdit.value
  if (!email) return
  const p = perfilesInquilinos.value.find((x) => x.email === email)
  if (!p) return
  editForm.value.nombre = p.nombre?.trim() || p.email
  editForm.value.correo = p.email
  editForm.value.telefono = p.telefono ?? ''
}

watch(
  () => createForm.value.proyecto_id,
  () => {
    cargarResumenProyecto()
  }
)

async function crearInquilino() {
  limpiarMensajes()
  const errMsg = validarForm(createForm.value)
  if (errMsg) {
    error.value = errMsg
    return
  }

  guardandoCreate.value = true
  try {
    const { error: err } = await insforge.database
      .from('inquilinos')
      .insert({
        proyecto_id: createForm.value.proyecto_id,
        loft_num: Number(createForm.value.loft_num),
        nombre: createForm.value.nombre.trim(),
        telefono: createForm.value.telefono.trim() || null,
        correo: createForm.value.correo.trim() || null,
        avatar: createForm.value.avatar.trim() || null,
        es_propietario_tambien: createForm.value.es_propietario_tambien,
        facturacion_dual: createForm.value.facturacion_dual,
        desalojo_agosto: createForm.value.desalojo_agosto,
        es_toda_temporada: createForm.value.es_toda_temporada,
        fecha_inicio_alquiler: createForm.value.fecha_inicio_alquiler || null,
        fecha_fin_alquiler: createForm.value.fecha_fin_alquiler || null,
      })

    if (err) throw new Error(err.message || 'Error creando inquilino')

    success.value = 'Inquilino creado correctamente.'
    resetCreateForm()
    await cargarInquilinos()
    await cargarResumenProyecto()
  } catch (e) {
    if (isSessionExpiredError(e)) {
      handleSessionExpired()
      return
    }
    error.value = e instanceof Error ? e.message : 'Error guardando inquilino'
  } finally {
    guardandoCreate.value = false
  }
}

function abrirModalEdicion(inquilino: Inquilino) {
  limpiarMensajes()
  inquilinoEditandoId.value = inquilino.id
  editForm.value = {
    proyecto_id: inquilino.proyecto_id,
    loft_num: inquilino.loft_num,
    nombre: inquilino.nombre,
    telefono: inquilino.telefono || '',
    correo: inquilino.correo || '',
    avatar: inquilino.avatar || '',
    es_propietario_tambien: Boolean(inquilino.es_propietario_tambien),
    facturacion_dual: Boolean(inquilino.facturacion_dual),
    desalojo_agosto: Boolean(inquilino.desalojo_agosto),
    es_toda_temporada: inquilino.es_toda_temporada !== false,
    fecha_inicio_alquiler: inquilino.fecha_inicio_alquiler || '',
    fecha_fin_alquiler: inquilino.fecha_fin_alquiler || '',
  }
  const correoNorm = (inquilino.correo ?? '').trim().toLowerCase()
  perfilInquilinoSeleccionadoEdit.value = perfilesInquilinos.value.some((p) => p.email === correoNorm) ? correoNorm : ''
  modalEditarAbierto.value = true
}

function cerrarModalEdicion() {
  modalEditarAbierto.value = false
  inquilinoEditandoId.value = null
  perfilInquilinoSeleccionadoEdit.value = ''
}

async function guardarEdicionInquilino() {
  limpiarMensajes()
  if (!inquilinoEditandoId.value) return

  const errMsg = validarForm(editForm.value)
  if (errMsg) {
    error.value = errMsg
    return
  }

  guardandoEdit.value = true
  try {
    const { error: err } = await insforge.database
      .from('inquilinos')
      .update({
        proyecto_id: editForm.value.proyecto_id,
        loft_num: Number(editForm.value.loft_num),
        nombre: editForm.value.nombre.trim(),
        telefono: editForm.value.telefono.trim() || null,
        correo: editForm.value.correo.trim() || null,
        avatar: editForm.value.avatar.trim() || null,
        es_propietario_tambien: editForm.value.es_propietario_tambien,
        facturacion_dual: editForm.value.facturacion_dual,
        desalojo_agosto: editForm.value.desalojo_agosto,
        es_toda_temporada: editForm.value.es_toda_temporada,
        fecha_inicio_alquiler: editForm.value.fecha_inicio_alquiler || null,
        fecha_fin_alquiler: editForm.value.fecha_fin_alquiler || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', inquilinoEditandoId.value)

    if (err) throw new Error(err.message || 'Error actualizando inquilino')

    success.value = 'Inquilino actualizado correctamente.'
    cerrarModalEdicion()
    await cargarInquilinos()
  } catch (e) {
    if (isSessionExpiredError(e)) {
      handleSessionExpired()
      return
    }
    error.value = e instanceof Error ? e.message : 'Error guardando cambios'
  } finally {
    guardandoEdit.value = false
  }
}

async function eliminarInquilino(inquilino: Inquilino) {
  limpiarMensajes()
  const confirmado = confirm(`¿Seguro que quieres eliminar "${inquilino.nombre}"?`)
  if (!confirmado) return

  const { error: err } = await insforge.database
    .from('inquilinos')
    .delete()
    .eq('id', inquilino.id)

  if (err) {
    if (isSessionExpiredError(err)) {
      handleSessionExpired()
      return
    }
    error.value = err.message || 'Error eliminando inquilino'
    return
  }

  success.value = 'Inquilino eliminado correctamente.'
  await cargarInquilinos()
}

onMounted(async () => {
  await cargarProyectos()
  await cargarPerfilesInquilinos()
  resetCreateForm()
  await cargarInquilinos()
  await cargarResumenProyecto()
})
</script>
