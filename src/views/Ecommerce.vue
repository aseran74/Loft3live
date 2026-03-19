<template>
  <admin-layout>
    <header class="relative mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-brand-50/30 px-6 py-6 shadow-sm dark:border-gray-700 dark:from-gray-800/90 dark:via-gray-800 dark:to-brand-900/20 sm:px-8 sm:py-8">
      <div class="relative z-10">
        <span class="mb-2 inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:bg-brand-400/20 dark:text-brand-300">
          Panel de administración
        </span>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Panel de administrador
        </h1>
        <span class="mt-2 block h-1 w-16 rounded-full bg-brand-500 dark:bg-brand-400" aria-hidden="true" />
        <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Resumen con datos reales de proyectos, inquilinos, compradores, reservas e incidencias.
        </p>
      </div>
    </header>

    <!-- Compra de puntos y Reserva puntos compradores -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">Compra de puntos</h3>
          <router-link to="/gestion-compradores" class="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">Ver compradores</router-link>
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Trimestre pendiente (no cobrado) para canjear por puntos.</p>
        <div v-if="compraPuntosLoading" class="mt-4 py-4 text-center text-sm text-gray-500">Cargando…</div>
        <div v-else class="mt-4 space-y-3">
          <div v-for="g in resumenCompraPuntos" :key="g.proyecto_id" class="rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-800/80">
            <p class="font-medium text-gray-900 dark:text-white">{{ g.proyecto_nombre || 'Proyecto' }}</p>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">Trimestre pendiente: <strong>{{ g.anio }} – T{{ g.trimestre }}</strong> · {{ g.cantidad }} comprador(es) · {{ formatCurrency(g.importe_total) }} total</p>
          </div>
          <p v-if="resumenCompraPuntos.length === 0" class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">No hay trimestres pendientes.</p>
        </div>
      </div>
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">Reserva puntos compradores</h3>
          <router-link to="/gestion-compradores" class="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">Ver compradores</router-link>
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Reservas de compradores con puntos. Aprobadas por defecto.</p>
        <div v-if="reservaPuntosLoading" class="mt-4 py-4 text-center text-sm text-gray-500">Cargando…</div>
        <div v-else class="mt-4 space-y-3">
          <div v-for="r in reservasPuntosOrdenadas" :key="r.id" class="rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-800/80">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ r.comprador_nombre || 'Comprador' }}</p>
                <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{{ (r.fecha_desde && r.fecha_hasta) ? (formatoFechaReserva(r.fecha_desde) + ' – ' + formatoFechaReserva(r.fecha_hasta)) : 'Periodo' }} · {{ r.dias_usados }} día(s) · <strong>{{ r.puntos }}</strong> puntos</p>
                <p v-if="r.propietario_loft != null" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Apartamento {{ r.propietario_loft }}{{ r.proyecto_nombre ? (' · ' + r.proyecto_nombre) : '' }}</p>
              </div>
              <span class="inline-flex shrink-0 items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">{{ r.estado }}</span>
            </div>
          </div>
          <p v-if="reservasPuntosOrdenadas.length === 0" class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">No hay reservas de puntos todavía.</p>
        </div>
      </div>
    </div>

    <!-- KPIs datos reales -->
    <div v-if="resumenLoading" class="mb-6 py-8 text-center text-sm text-gray-500">Cargando resumen…</div>
    <div v-else class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-7">
      <router-link
        to="/lista-proyectos"
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-700"
      >
        <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Proyectos</span>
        <span class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ resumen.totalProyectos }}</span>
      </router-link>
      <router-link
        to="/gestion-inquilinos"
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-700"
      >
        <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Inquilinos</span>
        <span class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ resumen.totalInquilinos }}</span>
      </router-link>
      <router-link
        to="/gestion-compradores"
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-700"
      >
        <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Compradores</span>
        <span class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ resumen.totalCompradores }}</span>
      </router-link>
      <router-link
        to="/reserva-instalaciones"
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-700"
      >
        <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Reservas instal.</span>
        <span class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ resumen.totalReservasInstalaciones }}</span>
      </router-link>
      <router-link
        to="/reserva-corta-estancia"
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-700"
      >
        <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Corta estancia</span>
        <span class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ resumen.totalReservasCortaEstancia }}</span>
      </router-link>
      <router-link
        to="/incidencias"
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-700"
      >
        <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Incidencias abiertas</span>
        <span class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ resumen.incidenciasAbiertas }}</span>
      </router-link>
      <router-link
        to="/solicitudes-info"
        class="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-700"
      >
        <span class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Solicitudes info</span>
        <span class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ resumen.totalSolicitudesInfo }}</span>
      </router-link>
    </div>

    <!-- Listas recientes -->
    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-6">
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700 sm:px-6">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">Últimas reservas instalaciones</h3>
          <router-link to="/reserva-instalaciones" class="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">Ver todas</router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Fecha</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Proyecto</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Instalación</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Inquilino</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in resumen.ultimasReservasInstalaciones" :key="r.id" class="border-t border-gray-100 dark:border-gray-700">
                <td class="px-3 py-2 text-gray-600 dark:text-gray-400">{{ formatoFechaCorta(r.fecha) }}</td>
                <td class="px-3 py-2">{{ r.proyecto_nombre || '—' }}</td>
                <td class="px-3 py-2">{{ etiquetaInstalacion(r.instalacion_tipo) }}</td>
                <td class="px-3 py-2">{{ r.inquilino_nombre || '—' }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="resumen.ultimasReservasInstalaciones.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">No hay reservas.</p>
        </div>
      </div>

      <div class="col-span-12 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-6">
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700 sm:px-6">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">Últimas reservas corta estancia</h3>
          <router-link to="/reserva-corta-estancia" class="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">Ver todas</router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Entrada</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Salida</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Proyecto</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Apartamento</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in resumen.ultimasReservasCortaEstancia" :key="r.id" class="border-t border-gray-100 dark:border-gray-700">
                <td class="px-3 py-2 text-gray-600 dark:text-gray-400">{{ formatoFechaCorta(r.fecha_inicio) }}</td>
                <td class="px-3 py-2 text-gray-600 dark:text-gray-400">{{ formatoFechaCorta(r.fecha_fin) }}</td>
                <td class="px-3 py-2">{{ r.proyecto_nombre || '—' }}</td>
                <td class="px-3 py-2">{{ r.loft_num }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="resumen.ultimasReservasCortaEstancia.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">No hay reservas.</p>
        </div>
      </div>

      <div class="col-span-12 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-6">
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700 sm:px-6">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">Incidencias recientes</h3>
          <router-link to="/incidencias" class="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">Ver todas</router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Fecha</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Proyecto</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Tipo</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in resumen.ultimasIncidencias" :key="i.id" class="border-t border-gray-100 dark:border-gray-700">
                <td class="px-3 py-2 text-gray-600 dark:text-gray-400">{{ formatoFechaCorta(i.created_at) }}</td>
                <td class="px-3 py-2">{{ i.proyecto_nombre || '—' }}</td>
                <td class="px-3 py-2">{{ etiquetaTipoIncidencia(i.tipo) }}</td>
                <td class="px-3 py-2">
                  <span :class="estadoIncidenciaClass(i.estado)">{{ i.estado }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="resumen.ultimasIncidencias.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">No hay incidencias.</p>
        </div>
      </div>

      <div class="col-span-12 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:col-span-6">
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700 sm:px-6">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">Solicitudes de información</h3>
          <router-link to="/solicitudes-info" class="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">Ver todas</router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Fecha</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th class="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400">Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in resumen.ultimasSolicitudesInfo" :key="s.id" class="border-t border-gray-100 dark:border-gray-700">
                <td class="px-3 py-2 text-gray-600 dark:text-gray-400">{{ formatoFechaCorta(s.created_at) }}</td>
                <td class="px-3 py-2">{{ s.email }}</td>
                <td class="px-3 py-2">
                  <span :class="s.tipo === 'alquilar' ? 'text-brand-600 dark:text-brand-400' : 'text-emerald-600 dark:text-emerald-400'">{{ s.tipo === 'alquilar' ? 'Alquilar' : 'Comprar' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="resumen.ultimasSolicitudesInfo.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">No hay solicitudes.</p>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import { insforge } from '@/lib/insforge'

const LIMIT = 8
const INSTALACIONES_LABEL = { gimnasio: 'Gimnasio', piscina: 'Piscina', sala_reuniones: 'Sala reuniones', coworking: 'Coworking', otros: 'Otros' }
const TIPO_INCIDENCIA_LABEL = { malos_olores: 'Malos olores', ruidos: 'Ruidos', frio_calor: 'Frío/calor', otros: 'Otros' }

export default {
  components: { AdminLayout },
  name: 'Ecommerce',
  data () {
    return {
      compraPuntosLoading: true,
      resumenCompraPuntos: [],
      reservaPuntosLoading: true,
      reservasPuntos: [],
      resumenLoading: true,
      resumen: {
        totalProyectos: 0,
        totalInquilinos: 0,
        totalCompradores: 0,
        totalReservasInstalaciones: 0,
        totalReservasCortaEstancia: 0,
        incidenciasAbiertas: 0,
        totalSolicitudesInfo: 0,
        ultimasReservasInstalaciones: [],
        ultimasReservasCortaEstancia: [],
        ultimasIncidencias: [],
        ultimasSolicitudesInfo: [],
      },
    }
  },
  computed: {
    reservasPuntosOrdenadas () {
      return [...this.reservasPuntos].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    },
  },
  methods: {
    formatCurrency (value) {
      return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
    },
    formatoFechaReserva (dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    formatoFechaCorta (dateStr) {
      if (!dateStr) return '—'
      try {
        const d = dateStr.includes('T') ? new Date(dateStr) : new Date(dateStr + 'T12:00:00')
        return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: '2-digit' })
      } catch {
        return dateStr
      }
    },
    etiquetaInstalacion (tipo) {
      return INSTALACIONES_LABEL[tipo] || tipo || '—'
    },
    etiquetaTipoIncidencia (tipo) {
      return TIPO_INCIDENCIA_LABEL[tipo] || tipo || '—'
    },
    estadoIncidenciaClass (estado) {
      if (estado === 'resuelto') return 'rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300'
      if (estado === 'tratado') return 'rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
      return 'rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    },
    async loadCompraPuntos () {
      this.compraPuntosLoading = true
      try {
        const { data: rows, error } = await insforge.database
          .from('comprador_pagos_trimestre')
          .select('proyecto_id, anio, trimestre, importe')
          .eq('estado', 'Pendiente')
          .order('anio', { ascending: false })
          .order('trimestre', { ascending: false })
        if (error) throw error
        const list = rows || []
        const ids = [...new Set(list.map(r => r.proyecto_id))]
        let proyectosMap = {}
        if (ids.length > 0) {
          const { data: proys } = await insforge.database.from('proyectos').select('id, nombre_proyecto').in('id', ids)
          for (const p of (proys || [])) proyectosMap[p.id] = p.nombre_proyecto
        }
        const byKey = {}
        for (const r of list) {
          const key = `${r.proyecto_id}-${r.anio}-${r.trimestre}`
          if (!byKey[key]) byKey[key] = { cantidad: 0, importe_total: 0 }
          byKey[key].cantidad += 1
          byKey[key].importe_total += Number(r.importe || 0)
        }
        this.resumenCompraPuntos = Object.entries(byKey).map(([key, val]) => {
          const parts = key.split('-')
          const trimestre = Number(parts[parts.length - 1])
          const anio = Number(parts[parts.length - 2])
          const proyecto_id = parts.slice(0, -2).join('-')
          return { proyecto_id, proyecto_nombre: proyectosMap[proyecto_id], anio, trimestre, cantidad: val.cantidad, importe_total: val.importe_total }
        })
      } catch (_) {
        this.resumenCompraPuntos = []
      } finally {
        this.compraPuntosLoading = false
      }
    },
    async loadReservaPuntos () {
      this.reservaPuntosLoading = true
      try {
        const { data: rows, error } = await insforge.database
          .from('comprador_reserva_puntos')
          .select('id, comprador_id, periodo_id, dias_usados, puntos, estado, created_at')
          .order('created_at', { ascending: false })
        if (error) throw error
        const list = rows || []
        const compradorIds = [...new Set(list.map(r => r.comprador_id))]
        const periodoIds = [...new Set(list.map(r => r.periodo_id).filter(Boolean))]
        let nombresComprador = {}
        if (compradorIds.length > 0) {
          const { data: compData } = await insforge.database.from('compradores').select('id, nombre').in('id', compradorIds)
          for (const c of (compData || [])) nombresComprador[c.id] = c.nombre
        }
        let periodosMap = {}
        let loftMap = {}
        let inqToProyectoId = {}
        let proyectoMap = {}
        if (periodoIds.length > 0) {
          const { data: perData } = await insforge.database.from('flextime_periodos').select('id, fecha_desde, fecha_hasta, inquilino_id').in('id', periodoIds)
          for (const p of (perData || [])) periodosMap[p.id] = { fecha_desde: p.fecha_desde, fecha_hasta: p.fecha_hasta, inquilino_id: p.inquilino_id }
          const inqIds = [...new Set(Object.values(periodosMap).map(x => x.inquilino_id))]
          if (inqIds.length > 0) {
            const { data: inqData } = await insforge.database.from('inquilinos').select('id, loft_num, proyecto_id').in('id', inqIds)
            const proyIds = new Set()
            for (const i of (inqData || [])) {
              loftMap[i.id] = i.loft_num
              inqToProyectoId[i.id] = i.proyecto_id
              proyIds.add(i.proyecto_id)
            }
            if (proyIds.size > 0) {
              const { data: proyData } = await insforge.database.from('proyectos').select('id, nombre_proyecto').in('id', [...proyIds])
              for (const p of (proyData || [])) proyectoMap[p.id] = p.nombre_proyecto
            }
          }
        }
        this.reservasPuntos = list.map(r => {
          const per = r.periodo_id ? periodosMap[r.periodo_id] : null
          const inqId = per ? per.inquilino_id : null
          const proyId = inqId ? inqToProyectoId[inqId] : null
          return {
            ...r,
            comprador_nombre: nombresComprador[r.comprador_id],
            fecha_desde: per ? per.fecha_desde : undefined,
            fecha_hasta: per ? per.fecha_hasta : undefined,
            propietario_loft: inqId != null ? loftMap[inqId] : undefined,
            proyecto_nombre: proyId ? proyectoMap[proyId] : undefined,
          }
        })
      } catch (_) {
        this.reservasPuntos = []
      } finally {
        this.reservaPuntosLoading = false
      }
    },
    async loadResumen () {
      this.resumenLoading = true
      try {
        const db = insforge.database

        const [countProyectos, countInquilinos, countCompradores, countResInst, countResCorta, countIncAbiertas, countSolicitudes,
          dataResInst, dataResCorta, dataInc, dataSolicitudes] = await Promise.all([
          db.from('proyectos').select('id', { count: 'exact', head: true }),
          db.from('inquilinos').select('id', { count: 'exact', head: true }),
          db.from('compradores').select('id', { count: 'exact', head: true }),
          db.from('reservas_instalaciones').select('id', { count: 'exact', head: true }),
          db.from('reservas_corta_estancia').select('id', { count: 'exact', head: true }),
          db.from('incidencias').select('id', { count: 'exact', head: true }).neq('estado', 'resuelto'),
          db.from('solicitudes_info').select('id', { count: 'exact', head: true }),
          db.from('reservas_instalaciones').select('id, proyecto_id, instalacion_tipo, inquilino_id, fecha').order('fecha', { ascending: false }).limit(LIMIT),
          db.from('reservas_corta_estancia').select('id, proyecto_id, loft_num, fecha_inicio, fecha_fin').order('fecha_inicio', { ascending: false }).limit(LIMIT),
          db.from('incidencias').select('id, proyecto_id, tipo, estado, created_at').order('created_at', { ascending: false }).limit(LIMIT),
          db.from('solicitudes_info').select('id, email, tipo, created_at').order('created_at', { ascending: false }).limit(LIMIT),
        ])

        this.resumen.totalProyectos = countProyectos.count ?? 0
        this.resumen.totalInquilinos = countInquilinos.count ?? 0
        this.resumen.totalCompradores = countCompradores.count ?? 0
        this.resumen.totalReservasInstalaciones = countResInst.count ?? 0
        this.resumen.totalReservasCortaEstancia = countResCorta.count ?? 0
        this.resumen.incidenciasAbiertas = countIncAbiertas.count ?? 0
        this.resumen.totalSolicitudesInfo = countSolicitudes.count ?? 0

        const listResInst = dataResInst.data || []
        const listResCorta = dataResCorta.data || []
        const listInc = dataInc.data || []
        const listSolicitudes = dataSolicitudes.data || []

        const proyIds = [...new Set([
          ...listResInst.map(r => r.proyecto_id),
          ...listResCorta.map(r => r.proyecto_id),
          ...listInc.map(i => i.proyecto_id),
        ].filter(Boolean))]
        let proyectoMap = {}
        if (proyIds.length > 0) {
          const { data: proys } = await db.from('proyectos').select('id, nombre_proyecto').in('id', proyIds)
          for (const p of (proys || [])) proyectoMap[p.id] = p.nombre_proyecto
        }

        const inqIds = [...new Set(listResInst.map(r => r.inquilino_id).filter(Boolean))]
        let inquilinoMap = {}
        if (inqIds.length > 0) {
          const { data: inqs } = await db.from('inquilinos').select('id, nombre').in('id', inqIds)
          for (const i of (inqs || [])) inquilinoMap[i.id] = i.nombre
        }

        this.resumen.ultimasReservasInstalaciones = listResInst.map(r => ({
          ...r,
          proyecto_nombre: proyectoMap[r.proyecto_id],
          inquilino_nombre: inquilinoMap[r.inquilino_id],
        }))
        this.resumen.ultimasReservasCortaEstancia = listResCorta.map(r => ({
          ...r,
          proyecto_nombre: proyectoMap[r.proyecto_id],
        }))
        this.resumen.ultimasIncidencias = listInc.map(i => ({
          ...i,
          proyecto_nombre: proyectoMap[i.proyecto_id],
        }))
        this.resumen.ultimasSolicitudesInfo = listSolicitudes
      } catch (_) {
        this.resumen.totalProyectos = 0
        this.resumen.totalInquilinos = 0
        this.resumen.totalCompradores = 0
        this.resumen.totalReservasInstalaciones = 0
        this.resumen.totalReservasCortaEstancia = 0
        this.resumen.incidenciasAbiertas = 0
        this.resumen.totalSolicitudesInfo = 0
        this.resumen.ultimasReservasInstalaciones = []
        this.resumen.ultimasReservasCortaEstancia = []
        this.resumen.ultimasIncidencias = []
        this.resumen.ultimasSolicitudesInfo = []
      } finally {
        this.resumenLoading = false
      }
    },
  },
  mounted () {
    this.loadCompraPuntos()
    this.loadReservaPuntos()
    this.loadResumen()
  },
}
</script>
