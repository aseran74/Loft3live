<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold text-gray-800 dark:text-white">Compra de puntos</h3>
      <router-link
        to="/gestion-compradores"
        class="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
      >
        Ver compradores
      </router-link>
    </div>
    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      Solo el trimestre <strong>pendiente</strong> (no cobrado) se puede canjear por puntos. Los pagados ya no.
    </p>
    <div v-if="loading" class="mt-4 py-4 text-center text-sm text-gray-500">Cargando…</div>
    <div v-else class="mt-4 space-y-3">
      <div
        v-for="g in resumenPorProyecto"
        :key="g.proyecto_id"
        class="rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-800/80"
      >
        <p class="font-medium text-gray-900 dark:text-white">{{ g.proyecto_nombre || 'Proyecto' }}</p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Trimestre pendiente: <strong>{{ g.anio }} – T{{ g.trimestre }}</strong>
          · {{ g.cantidad }} comprador(es) · {{ formatCurrency(g.importe_total) }} total
        </p>
      </div>
      <p v-if="resumenPorProyecto.length === 0" class="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        No hay trimestres pendientes.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { insforge } from '@/lib/insforge'

interface Row {
  proyecto_id: string
  proyecto_nombre?: string
  anio: number
  trimestre: number
  cantidad: number
  importe_total: number
}

const loading = ref(true)
const pendientes = ref<{ proyecto_id: string; anio: number; trimestre: number; importe: number }[]>([])
const proyectosMap = ref<Map<string, string>>(new Map())

const resumenPorProyecto = ref<Row[]>([])

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

onMounted(async () => {
  loading.value = true
  try {
    const { data: rows, error } = await insforge.database
      .from('comprador_pagos_trimestre')
      .select('proyecto_id, anio, trimestre, importe')
      .eq('estado', 'Pendiente')
      .order('anio', { ascending: false })
      .order('trimestre', { ascending: false })
    if (error) throw error
    pendientes.value = (rows ?? []) as { proyecto_id: string; anio: number; trimestre: number; importe: number }[]

    const ids = [...new Set(pendientes.value.map((r) => r.proyecto_id))]
    if (ids.length > 0) {
      const { data: proys } = await insforge.database
        .from('proyectos')
        .select('id, nombre_proyecto')
        .in('id', ids)
      const map = new Map<string, string>()
      for (const p of (proys ?? []) as { id: string; nombre_proyecto: string }[]) {
        map.set(p.id, p.nombre_proyecto)
      }
      proyectosMap.value = map
    }

    const byKey = new Map<string, { cantidad: number; importe_total: number }>()
    for (const r of pendientes.value) {
      const key = `${r.proyecto_id}-${r.anio}-${r.trimestre}`
      const prev = byKey.get(key) ?? { cantidad: 0, importe_total: 0 }
      byKey.set(key, {
        cantidad: prev.cantidad + 1,
        importe_total: prev.importe_total + Number(r.importe || 0),
      })
    }
    resumenPorProyecto.value = Array.from(byKey.entries()).map(([key, val]) => {
      const parts = key.split('-')
      const trimestre = parts.pop()!
      const anio = parts.pop()!
      const proyecto_id = parts.join('-')
      return {
        proyecto_id,
        proyecto_nombre: proyectosMap.value.get(proyecto_id),
        anio: Number(anio),
        trimestre: Number(trimestre),
        cantidad: val.cantidad,
        importe_total: val.importe_total,
      }
    })
  } catch (_) {
    resumenPorProyecto.value = []
  } finally {
    loading.value = false
  }
})
</script>
