<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <LandingHeader />
    <main class="pt-24">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import LandingHeader from '@/components/landing/LandingHeader.vue'
</script>
