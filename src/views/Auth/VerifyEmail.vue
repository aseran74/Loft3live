<template>
  <FullScreenLayout>
    <div class="relative flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-gray-900">
      <div class="w-full max-w-md space-y-6">
        <router-link
          to="/signin"
          class="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <svg class="stroke-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.7083 5L7.5 10.2083L12.7083 15.4167" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Volver a Sign in
        </router-link>
        <div>
          <h1 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">Verificar email</h1>
          <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Introduce el código de 6 dígitos que recibiste por email.
          </p>
          <form @submit.prevent="handleVerify">
            <div v-if="authError" class="p-4 mb-4 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
              {{ authError }}
            </div>
            <div class="space-y-4">
              <div>
                <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Email</label>
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  required
                  placeholder="tu@email.com"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10"
                />
              </div>
              <div>
                <label for="otp" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Código</label>
                <input
                  v-model="otp"
                  type="text"
                  id="otp"
                  maxlength="6"
                  placeholder="123456"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10"
                />
              </div>
              <button
                type="submit"
                :disabled="submitting"
                class="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
              >
                {{ submitting ? 'Verificando...' : 'Verificar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { insforge } from '@/lib/insforge'
import { useAuth } from '@/composables/useAuth'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const router = useRouter()
const { initSession } = useAuth()

const email = ref('')
const otp = ref('')
const submitting = ref(false)
const authError = ref('')

const handleVerify = async () => {
  authError.value = ''
  if (!email.value || !otp.value || otp.value.length !== 6) {
    authError.value = 'Introduce email y el código de 6 dígitos'
    return
  }
  submitting.value = true
  const { data, error } = await insforge.auth.verifyEmail({ email: email.value, otp: otp.value })
  submitting.value = false
  if (error) {
    authError.value = (error as { message?: string }).message || 'Código inválido'
    return
  }
  if (data) {
    await initSession()
    router.push('/')
  }
}
</script>
