<template>
  <div class="mt-6">
    <h2 class="text-xl sm:text-2xl font-bold mb-2 text-gray-800 dark:text-white">Instalaciones reservables</h2>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Instalaciones que los inquilinos pueden reservar (sala podcast, pista de pádel, barbacoa, etc.). Añade las que tenga este proyecto.
    </p>
    <div class="space-y-3">
      <div
        v-for="inst in instalacionesDef"
        :key="inst.tipo"
        class="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 bg-white dark:bg-gray-800"
        :class="instalacionesProyectoMap.get(inst.tipo) ? '' : 'opacity-90'"
        style="border-color: #C8D9B0"
      >
        <div>
          <h3 class="text-base font-semibold text-gray-800 dark:text-white">{{ inst.label }}</h3>
          <p v-if="inst.descripcion" class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{{ inst.descripcion }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Duración por defecto: {{ inst.duracionMinutos }} min
            <template v-if="instalacionesProyectoMap.get(inst.tipo)?.duracion_minutos">
              · En proyecto: {{ instalacionesProyectoMap.get(inst.tipo)!.duracion_minutos }} min
            </template>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <template v-if="instalacionesProyectoMap.get(inst.tipo)">
            <input
              v-model.number="instalacionesProyectoMap.get(inst.tipo)!.duracion_minutos"
              type="number"
              min="15"
              step="15"
              class="w-20 rounded-lg border border-gray-300 dark:border-gray-600 px-2 py-1 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              @change="actualizarDuracion(inst.tipo)"
            />
            <span class="text-sm text-gray-500">min</span>
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 text-sm font-medium border transition-colors hover:opacity-80 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              @click="quitar(inst.tipo)"
            >
              Quitar
            </button>
          </template>
          <button
            v-else
            type="button"
            class="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-50"
            style="background: linear-gradient(135deg, #C8D9B0, #2793F2)"
            :disabled="guardando"
            @click="anadir(inst)"
          >
            Añadir al proyecto
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { insforge } from '@/lib/insforge'
import { instalacionesDef, getInstalacionByTipo, type InstalacionDef } from '@/utils/instalaciones'

const props = defineProps<{
  proyectoId: string | null
}>()

interface ProyectoInstalacionRow {
  id: string
  proyecto_id: string
  instalacion_tipo: string
  duracion_minutos: number | null
  activo: boolean
}

const proyectoInstalaciones = ref<ProyectoInstalacionRow[]>([])
const guardando = ref(false)

const instalacionesProyectoMap = computed(() => {
  const map = new Map<string, { id: string; duracion_minutos: number }>()
  for (const row of proyectoInstalaciones.value) {
    map.set(row.instalacion_tipo, {
      id: row.id,
      duracion_minutos: row.duracion_minutos ?? getInstalacionByTipo(row.instalacion_tipo)?.duracionMinutos ?? 60,
    })
  }
  return map
})

async function load() {
  if (!props.proyectoId) {
    proyectoInstalaciones.value = []
    return
  }
  const { data, error: err } = await insforge.database
    .from('proyecto_instalaciones')
    .select('id, proyecto_id, instalacion_tipo, duracion_minutos, activo')
    .eq('proyecto_id', props.proyectoId)
  if (err) {
    console.error('Error cargando instalaciones del proyecto', err)
    proyectoInstalaciones.value = []
    return
  }
  proyectoInstalaciones.value = (data ?? []) as ProyectoInstalacionRow[]
}

async function anadir(inst: InstalacionDef) {
  if (!props.proyectoId) return
  guardando.value = true
  try {
    const { error: err } = await insforge.database.from('proyecto_instalaciones').insert({
      proyecto_id: props.proyectoId,
      instalacion_tipo: inst.tipo,
      duracion_minutos: inst.duracionMinutos,
      activo: true,
    })
    if (err) throw err
    await load()
  } catch (e) {
    console.error(e)
    alert('Error al añadir la instalación')
  } finally {
    guardando.value = false
  }
}

async function quitar(tipo: string) {
  if (!props.proyectoId) return
  const row = proyectoInstalaciones.value.find((r) => r.instalacion_tipo === tipo)
  if (!row) return
  if (!confirm('¿Quitar esta instalación del proyecto? Las reservas existentes no se borran.')) return
  try {
    const { error: err } = await insforge.database.from('proyecto_instalaciones').delete().eq('id', row.id)
    if (err) throw err
    await load()
  } catch (e) {
    console.error(e)
    alert('Error al quitar la instalación')
  }
}

async function actualizarDuracion(tipo: string) {
  const entry = instalacionesProyectoMap.value.get(tipo)
  const row = proyectoInstalaciones.value.find((r) => r.instalacion_tipo === tipo)
  if (!entry || !row || !props.proyectoId) return
  const duracion = entry.duracion_minutos
  if (duracion == null || duracion < 15) return
  try {
    const { error: err } = await insforge.database
      .from('proyecto_instalaciones')
      .update({ duracion_minutos: duracion, updated_at: new Date().toISOString() })
      .eq('id', row.id)
    if (err) throw err
    await load()
  } catch (e) {
    console.error(e)
    alert('Error al actualizar la duración')
  }
}

watch(
  () => props.proyectoId,
  (id) => { if (id) load() },
  { immediate: true }
)
</script>
