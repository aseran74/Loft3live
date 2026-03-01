<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <header class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 md:px-6">
      <router-link to="/visitante" class="flex items-center gap-2">
        <img class="h-16 w-auto object-contain dark:hidden md:h-20" src="/images/images/Logodefi.png" alt="Loft2Live" />
        <img class="hidden h-16 w-auto object-contain dark:block md:h-20" src="/images/images/Logoblanco3.png" alt="Loft2Live" />
      </router-link>
      <div class="flex items-center gap-2">
        <router-link
          to="/"
          class="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
        >
          Ver web
        </router-link>
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ user?.email }}</span>
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          @click="handleSignOut"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
    <main class="flex-1 p-4 md:p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { user, signOut } = useAuth()

async function handleSignOut() {
  await signOut()
}
</script>
