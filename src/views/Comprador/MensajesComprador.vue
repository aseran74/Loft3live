<template>
  <CompradorLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Mensajes</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Consulta los mensajes que te ha enviado el equipo y el tablón de anuncios de tu proyecto.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>

    <div class="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
      <button
        type="button"
        class="border-b-2 px-4 py-2 text-sm font-medium transition-colors"
        :class="tabActivo === 'recibidos' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'"
        @click="tabActivo = 'recibidos'"
      >
        Mensajes recibidos
      </button>
      <button
        type="button"
        class="border-b-2 px-4 py-2 text-sm font-medium transition-colors"
        :class="tabActivo === 'tablon' ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'"
        @click="tabActivo = 'tablon'"
      >
        Tablón de anuncios
      </button>
    </div>

    <!-- Tab: Mensajes recibidos -->
    <div v-show="tabActivo === 'recibidos'" class="space-y-4">
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Mensajes recibidos</h2>
        <ul class="space-y-3">
          <li
            v-for="m in mensajesRecibidos"
            :key="m.id"
            class="rounded-lg border border-gray-100 p-4 dark:border-gray-600"
          >
            <p class="font-medium text-gray-900 dark:text-white">{{ m.asunto }}</p>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{{ m.cuerpo }}</p>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ formatoFecha(m.created_at) }}</p>
          </li>
          <li v-if="mensajesRecibidos.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            No tienes mensajes recibidos.
          </li>
        </ul>
      </div>
    </div>

    <!-- Tab: Tablón de anuncios -->
    <div v-show="tabActivo === 'tablon'" class="space-y-4">
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Tablón de anuncios</h2>
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Anuncios, ofertas y avisos de tu proyecto y generales.
        </p>
        <div class="space-y-3">
          <article
            v-for="a in tablonFiltrado"
            :key="a.id"
            class="rounded-xl border p-4 dark:border-gray-600"
            :class="{
              'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20': a.tipo === 'oferta',
              'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20': a.tipo === 'quedada',
              'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800': a.tipo === 'anuncio',
            }"
          >
            <span
              class="rounded px-2 py-0.5 text-xs font-medium"
              :class="{
                'bg-amber-200 text-amber-800 dark:bg-amber-700 dark:text-amber-100': a.tipo === 'oferta',
                'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100': a.tipo === 'quedada',
                'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200': a.tipo === 'anuncio',
              }"
            >
              {{ etiquetaTipo(a.tipo) }}
            </span>
            <h3 class="mt-2 font-semibold text-gray-900 dark:text-white">{{ a.titulo }}</h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ a.contenido }}</p>
            <p v-if="a.fecha_desde || a.fecha_hasta" class="mt-2 text-xs text-gray-500">
              {{ a.fecha_desde ? formatoFechaCorta(a.fecha_desde) : '' }}
              <span v-if="a.fecha_desde && a.fecha_hasta"> – </span>
              {{ a.fecha_hasta ? formatoFechaCorta(a.fecha_hasta) : '' }}
            </p>
            <p class="mt-1 text-xs text-gray-400">{{ formatoFecha(a.created_at) }}</p>
          </article>
          <p v-if="tablonFiltrado.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">No hay entradas en el tablón.</p>
        </div>
      </div>
    </div>

    <router-link to="/comprador" class="mt-6 inline-block text-sm font-medium text-brand-500 hover:text-brand-600">
      Volver al dashboard
    </router-link>
  </CompradorLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import CompradorLayout from '@/components/layout/CompradorLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { insforge } from '@/lib/insforge'

const { comprador, isSessionExpiredError, handleSessionExpired } = useAuth()

interface MensajeRecibido {
  id: string
  asunto: string
  cuerpo: string
  created_at: string
}

interface Anuncio {
  id: string
  proyecto_id: string | null
  tipo: string
  titulo: string
  contenido: string
  fecha_desde: string | null
  fecha_hasta: string | null
  created_at: string
}

const mensajesRecibidos = ref<MensajeRecibido[]>([])
const tablonAnuncios = ref<Anuncio[]>([])
const tabActivo = ref<'recibidos' | 'tablon'>('recibidos')
const error = ref('')

const tablonFiltrado = computed(() => {
  const pid = comprador.value?.proyecto_id
  if (!pid) return tablonAnuncios.value
  return tablonAnuncios.value.filter((a) => !a.proyecto_id || a.proyecto_id === pid)
})

function formatoFecha(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatoFechaCorta(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function etiquetaTipo(tipo: string) {
  return { oferta: 'Oferta', quedada: 'Quedada', anuncio: 'Anuncio' }[tipo] || tipo
}

async function cargarMensajesRecibidos() {
  const id = comprador.value?.id
  if (!id) return
  const { data: dest, error: errDest } = await insforge.database
    .from('mensajes_destinatarios')
    .select('mensaje_id')
    .eq('tipo', 'comprador')
    .eq('destinatario_id', id)
  if (errDest) {
    if (isSessionExpiredError(errDest)) { handleSessionExpired(); return }
    return
  }
  const ids = (dest ?? []).map((d: { mensaje_id: string }) => d.mensaje_id)
  if (ids.length === 0) {
    mensajesRecibidos.value = []
    return
  }
  const { data: mensajes, error: errMsg } = await insforge.database
    .from('mensajes')
    .select('id, asunto, cuerpo, created_at')
    .in('id', ids)
    .order('created_at', { ascending: false })
  if (errMsg) {
    if (isSessionExpiredError(errMsg)) { handleSessionExpired(); return }
    return
  }
  mensajesRecibidos.value = (mensajes ?? []) as MensajeRecibido[]
}

async function cargarTablon() {
  const { data, error: err } = await insforge.database
    .from('tablon_anuncios')
    .select('id, proyecto_id, tipo, titulo, contenido, fecha_desde, fecha_hasta, created_at')
    .order('created_at', { ascending: false })
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    return
  }
  tablonAnuncios.value = (data ?? []) as Anuncio[]
}

async function load() {
  if (!comprador.value?.id) return
  await cargarMensajesRecibidos()
  await cargarTablon()
}

watch(comprador, (c) => {
  if (c?.id) load()
}, { immediate: true })

onMounted(load)
</script>
