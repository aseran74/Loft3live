<template>
  <LandingPage v-if="!isAuthenticated" />
  <component :is="Ecommerce" v-else />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import LandingPage from '@/views/Landing/LandingPage.vue'
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated } = useAuth()
const Ecommerce = defineAsyncComponent(() => import('@/views/Ecommerce.vue'))
</script>
