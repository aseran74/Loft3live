<template>
  <InquilinoLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Utilizar puntos</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Solicita usar el loft de otro inquilino eligiendo un periodo activo. Filtra por localidad y consulta el mapa. Al aprobar la solicitud, se te descontarán los puntos y al propietario se le sumarán automáticamente.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

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
          {{ periodosFiltrados.length }} periodo(s) disponible(s)
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

    <!-- Solicitar usar loft de otro inquilino -->
    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Solicitar usar loft de otro inquilino</h2>
      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Elige un periodo que haya activado otro inquilino y los días que quieres usar su loft. Al aprobar la solicitud, se te descontarán los puntos y al propietario se le sumarán automáticamente.
      </p>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Periodo disponible (propietario y fechas)</label>
          <select
            v-model="formSolicitud.periodo_id"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option value="">Selecciona periodo</option>
            <option v-for="p in periodosFiltrados" :key="p.id" :value="p.id">
              {{ p.propietario_nombre }} (Loft {{ p.propietario_loft }}) · {{ p.proyecto_nombre ?? '' }} {{ p.localidad ? `· ${p.localidad}` : '' }} · {{ formatoFecha(p.fecha_desde) }} – {{ formatoFecha(p.fecha_hasta) }} ({{ p.puntos_por_dia }} pts/día)
            </option>
          </select>
          <p v-if="periodosFiltrados.length === 0" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            No hay periodos de otros inquilinos activos{{ filtroLocalidad ? ' en esta localidad' : '' }}.
          </p>
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Días que quieres usar</label>
          <input
            v-model.number="formSolicitud.dias_usados"
            type="number"
            min="1"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div class="flex items-end">
          <button
            type="button"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            :disabled="guardandoSolicitud || !puedeEnviarSolicitud"
            @click="enviarSolicitud"
          >
            {{ guardandoSolicitud ? 'Enviando…' : 'Enviar solicitud' }}
          </button>
        </div>
      </div>
      <p v-if="formSolicitud.periodo_id && formSolicitud.dias_usados" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Puntos a descontarte cuando se apruebe: <strong>{{ puntosSolicitud }}</strong> (tu saldo actual: {{ saldo }})
      </p>
    </div>

    <!-- Historial de canjes -->
    <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Historial de canjes</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Tipo</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Con quien</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Días</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Puntos</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Estado</th>
              <th class="px-3 py-2 text-left text-gray-700 dark:text-gray-300">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in canjesOrdenados"
              :key="c.id"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="px-3 py-2">
                <span v-if="c.inquilino_propietario_id === inquilino?.id" class="text-green-600 dark:text-green-400">Ganados</span>
                <span v-else class="text-amber-600 dark:text-amber-400">Gastados</span>
              </td>
              <td class="px-3 py-2">{{ nombreOtro(c) }}</td>
              <td class="px-3 py-2">{{ c.dias_usados }}</td>
              <td class="px-3 py-2">{{ c.puntos }}</td>
              <td class="px-3 py-2">{{ c.estado }}</td>
              <td class="px-3 py-2">{{ formatoFechaHora(c.created_at) }}</td>
            </tr>
            <tr v-if="canjesOrdenados.length === 0">
              <td colspan="6" class="px-3 py-8 text-center text-gray-500 dark:text-gray-400">No hay canjes todavía.</td>
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
import InquilinoLayout from '@/components/layout/InquilinoLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { insforge } from '@/lib/insforge'

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

interface PeriodoOtro extends Periodo {
  propietario_nombre?: string
  propietario_loft?: number
  proyecto_id?: string
  proyecto_nombre?: string
  localidad?: string | null
  localizacion?: string | null
}

interface InquilinoLite {
  id: string
  nombre: string
  loft_num: number
}

const { inquilino, isSessionExpiredError, handleSessionExpired } = useAuth()
const error = ref('')
const success = ref('')
const guardandoSolicitud = ref(false)
const periodosDeOtros = ref<PeriodoOtro[]>([])
const canjes = ref<Canje[]>([])
const otrosInquilinos = ref<InquilinoLite[]>([])
const filtroLocalidad = ref<string>('')

const formSolicitud = ref({
  periodo_id: '',
  dias_usados: 1,
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

const periodoSolicitudSeleccionado = computed(() =>
  formSolicitud.value.periodo_id
    ? periodosDeOtros.value.find((p) => p.id === formSolicitud.value.periodo_id)
    : null
)

const puntosSolicitud = computed(() => {
  const p = periodoSolicitudSeleccionado.value
  const d = formSolicitud.value.dias_usados
  if (!p || !d) return 0
  return p.puntos_por_dia * d
})

const puedeEnviarSolicitud = computed(() => {
  const p = periodoSolicitudSeleccionado.value
  const d = formSolicitud.value.dias_usados
  if (!p || !d || d < 1) return false
  const pts = p.puntos_por_dia * d
  return saldo.value >= pts
})

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
  if (periodosDeOtros.value.length > 0) return 'Mapa: todas las localidades con periodos disponibles (centrado en la primera). Selecciona una localidad para centrar el mapa.'
  return 'No hay periodos disponibles. El mapa se actualizará cuando haya ofertas.'
})

