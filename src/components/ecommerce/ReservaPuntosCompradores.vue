<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold text-gray-800 dark:text-white">Reserva puntos compradores</h3>
      <router-link
        to="/gestion-compradores"
        class="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
      >
        Ver compradores
      </router-link>
    </div>
    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      Reservas de compradores que usan puntos para estancias en apartamentos. Aprobadas por defecto.
    </p>
    <div v-if="loading" class="mt-4 py-4 text-center text-sm text-gray-500">Cargando…</div>
    <div v-else class="mt-4 space-y-3">
      <div
        v-for="r in reservasOrdenadas"
        :key="r.id"
        class="rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-800/80"
      >
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ r.comprador_nombre || 'Comprador' }}</p>
            <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
              {{ (r.fecha_desde && r.fecha_hasta) ? (formatoFecha(r.fecha_desde) + ' – ' + formatoFecha(r.fecha_hasta)) : 'Periodo' }}
              · {{ r.dias_usados }} día(s) · <strong>{{ r.puntos }}</strong> puntos
            </p>
            <p v-if="r.propietario_loft != null" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Apartamento {{ r.propietario_loft }}{{ r.proyecto_nombre ? (' · ' + r.proyecto_nombre) : '' }}
            </p>
          </div>
          <span class="inline-flex shrink-0 items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/40 dark:text-green-300">
            {{ r.estado }}
          </span>
        </div>
      </div>
      <p v-if="reservasOrdenadas.length === 0" class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        No hay reservas de puntos todavía.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { insforge } from '@/lib/insforge'

const loading = ref(true)
const reservas = ref([])

const reservasOrdenadas = computed(() => {
  return [...reservas.value].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
})

function formatoFecha(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  loading.value = true
  try {
    const { data: rows, error } = await insforge.database
      .from('comprador_reserva_puntos')
      .select('id, comprador_id, periodo_id, dias_usados, puntos, estado, created_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    const list = rows || []

    const compradorIds = [...new Set(list.map((r) => r.comprador_id))]
    const periodoIds = [...new Set(list.map((r) => r.periodo_id).filter(Boolean))]

    const nombresComprador = {}
    if (compradorIds.length > 0) {
      const { data: compData } = await insforge.database
        .from('compradores')
        .select('id, nombre')
        .in('id', compradorIds)
      for (const c of (compData || [])) {
        nombresComprador[c.id] = c.nombre
      }
    }

    const periodosMap = {}
    const loftMap = {}
    const inqToProyectoId = {}
    const proyectoMap = {}
    if (periodoIds.length > 0) {
      const { data: perData } = await insforge.database
        .from('flextime_periodos')
        .select('id, fecha_desde, fecha_hasta, inquilino_id')
        .in('id', periodoIds)
      for (const p of (perData || [])) {
        periodosMap[p.id] = { fecha_desde: p.fecha_desde, fecha_hasta: p.fecha_hasta, inquilino_id: p.inquilino_id }
      }
      const inqIds = [...new Set(Object.values(periodosMap).map((x) => x.inquilino_id))]
      if (inqIds.length > 0) {
        const { data: inqData } = await insforge.database
          .from('inquilinos')
          .select('id, loft_num, proyecto_id')
          .in('id', inqIds)
        const proyIds = new Set()
        for (const i of (inqData || [])) {
          loftMap[i.id] = i.loft_num
          inqToProyectoId[i.id] = i.proyecto_id
          proyIds.add(i.proyecto_id)
        }
        if (proyIds.size > 0) {
          const { data: proyData } = await insforge.database
            .from('proyectos')
            .select('id, nombre_proyecto')
            .in('id', [...proyIds])
          for (const p of (proyData || [])) {
            proyectoMap[p.id] = p.nombre_proyecto
          }
        }
      }
    }

    reservas.value = list.map((r) => {
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
    reservas.value = []
  } finally {
    loading.value = false
  }
})
</script>
