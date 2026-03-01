<template>
  <section class="py-24 bg-[#E1DBD6] relative overflow-hidden">
    <!-- Elementos decorativos -->
    <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
      <div class="text-center mb-16 benefits-header">
        <h2 class="text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight font-syne">
          <span class="text-brand-500">Beneficios</span>
        </h2>
        <p class="text-xl text-gray-700 max-w-2xl mx-auto">
          Un ecosistema diseñado para maximizar el valor tanto para inversores como para promotores.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <!-- For Investors -->
        <div class="benefits-column">
          <h3 class="text-2xl font-bold mb-8 text-center text-gray-900 flex items-center justify-center gap-3 font-syne">
            <span class="w-8 h-px bg-brand-500"></span>
            Para los inversores
            <span class="w-8 h-px bg-brand-500"></span>
          </h3>
          <div class="space-y-5">
            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">Gestione sus inversiones en tiempo real</h4>
              <p class="text-gray-600 leading-relaxed">Nuestro sistema automatizado facilita mucho el proceso.</p>
            </div>

            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">Pagos regulares de intereses</h4>
              <p class="text-gray-600 leading-relaxed">Reinvertir o Retirar</p>
            </div>

            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">La piel en el juego</h4>
              <p class="text-gray-600 leading-relaxed">Invertimos al menos el 20% de nuestros propios fondos en cada proyecto.</p>
            </div>

            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">Sólo proyectos verificados</h4>
              <p class="text-gray-600 leading-relaxed">Cada proyecto es revisado cuidadosamente por nuestro equipo jurídico.</p>
            </div>

            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">Sin comisiones de inversión</h4>
              <p class="text-gray-600 leading-relaxed">Sin gastos por ingresar dinero en su cuenta.</p>
            </div>

            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">Pago automático en su cuenta</h4>
              <p class="text-gray-600 leading-relaxed">Su cuenta se abonará automáticamente de acuerdo con las condiciones del proyecto.</p>
            </div>
          </div>
        </div>

        <!-- For Developers -->
        <div class="benefits-column">
          <h3 class="text-2xl font-bold mb-8 text-center text-gray-900 flex items-center justify-center gap-3 font-syne">
            <span class="w-8 h-px bg-brand-500"></span>
            Para el promotor
            <span class="w-8 h-px bg-brand-500"></span>
          </h3>
          <div class="space-y-5">
            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">Proceso automatizado</h4>
              <p class="text-gray-600 leading-relaxed">El proceso es sencillo y gestionado por su parte</p>
            </div>

            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">Seguimiento en tiempo real</h4>
              <p class="text-gray-600 leading-relaxed">Seguimiento de la recaudación de fondos</p>
            </div>

            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">Crear varios proyectos</h4>
              <p class="text-gray-600 leading-relaxed">Puedes tener tantos proyectos de recaudación de fondos como necesites</p>
            </div>

            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">Recaudación rápida de fondos</h4>
              <p class="text-gray-600 leading-relaxed">Complete su proyecto de recaudación de fondos en semanas, incluso días</p>
            </div>

            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">Enlace con los inversores</h4>
              <p class="text-gray-600 leading-relaxed">Conéctese a nuestra amplia red de inversores</p>
            </div>

            <div class="benefit-card bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group">
              <h4 class="text-lg font-bold mb-2 text-gray-900 group-hover:text-brand-500 transition-colors">Fácil proceso de verificación</h4>
              <p class="text-gray-600 leading-relaxed">Cree una cuenta, añada información y prepárese para recaudar fondos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  gsap.fromTo('.benefits-header',
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.benefits-header',
        start: 'top 85%',
      }
    }
  )

  gsap.utils.toArray('.benefits-column').forEach((col: any) => {
    gsap.fromTo(col.querySelectorAll('.benefit-card'),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: col,
          start: 'top 80%',
        }
      }
    )
  })
})
</script>
