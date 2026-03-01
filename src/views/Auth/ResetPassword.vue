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
        <div class="text-center">
          <h1 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">Restablecer contraseña</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Esta funcionalidad estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
</script>
