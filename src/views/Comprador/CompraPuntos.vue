<template>
  <CompradorLayout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Compra de puntos</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Canjea el importe del <strong>trimestre pendiente</strong> (aún no cobrado) por puntos. Los trimestres ya pagados no se pueden canjear. 1 € = 1 punto.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <div v-if="!comprador?.id" class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <p class="text-gray-500 dark:text-gray-400">No se ha cargado tu perfil de comprador.</p>
    </div>

    <template v-else>
      <!-- Saldo de puntos -->
      <div class="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-1 text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Tu saldo de puntos</h2>
        <p class="text-4xl font-bold text-brand-600 dark:text-brand-400">{{ saldoPuntos }}</p>
      </div>

      <!-- Trimestre pendiente (único que se puede canjear por puntos) -->
      <div class="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="border-b border-gray-100 bg-gray-50/80 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/80">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Trimestre pendiente (disponible para canjear por puntos)</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Solo puedes canjear el importe del trimestre con estado <strong>Pendiente</strong> (aún no cobrado). Los trimestres ya pagados no se pueden canjear.
          </p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Año</th>
                <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Trimestre</th>
                <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Importe pendiente</th>
                <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Ya canjeado</th>
                <th class="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Disponible</th>
                <th class="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in pagosTrimestreOrdenados"
                :key="`${p.anio}-${p.trimestre}`"
                class="border-t border-gray-100 dark:border-gray-700"
              >
                <td class="px-4 py-3">{{ p.anio }}</td>
                <td class="px-4 py-3">T{{ p.trimestre }}</td>
                <td class="px-4 py-3 text-right">{{ formatCurrency(p.importe) }}</td>
                <td class="px-4 py-3 text-right">{{ formatCurrency(p.yaCanjeado) }}</td>
                <td class="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">{{ formatCurrency(p.disponible) }}</td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      p.estado === 'Pagado'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
                    ]"
                  >
                    {{ p.estado }}
                  </span>
                </td>
              </tr>
              <tr v-if="pagosTrimestreOrdenados.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No hay trimestre pendiente todavía.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Formulario: canjear dinero por puntos -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Canjear dinero por puntos</h2>
        <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Elige el <strong>trimestre pendiente</strong> (aún no cobrado) y el importe (en €) que quieres canjear por puntos. Recibirás el mismo número de puntos (1 € = 1 punto).
        </p>
        <form class="space-y-4" @submit.prevent="canjear">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Año</label>
              <select
                v-model="form.anio"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              >
                <option value="">Selecciona año</option>
                <option
                  v-for="y in añosDisponibles"
                  :key="y"
                  :value="y"
                >
                  {{ y }}
                </option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Trimestre</label>
              <select
                v-model="form.trimestre"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              >
                <option value="">Selecciona trimestre</option>
                <option
                  v-for="p in trimestresParaAnioSeleccionado"
                  :key="p.key"
                  :value="p.trimestre"
                >
                  T{{ p.trimestre }} ({{ formatCurrency(p.disponible) }} disp.)
                </option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Importe a canjear (€)</label>
              <input
                v-model.number="form.importe"
                type="number"
                min="1"
                step="1"
                placeholder="Ej: 500"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
              <p v-if="trimestreSeleccionado" class="mt-1 text-xs text-gray-500">
                Máximo: {{ formatCurrency(trimestreSeleccionado?.disponible ?? 0) }}
              </p>
            </div>
          </div>
          <div v-if="form.importe > 0" class="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800">
            Recibirás <strong>{{ Math.round(form.importe) }}</strong> puntos (1 € = 1 punto).
          </div>
          <button
            type="submit"
            class="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-50"
            :disabled="guardando || !puedeCanjear"
          >
            {{ guardando ? 'Canjeando…' : 'Canjear por puntos' }}
          </button>
        </form>
      </div>

      <!-- Historial de compras de puntos -->
      <div class="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Historial de canjes</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Fecha</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">Año / Trimestre</th>
                <th class="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Importe</th>
                <th class="px-4 py-2 text-right font-medium text-gray-700 dark:text-gray-300">Puntos</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="c in historialOrdenado"
                :key="c.id"
                class="border-t border-gray-100 dark:border-gray-700"
              >
                <td class="px-4 py-2">{{ formatoFecha(c.created_at) }}</td>
                <td class="px-4 py-2">{{ c.anio }} – T{{ c.trimestre }}</td>
                <td class="px-4 py-2 text-right">{{ formatCurrency(Number(c.importe_canjeado)) }}</td>
                <td class="px-4 py-2 text-right font-medium">{{ c.puntos }}</td>
              </tr>
              <tr v-if="historialOrdenado.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Aún no has canjeado ningún importe.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

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

const PUNTOS_POR_EURO = 1

const { comprador, isSessionExpiredError, handleSessionExpired } = useAuth()

interface PagoTrimestre {
  id: string
  comprador_id: string
  proyecto_id: string
  anio: number
  trimestre: number
  importe: number
  estado: string
}

interface CompraPuntos {
  id: string
  comprador_id: string
  anio: number
  trimestre: number
  importe_canjeado: number
  puntos: number
  created_at: string
}

