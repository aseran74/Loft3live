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
        Elige un proyecto y luego una disponibilidad (Flextime, Agosto libre o loft libre). Los puntos se descontarán al aprobar.
      </p>

      <!-- Selector de proyecto -->
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

      <!-- Cards de disponibilidad del proyecto seleccionado -->
      <div v-if="filtroProyectoId" class="mb-6">
        <p class="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
          Disponibilidades · Loft y tipo
        </p>
        <div v-if="opcionesDelProyecto.length === 0" class="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-8 text-center text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-400">
          No hay disponibilidades en este proyecto{{ filtroLocalidad ? ' en esta localidad' : '' }}.
        </div>
        <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <button
            v-for="p in opcionesDelProyecto"
            :key="p.id"
            type="button"
            class="group flex flex-col rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            :class="formSolicitud.periodo_id === p.id
              ? 'border-violet-500 bg-violet-50 shadow-md dark:border-violet-400 dark:bg-violet-900/20'
              : 'border-gray-200 bg-white hover:border-violet-300 hover:shadow dark:border-gray-600 dark:bg-gray-800 dark:hover:border-violet-500'"
            @click="formSolicitud.periodo_id = p.id"
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
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatoFecha(p.fecha_desde) }} – {{ formatoFecha(p.fecha_hasta) }}
            </p>
            <p class="mt-1 text-sm font-semibold text-violet-600 dark:text-violet-400">
              {{ p.puntos_por_dia }} pts/día
            </p>
            <p v-if="p.propietario_nombre && p.tipo === 'flextime'" class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
              {{ p.propietario_nombre }}
            </p>
          </button>
        </div>
      </div>

      <!-- Días y enviar -->
      <div class="flex flex-wrap items-end gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
        <div class="min-w-[120px]">
          <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Días a usar</label>
          <input
            v-model.number="formSolicitud.dias_usados"
            type="number"
            min="1"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <button
          type="button"
          class="rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
          :disabled="guardandoSolicitud || !puedeEnviarSolicitud"
          @click="enviarSolicitud"
        >
          {{ guardandoSolicitud ? 'Enviando…' : 'Enviar solicitud' }}
        </button>
      </div>
      <p v-if="formSolicitud.periodo_id && formSolicitud.dias_usados" class="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Puntos a descontar: <strong>{{ puntosSolicitud }}</strong> (saldo: {{ saldo }})
      </p>
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
import CompradorLayout from '@/components/layout/CompradorLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { insforge } from '@/lib/insforge'

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
  const puntos = p.puntos_por_dia * formSolicitud.value.dias_usados
  if (saldo.value < puntos) {
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
        dias_usados: formSolicitud.value.dias_usados,
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
        fecha_desde: p.fecha_desde,
        fecha_hasta: p.fecha_hasta,
        dias_usados: formSolicitud.value.dias_usados,
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
        dias_usados: formSolicitud.value.dias_usados,
        puntos,
        estado: 'aprobado',
      })
      if (err) throw err
    }

    success.value = 'Reserva registrada y aprobada. Puedes usar el loft en las fechas indicadas.'
    formSolicitud.value = { periodo_id: '', dias_usados: 1 }
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

onMounted(load)
</script>