const canjesOrdenados = computed(() =>
  [...canjes.value].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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

function nombreOtro(c: Canje) {
  if (c.inquilino_propietario_id === inquilino.value?.id) return c.visitante_nombre ?? '—'
  return c.propietario_nombre ?? '—'
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

async function cargarOtrosInquilinos() {
  const i = inquilino.value
  if (!i?.id) return
  const { data, error: err } = await insforge.database
    .from('inquilinos')
    .select('id, nombre, loft_num, proyecto_id')
    .neq('id', i.id)
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    otrosInquilinos.value = []
    return
  }
  otrosInquilinos.value = (data ?? []) as InquilinoLite[]
}

async function cargarPeriodosDeOtros() {
  const i = inquilino.value
  if (!i?.id) return
  const otrosIds = otrosInquilinos.value.map((o) => o.id)
  if (otrosIds.length === 0) {
    periodosDeOtros.value = []
    return
  }
  const { data, error: err } = await insforge.database
    .from('flextime_periodos')
    .select('id, inquilino_id, fecha_desde, fecha_hasta, puntos_por_dia, created_at')
    .in('inquilino_id', otrosIds)
    .order('fecha_desde', { ascending: false })
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    periodosDeOtros.value = []
    return
  }
  const periodosRaw = (data ?? []) as Periodo[]
  const inqIds = [...new Set(periodosRaw.map((p) => p.inquilino_id))]
  const names: Record<string, string> = {}
  const loftMap: Record<string, number> = {}
  const proyectoIdMap: Record<string, string> = {}
  if (inqIds.length > 0) {
    const { data: inqData } = await insforge.database
      .from('inquilinos')
      .select('id, nombre, loft_num, proyecto_id')
      .in('id', inqIds)
    for (const row of inqData ?? []) {
      const r = row as { id: string; nombre: string; loft_num: number; proyecto_id?: string }
      names[r.id] = r.nombre
      loftMap[r.id] = r.loft_num
      if (r.proyecto_id) proyectoIdMap[r.id] = r.proyecto_id
    }
  }
  const proyectoIds = [...new Set(Object.values(proyectoIdMap))]
  const proyectosMap: Record<string, { nombre_proyecto: string; localidad: string | null; localizacion: string | null }> = {}
  if (proyectoIds.length > 0) {
    const { data: proyData } = await insforge.database
      .from('proyectos')
      .select('id, nombre_proyecto, localidad, localizacion')
      .in('id', proyectoIds)
    for (const row of proyData ?? []) {
      const r = row as { id: string; nombre_proyecto: string; localidad: string | null; localizacion: string | null }
      proyectosMap[r.id] = { nombre_proyecto: r.nombre_proyecto, localidad: r.localidad ?? null, localizacion: r.localizacion ?? null }
    }
  }
  periodosDeOtros.value = periodosRaw.map((p) => {
    const pid = proyectoIdMap[p.inquilino_id]
    const proy = pid ? proyectosMap[pid] : null
    return {
      ...p,
      propietario_nombre: names[p.inquilino_id],
      propietario_loft: loftMap[p.inquilino_id],
      proyecto_id: pid,
      proyecto_nombre: proy?.nombre_proyecto,
      localidad: proy?.localidad ?? null,
      localizacion: proy?.localizacion ?? null,
    }
  })
}

async function enviarSolicitud() {
  const i = inquilino.value
  const p = periodoSolicitudSeleccionado.value
  if (!i || !p || !puedeEnviarSolicitud.value) return
  const puntos = p.puntos_por_dia * formSolicitud.value.dias_usados
  if (saldo.value < puntos) {
    error.value = 'No tienes suficiente saldo de puntos.'
    return
  }
  error.value = ''
  success.value = ''
  guardandoSolicitud.value = true
  try {
    const { error: err } = await insforge.database.from('flextime_canjes').insert({
      inquilino_propietario_id: p.inquilino_id,
      inquilino_visitante_id: i.id,
      periodo_id: p.id,
      dias_usados: formSolicitud.value.dias_usados,
      puntos,
      estado: 'pendiente',
    })
    if (err) throw err
    success.value = 'Solicitud enviada. El propietario debe aprobarla para que se apliquen los puntos.'
    formSolicitud.value = { periodo_id: '', dias_usados: 1 }
    await cargarCanjes()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error enviando solicitud'
  } finally {
    guardandoSolicitud.value = false
  }
}

async function load() {
  if (!inquilino.value?.id) return
  await cargarOtrosInquilinos()
  await cargarPeriodosDeOtros()
  await cargarCanjes()
}

watch(inquilino, (i) => {
  if (i?.id) load()
}, { immediate: true })

onMounted(load)
</script>
