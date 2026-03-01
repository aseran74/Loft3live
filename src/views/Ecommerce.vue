<template>
  <admin-layout>
    <!-- Cabecera destacada con subrayado (mismo estilo que comprador/inquilino) -->
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
          Bienvenido al panel de administración
        </p>
      </div>
    </header>
    <!-- Compra de puntos y Reserva puntos compradores: primera fila ancha para que siempre se vean -->
    <div class="mb-6 grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">Compra de puntos</h3>
          <router-link to="/gestion-compradores" class="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">Ver compradores</router-link>
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Solo el trimestre <strong>pendiente</strong> (no cobrado) se puede canjear por puntos. Los pagados ya no.</p>
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
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Reservas de compradores que usan puntos para estancias en lofts. Aprobadas por defecto.</p>
        <div v-if="reservaPuntosLoading" class="mt-4 py-4 text-center text-sm text-gray-500">Cargando…</div>
        <div v-else class="mt-4 space-y-3">
          <div v-for="r in reservasPuntosOrdenadas" :key="r.id" class="rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-800/80">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ r.comprador_nombre || 'Comprador' }}</p>
                <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{{ (r.fecha_desde && r.fecha_hasta) ? (formatoFechaReserva(r.fecha_desde) + ' – ' + formatoFechaReserva(r.fecha_hasta)) : 'Periodo' }} · {{ r.dias_usados }} día(s) · <strong>{{ r.puntos }}</strong> puntos</p>
                <p v-if="r.propietario_loft != null" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Loft {{ r.propietario_loft }}{{ r.proyecto_nombre ? (' · ' + r.proyecto_nombre) : '' }}</p>
              </div>
              <span class="inline-flex shrink-0 items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">{{ r.estado }}</span>
            </div>
          </div>
          <p v-if="reservasPuntosOrdenadas.length === 0" class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">No hay reservas de puntos todavía.</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-4 md:gap-6">
      <div class="col-span-12 space-y-6 xl:col-span-7">
        <ecommerce-metrics />
        <monthly-target />
      </div>
      <div class="col-span-12 xl:col-span-5 space-y-6">
        <monthly-sale />
      </div>

      <div class="col-span-12">
        <statistics-chart />
      </div>

      <div class="col-span-12 xl:col-span-5">
        <customer-demographic />
      </div>

      <div class="col-span-12 xl:col-span-7">
        <recent-orders />
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import EcommerceMetrics from '../components/ecommerce/EcommerceMetrics.vue'
import MonthlyTarget from '../components/ecommerce/MonthlySale.vue'
import MonthlySale from '../components/ecommerce/MonthlyTarget.vue'
import CustomerDemographic from '../components/ecommerce/CustomerDemographic.vue'
import StatisticsChart from '../components/ecommerce/StatisticsChart.vue'
import RecentOrders from '../components/ecommerce/RecentOrders.vue'
import { insforge } from '@/lib/insforge'

export default {
  components: {
    AdminLayout,
    EcommerceMetrics,
    MonthlyTarget,
    MonthlySale,
    CustomerDemographic,
    StatisticsChart,
    RecentOrders,
  },
  name: 'Ecommerce',
  data () {
    return {
      compraPuntosLoading: true,
      resumenCompraPuntos: [],
      reservaPuntosLoading: true,
      reservasPuntos: [],
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
          for (const p of (proys || [])) {
            proyectosMap[p.id] = p.nombre_proyecto
          }
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
  },
  mounted () {
    this.loadCompraPuntos()
    this.loadReservaPuntos()
  },
}
</script>