const pagosTrimestre = ref<PagoTrimestre[]>([])
const comprasPuntos = ref<CompraPuntos[]>([])
const form = ref<{ anio: number | string; trimestre: number | string; importe: number }>({ anio: '', trimestre: '', importe: 0 })
const error = ref('')
const success = ref('')
const guardando = ref(false)

const saldoPuntos = computed(() =>
  comprasPuntos.value.reduce((sum, c) => sum + Number(c.puntos), 0)
)

const yaCanjeadoPorTrimestre = computed(() => {
  const map = new Map<string, number>()
  for (const c of comprasPuntos.value) {
    const key = `${c.anio}-${c.trimestre}`
    map.set(key, (map.get(key) ?? 0) + Number(c.importe_canjeado))
  }
  return map
})

const pagosTrimestreOrdenados = computed(() => {
  return [...pagosTrimestre.value]
    .sort((a, b) => a.anio !== b.anio ? a.anio - b.anio : a.trimestre - b.trimestre)
    .map((p) => {
      const key = `${p.anio}-${p.trimestre}`
      const yaCanjeado = yaCanjeadoPorTrimestre.value.get(key) ?? 0
      const importe = Number(p.importe) ?? 0
      const disponible = Math.max(0, importe - yaCanjeado)
      return {
        ...p,
        key,
        importe,
        yaCanjeado,
        disponible,
      }
    })
})

const trimestresPendientesDisponibles = computed(() =>
  pagosTrimestreOrdenados.value.filter((p) => p.estado === 'Pendiente' && p.disponible > 0)
)

const añosDisponibles = computed(() => {
  const years = new Set(trimestresPendientesDisponibles.value.map((p) => p.anio))
  return Array.from(years).sort((a, b) => b - a)
})

const trimestresParaAnioSeleccionado = computed(() => {
  const anio = form.value.anio
  if (anio == null) return []
  return trimestresPendientesDisponibles.value.filter((p) => p.anio === anio)
})

const trimestreSeleccionado = computed(() => {
  const anio = form.value.anio
  const trimestre = form.value.trimestre
  if (anio === '' || anio == null || trimestre === '' || trimestre == null) return null
  const anioNum = Number(anio)
  const trimestreNum = Number(trimestre)
  return pagosTrimestreOrdenados.value.find(
    (p) => p.anio === anioNum && p.trimestre === trimestreNum
  )
})

const maxImporte = computed(() => trimestreSeleccionado.value?.disponible ?? 0)

const puedeCanjear = computed(() => {
  const imp = Math.round(Number(form.value.importe) || 0)
  const anioOk = form.value.anio !== '' && form.value.anio != null
  const trimOk = form.value.trimestre !== '' && form.value.trimestre != null
  return anioOk && trimOk && imp >= 1 && imp <= maxImporte.value
})

const historialOrdenado = computed(() =>
  [...comprasPuntos.value].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
)

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatoFecha(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function cargarPagosTrimestre() {
  const id = comprador.value?.id
  if (!id) return
  const { data, error: err } = await insforge.database
    .from('comprador_pagos_trimestre')
    .select('id, comprador_id, proyecto_id, anio, trimestre, importe, estado')
    .eq('comprador_id', id)
    .order('anio', { ascending: false })
    .order('trimestre', { ascending: true })
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    error.value = err.message || 'Error cargando pagos'
    return
  }
  pagosTrimestre.value = (data ?? []) as PagoTrimestre[]
}

async function cargarComprasPuntos() {
  const id = comprador.value?.id
  if (!id) return
  const { data, error: err } = await insforge.database
    .from('comprador_compra_puntos')
    .select('id, comprador_id, anio, trimestre, importe_canjeado, puntos, created_at')
    .eq('comprador_id', id)
    .order('created_at', { ascending: false })
  if (err) {
    if (isSessionExpiredError(err)) { handleSessionExpired(); return }
    error.value = err.message || 'Error cargando historial'
    return
  }
  comprasPuntos.value = (data ?? []) as CompraPuntos[]
}

async function canjear() {
  if (!puedeCanjear.value || !comprador.value?.id) return
  const anio = Number(form.value.anio)
  const trimestre = Number(form.value.trimestre)
  const importe = Math.round(Number(form.value.importe) || 0)
  if (importe < 1 || importe > maxImporte.value) return
  const puntos = importe * PUNTOS_POR_EURO

  error.value = ''
  success.value = ''
  guardando.value = true
  try {
    const { error: err } = await insforge.database.from('comprador_compra_puntos').insert({
      comprador_id: comprador.value.id,
      anio,
      trimestre,
      importe_canjeado: importe,
      puntos,
    })
    if (err) throw err
    success.value = `Has canjeado ${formatCurrency(importe)} por ${puntos} puntos.`
    form.value = { anio: '', trimestre: '', importe: 0 }
    await cargarPagosTrimestre()
    await cargarComprasPuntos()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error al canjear'
  } finally {
    guardando.value = false
  }
}

async function load() {
  if (!comprador.value?.id) return
  await cargarPagosTrimestre()
  await cargarComprasPuntos()
}

watch(comprador, (c) => { if (c?.id) load() }, { immediate: true })
watch(() => form.value.anio, () => {
  form.value.trimestre = ''
})
onMounted(load)
</script>
