<template>
  <section class="py-14 bg-[#f7f7f7]">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div
        class="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl p-8 sm:p-10 border border-[#dddddd] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.06)]"
      >
        <div>
          <h2 class="text-2xl sm:text-3xl font-semibold mb-2 text-[#222222]">
            ¿Buscas alquilar?
          </h2>
          <p class="text-[#6a6a6a]">
            Temporada entera (Sep-Jul) o dias sueltos. Apartamentos con todas las comodidades y mapa para elegir ubicacion.
          </p>
        </div>
        <router-link
          to="/alquileres"
          class="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-semibold text-white bg-[#ff385c] hover:bg-[#e03150] transition-colors shadow-[0_8px_20px_rgba(255,56,92,0.3)]"
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
