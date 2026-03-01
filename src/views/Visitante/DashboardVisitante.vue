<template>
  <VisitanteLayout>
    <div class="mx-auto max-w-2xl">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
          Solicitar información
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Indica si te interesa recibir información para <strong>alquilar</strong> o para <strong>comprar</strong>. Nos pondremos en contacto contigo.
        </p>
      </div>

      <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
        {{ error }}
      </div>
      <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
        {{ success }}
      </div>

      <div class="grid gap-6 sm:grid-cols-2">
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30">
            <svg class="h-6 w-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Información para alquilar</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Solicita información sobre disponibilidad y condiciones de alquiler.
          </p>
          <form class="mt-4 space-y-3" @submit.prevent="enviar('alquilar')">
            <div>
              <label for="msg-alquilar" class="sr-only">Mensaje (opcional)</label>
              <textarea
                id="msg-alquilar"
                v-model="mensajeAlquilar"
                rows="2"
                placeholder="Comentario o preguntas (opcional)"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              class="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
              :disabled="enviando === 'alquilar'"
            >
              {{ enviando === 'alquilar' ? 'Enviando…' : 'Solicitar información para alquilar' }}
            </button>
          </form>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <svg class="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Información para comprar</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Solicita información sobre opciones de compra y disponibilidad.
          </p>
          <form class="mt-4 space-y-3" @submit.prevent="enviar('comprar')">
            <div>
              <label for="msg-comprar" class="sr-only">Mensaje (opcional)</label>
              <textarea
                id="msg-comprar"
                v-model="mensajeComprar"
                rows="2"
                placeholder="Comentario o preguntas (opcional)"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              class="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              :disabled="enviando === 'comprar'"
            >
              {{ enviando === 'comprar' ? 'Enviando…' : 'Solicitar información para comprar' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </VisitanteLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VisitanteLayout from '@/components/layout/VisitanteLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { insforge } from '@/lib/insforge'

const { user } = useAuth()
const error = ref('')
const success = ref('')
const enviando = ref<'alquilar' | 'comprar' | null>(null)
const mensajeAlquilar = ref('')
const mensajeComprar = ref('')

async function enviar(tipo: 'alquilar' | 'comprar') {
  if (!user.value?.email) return
  error.value = ''
  success.value = ''
  enviando.value = tipo
  const mensaje = tipo === 'alquilar' ? mensajeAlquilar.value.trim() : mensajeComprar.value.trim()
  const { error: err } = await insforge.database
    .from('solicitudes_info')
    .insert({
      email: user.value.email,
      tipo,
      mensaje: mensaje || null,
    })
  enviando.value = null
  if (err) {
    error.value = err.message || 'Error al enviar la solicitud'
    return
  }
  success.value = tipo === 'alquilar'
    ? 'Solicitud de información para alquilar enviada. Te contactaremos pronto.'
    : 'Solicitud de información para comprar enviada. Te contactaremos pronto.'
  if (tipo === 'alquilar') mensajeAlquilar.value = ''
  else mensajeComprar.value = ''
}
</script>
