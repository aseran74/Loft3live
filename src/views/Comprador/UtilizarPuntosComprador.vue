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

    <!-- Solicitar usar loft -->
    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Solicitar usar loft con tus puntos</h2>
      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Elige un periodo que haya activado un inquilino y los días que quieres usar su loft. Al aprobar la solicitud, se te descontarán los puntos.
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
            No hay periodos disponibles{{ filtroLocalidad ? ' en esta localidad' : '' }}.
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
            class="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
            :disabled="guardandoSolicitud || !puedeEnviarSolicitud"
            @click="enviarSolicitud"
          >
            {{ guardandoSolicitud ? 'Enviando…' : 'Enviar solicitud' }}
          </button>
        </div>
      </div>
      <p v-if="formSolicitud.periodo_id && formSolicitud.dias_usados" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Puntos a descontar cuando se apruebe: <strong>{{ puntosSolicitud }}</strong> (tu saldo actual: {{ saldo }})
      </p>
      <p class="mt-3 text-xs text-amber-600 dark:text-amber-400">
        Como comprador, las solicitudes se gestionan con el equipo. Te confirmaremos la disponibilidad.
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
import CompradorLayout from '@/components/layout/CompradorLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { insforge } from '@/lib/insforge'

interface Periodo {
  id: string
  inquilino_id: string
  fecha_desde: string
  fecha_hasta: string
  puntos_por_dia: number
  created_at: string
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

const { comprador, isSessionExpiredError, handleSessionExpired } = useAuth()
const error = ref('')
const success = ref('')
const guardandoSolicitud = ref(false)
const periodosDeOtros = ref<PeriodoOtro[]>([])
const otrosInquilinos = ref<InquilinoLite[]>([])
const filtroLocalidad = ref<string>('')
const saldoPuntosComprados = ref<number>(0)
const puntosUsadosEnReservas = ref<number>(0)

const formSolicitud = ref({
  periodo_id: '',
  dias_usados: 1,
})

const saldo = computed(() => Math.max(0, saldoPuntosComprados.value - puntosUsadosEnReservas.value))

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
  if (periodosDeOtros.value.length > 0) return 'Mapa: todas las localidades con periodos disponibles. Selecciona una localidad para centrar el mapa.'
  return 'No hay periodos disponibles. El mapa se actualizará cuando haya ofertas.'
})

function formatoFecha(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
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
  const { data, error: err } = await insforge.database
    .from('comprador_reserva_puntos')
    .select('puntos')
    .eq('comprador_id', id)
    .eq('estado', 'aprobado')
  if (err) {
    puntosUsadosEnReservas.value = 0
    return
  }
  const rows = (data ?? []) as { puntos: number }[]
  puntosUsadosEnReservas.value = rows.reduce((s, r) => s + Number(r.puntos ?? 0), 0)
}

async function cargarOtrosInquilinos() {
  const { data, error: err } = await insforge.database
    .from('inquilinos')
    .select('id, nombre, loft_num, proyecto_id')
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    otrosInquilinos.value = []
    return
  }
  otrosInquilinos.value = (data ?? []) as InquilinoLite[]
}

async function cargarPeriodosDeOtros() {
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
  const c = comprador.value
  const p = periodoSolicitudSeleccionado.value
  if (!c || !p || !puedeEnviarSolicitud.value) return
  const puntos = p.puntos_por_dia * formSolicitud.value.dias_usados
  if (saldo.value < puntos) {
    error.value = 'No tienes suficiente saldo de puntos.'
    return
  }
  error.value = ''
  success.value = ''
  guardandoSolicitud.value = true
  try {
    const { error: err } = await insforge.database.from('comprador_reserva_puntos').insert({
      comprador_id: c.id,
      periodo_id: p.id,
      dias_usados: formSolicitud.value.dias_usados,
      puntos,
      estado: 'aprobado',
    })
    if (err) throw err
    success.value = 'Reserva registrada y aprobada. Puedes usar el loft en las fechas indicadas.'
    formSolicitud.value = { periodo_id: '', dias_usados: 1 }
    await cargarSaldoPuntos()
    await cargarPuntosUsadosEnReservas()
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
  await cargarOtrosInquilinos()
  await cargarPeriodosDeOtros()
}

watch(comprador, (c) => {
  if (c?.id) load()
}, { immediate: true })

onMounted(load)
</script>
