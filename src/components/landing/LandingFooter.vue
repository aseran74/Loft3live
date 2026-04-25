<template>
  <footer class="pt-16 pb-10 lg:py-24 lg:px-6 bg-[#ffffff] text-[#222222] relative overflow-hidden border-t border-[#e8e8e8]">
    <!-- Decoración sutil -->
    <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#dddddd] to-transparent"></div>
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16">
        <!-- Logo and Description -->
        <div class="flex flex-col items-start">
          <router-link to="/" class="inline-flex items-center hover:opacity-90 transition-opacity mb-6">
            <img
              src="/images/images/loft2live-logo-blanco.png"
              alt="Loft2Live - Logo"
              class="h-24 w-auto object-contain"
              loading="lazy"
            />
          </router-link>
          <p class="text-[#6a6a6a] text-sm leading-relaxed max-w-xs">
            Transformamos oficinas infrautilizadas en espacios híbridos para vivir y trabajar. La revolución del Flexliving.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-lg mb-6 text-[#222222] tracking-wide">Enlaces rapidos</h4>
          <ul class="space-y-3 list-none pl-0 m-0">
            <li>
              <router-link to="/inversiones" class="text-[#6a6a6a] hover:text-[#ff385c] transition-colors">Compra</router-link>
            </li>
            <li>
              <router-link to="/alquileres" class="text-[#6a6a6a] hover:text-[#ff385c] transition-colors">Alquileres</router-link>
            </li>
            <li>
              <router-link to="/alquileres/temporada" class="text-gray-400 hover:text-brand-400 transition-colors">Temporada entera</router-link>
            </li>
            <li>
              <router-link to="/alquileres/corta-estancia" class="text-gray-400 hover:text-brand-400 transition-colors">Corta estancia</router-link>
            </li>
            <li>
              <router-link to="/inversiones#preguntas" class="text-gray-400 hover:text-brand-400 transition-colors">Preguntas frecuentes</router-link>
            </li>
            <li>
              <router-link to="/quienes-somos" class="text-gray-400 hover:text-brand-400 transition-colors">Quiénes somos</router-link>
            </li>
            <li>
              <router-link to="/blog" class="text-gray-400 hover:text-brand-400 transition-colors">Blog</router-link>
            </li>
          </ul>
        </div>

        <!-- Legal Documents -->
        <div>
          <h4 class="font-semibold text-lg mb-6 text-[#222222] tracking-wide">Documentos legales</h4>
          <ul class="space-y-3 list-none pl-0 m-0">
            <li>
              <a href="#" class="text-[#6a6a6a] hover:text-[#ff385c] transition-colors">Normas de la plataforma</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-brand-400 transition-colors">Acuerdo de participación</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-brand-400 transition-colors">GDPR</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-brand-400 transition-colors">Condiciones generales</a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-brand-400 transition-colors">Normativa</a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-semibold text-lg mb-6 text-[#222222] tracking-wide">Contacto</h4>
          <ul class="space-y-4 list-none pl-0 m-0">
            <li class="flex items-center gap-3 text-[#6a6a6a]">
              <svg class="w-5 h-5 text-[#ff385c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@loftandlive.com" class="hover:text-[#ff385c] transition-colors">info@loftandlive.com</a>
            </li>
            <li class="flex items-start gap-3 text-[#6a6a6a]">
              <svg class="w-5 h-5 text-[#ff385c] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="leading-relaxed">
                Jungmannova 26/15<br />
                Praha 1 - Nové Město, 110 00
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div class="pt-8 border-t border-[#e8e8e8]">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-[#8b8b8b]">
            Copyright © LoftAndLive 2026
          </p>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-[#8b8b8b] font-medium">LoftAndLive s.r.o.</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
