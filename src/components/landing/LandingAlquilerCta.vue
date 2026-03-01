<template>
  <section class="py-12 bg-white border-y border-gray-100">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl p-8 shadow-lg" style="background: linear-gradient(135deg, #F2F2F2 0%, #E8E8E8 100%); border: 1px solid #C8D9B0">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold mb-2" style="color: #0D0D0D">
            ¿Buscas alquilar?
          </h2>
          <p class="text-gray-600">
            Temporada entera (Sep–Jul) o días sueltos. Lofts con todas las comodidades y mapa para elegir ubicación.
          </p>
        </div>
        <router-link
          to="/alquileres"
          class="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-semibold text-white hover:opacity-95 transition-opacity"
          style="background: linear-gradient(135deg, #2793F2, #1a6bb8); box-shadow: 0 4px 14px rgba(39, 147, 242, 0.4)"
        >
          Ver alquileres
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
