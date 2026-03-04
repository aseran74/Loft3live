<template>
  <router-link to="/" class="flex items-center">
    <img
      class="h-16 w-auto lg:h-20 block dark:hidden"
      src="/images/images/loft2live-logo-color.png"
      alt="Loft2live"
    />
    <img
      class="h-16 w-auto lg:h-20 hidden dark:block"
      src="/images/images/loft2live-logo-blanco.png"
      alt="Loft2live"
    />
  </router-link>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
