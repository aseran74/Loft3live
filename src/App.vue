<template>
  <ThemeProvider>
    <SidebarProvider>
      <div v-if="loading" class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p class="text-sm text-gray-500 dark:text-gray-400">Cargando sesión…</p>
      </div>
      <RouterView v-else />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import { useAuth } from './composables/useAuth'

const { initSession, loading } = useAuth()

onMounted(() => {
  initSession()
})
</script>
