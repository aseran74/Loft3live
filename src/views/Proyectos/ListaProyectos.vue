<template>
  <admin-layout>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Proyectos</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestiona los proyectos de inversión.
        </p>
      </div>
      <router-link
        to="/proyectos/crear"
        class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
      >
        + Crear proyecto
      </router-link>
    </div>

    <div v-if="loading" class="py-12 text-center text-gray-500">
      Cargando proyectos...
    </div>

    <div v-else-if="error" class="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
      {{ error }}
    </div>

    <div v-else-if="proyectos.length === 0" class="rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
      <p class="text-gray-500 dark:text-gray-400">No hay proyectos todavía.</p>
      <router-link to="/proyectos/crear" class="mt-4 inline-block text-brand-500 hover:text-brand-600 font-medium">
        Crear el primer proyecto
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ProyectoCard
        v-for="p in proyectos"
        :key="p.id"
        :proyecto="p"
        @invertir="onInvertir"
        @editar="onEditar"
        @eliminar="onEliminar"
      />
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ProyectoCard from '@/components/proyectos/ProyectoCard.vue'
import { insforge } from '@/lib/insforge'
import type { Proyecto } from '@/types/proyecto'

const router = useRouter()
const proyectos = ref<Proyecto[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const { data, error: err } = await insforge.database
    .from('proyectos')
    .select()
    .order('created_at', { ascending: false })
  if (err) {
    error.value = err.message || 'Error al cargar proyectos'
  } else {
    proyectos.value = (data || []) as Proyecto[]
  }
  loading.value = false
})

function onInvertir(proyecto: Proyecto) {
  // TODO: Implementar flujo de inversión
  console.log('Invertir en:', proyecto.nombre_proyecto)
}

function onEditar(proyecto: Proyecto) {
  router.push(`/proyectos/${proyecto.id}/editar`)
}

async function onEliminar(proyecto: Proyecto) {
  const confirmado = confirm(
    `¿Seguro que quieres eliminar "${proyecto.nombre_proyecto}"? Esta acción no se puede deshacer.`
  )
  if (!confirmado) return

  const { error: err } = await insforge.database
    .from('proyectos')
    .delete()
    .eq('id', proyecto.id)

  if (err) {
    error.value = err.message || 'Error al eliminar proyecto'
    return
  }

  proyectos.value = proyectos.value.filter((p) => p.id !== proyecto.id)
}
</script>
