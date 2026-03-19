<template>
  <section id="como-funciona" class="how-it-works-section py-16 bg-gradient-to-b from-white to-gray-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Intro -->
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
          Donde el espacio <span class="text-brand-500">trabaja para ti</span>
        </h2>
        <p class="text-xl max-w-3xl mx-auto leading-relaxed text-gray-900">
           Somos la primera plataforma de Crowfounding inmobiliario especializada <br>
            en convertir oficinas vacias en apartamentos de Flexliving. 
          <br />
        
        </p>
        <p class="text-base max-w-2xl mx-auto mt-6 text-brand-500 font-semibold">
          Ha llegado la revolución al Flexliving.
        </p>
        <div class="mt-10 flex flex-col items-center gap-2">
          <button
            type="button"
            class="ley-madrid-cta-button"
            @click="leyMadridModalOpen = true"
          >
            📜 Marco legal · Comunidad de Madrid
          </button>
          <span class="text-lg font-semibold text-gray-900">Loft2Live</span>
        </div>
      </div>

      <LandingLeyMadridModal :open="leyMadridModalOpen" @close="leyMadridModalOpen = false" />

      <!-- Slider instalaciones -->
      <div class="instalaciones-slider-section mb-16">
        <Swiper
          :modules="instalacionesSwiperModules"
          :slides-per-view="1"
          :space-between="0"
          loop
          grab-cursor
          navigation
          :pagination="{ clickable: true }"
          :autoplay="{ delay: 4000, disableOnInteraction: false }"
          class="instalaciones-swiper"
        >
          <SwiperSlide v-for="(img, i) in instalacionesImages" :key="i">
            <div class="instalaciones-slide">
              <img
                :src="img.src"
                :alt="img.alt"
                class="instalaciones-slide-img"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- ¿Cómo funciona Loft2Live? -->
      <div class="how-intro mb-14">
        <h3 class="how-intro-title">¿Cómo funciona Loft2Live?</h3>
        <p class="how-intro-text">
          Usas un mismo espacio para vivir y trabajar, con una estructura clara, flexible y defendible legalmente.
        </p>
      </div>

      <!-- Las 6 decisiones claras (nuevo texto 1-6) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <!-- 1 -->
        <div class="step-card">
          <div class="step-icon-wrapper">
            <div class="step-icon">1️⃣</div>
            <div class="step-number">1</div>
          </div>
          <h3 class="step-title">Cómo entrar</h3>
          <p class="step-description mb-3">Tres formas de participar, según tu nivel de implicación:</p>
          <ul class="niveles-list">
            <li>
              <strong class="nivel-label">Acceso flexible sin inversión</strong>
              <span class="nivel-desc">Vive y trabaja en el espacio sin necesidad de aportar capital inicial.</span>
            </li>
            <li>
              <strong class="nivel-label">Socio Flex (desde 5.000€)</strong>
              <span class="nivel-desc">Adquiere una participación del inmueble, genera ingresos proporcionales y disfruta de descuentos exclusivos en estancias.</span>
            </li>
            <li>
              <strong class="nivel-label">Compra directa de un apartamento</strong>
              <span class="nivel-desc">Control total del activo, con plena libertad de uso y gestión.</span>
            </li>
          </ul>
        </div>

        <!-- 2 -->
        <div class="step-card">
          <div class="step-icon-wrapper">
            <div class="step-icon">2️⃣</div>
            <div class="step-number">2</div>
          </div>
          <h3 class="step-title">Ventajas fiscales si compras</h3>
          <p class="step-description mb-3">Optimiza tu inversión desde el primer momento:</p>
          <ul class="step-list">
            <li><strong>Recuperación del IVA en uso profesional</strong></li>
            <li><strong>Amortización del inmueble</strong></li>
            <li><strong>Deducción de gastos operativos</strong> (suministros, mantenimiento, etc.)</li>
          </ul>
        </div>

        <!-- 3 -->
        <div class="step-card">
          <div class="step-icon-wrapper">
            <div class="step-icon">3️⃣</div>
            <div class="step-number">3</div>
          </div>
          <h3 class="step-title">Ventajas fiscales si alquilas</h3>
          <p class="step-description mb-3">Modelo optimizado y transparente, basado en el uso real:</p>
          <p class="step-description">80% uso profesional → deducible al 100%.</p>
          <p class="step-description">20% uso habitacional → deducible hasta un 30%.</p>
          <p class="step-description">Sin estructuras artificiales: fiscalidad alineada con la realidad del uso del espacio.</p>
        </div>

        <!-- 4 -->
        <div class="step-card">
          <div class="step-icon-wrapper">
            <div class="step-icon">4️⃣</div>
            <div class="step-number">4</div>
          </div>
          <h3 class="step-title">Control y movilidad</h3>
          <p class="step-description mb-3">Tu inversión, siempre bajo control:</p>
          <ul class="step-list">
            <li>Panel digital con ingresos en tiempo real</li>
            <li>Historial completo y trazabilidad</li>
            <li>Gestión de derechos desde tu perfil</li>
            <li>Contrato portable: te acompaña si cambias de ciudad</li>
          </ul>
        </div>

        <!-- 5 -->
        <div class="step-card">
          <div class="step-icon-wrapper">
            <div class="step-icon">5️⃣</div>
            <div class="step-number">5</div>
          </div>
          <h3 class="step-title">Flex Use</h3>
          <p class="step-description mb-3">Convierte el tiempo no utilizado en rentabilidad:</p>
          <ul class="step-list">
            <li>Otros miembros ocupan tu espacio cuando no lo usas</li>
            <li>Generas ingresos o créditos</li>
            <li>Canjea por estancias, servicios o reducción de cuotas</li>
          </ul>
          <button
            type="button"
            class="flex-use-example-trigger"
            @click="flexUseExampleModalOpen = true"
          >
            📍 Ver ejemplo práctico: Madrid - Barcelona
          </button>
        </div>

        <!-- 6 -->
        <div class="step-card">
          <div class="step-icon-wrapper">
            <div class="step-icon">6️⃣</div>
            <div class="step-number">6</div>
          </div>
          <h3 class="step-title">Salida sin bloqueos</h3>
          <p class="step-description mb-3">Liquidez adaptada a cada modalidad:</p>
          <ul class="step-list">
            <li><strong>Alquiler:</strong> cancelación flexible</li>
            <li><strong>Participaciones:</strong> venta dentro del ecosistema</li>
            <li><strong>Propiedad completa:</strong> venta tradicional o dentro de la red</li>
          </ul>
        </div>
      </div>

      <!-- Botón Roadmap (muestra los 6 entregables) -->
      <div class="cta-buttons-row mt-12">
        <button
          type="button"
          class="savings-cta-button roadmap-cta-button"
          :aria-expanded="roadmapVisible"
          @click="roadmapVisible = !roadmapVisible"
        >
          {{ roadmapVisible ? '🗺️ Ocultar roadmap' : '🗺️ Ver roadmap' }}
        </button>
      </div>

      <!-- Entregables Técnicos y Estratégicos (ocultos hasta pulsar Roadmap) -->
      <div v-show="roadmapVisible" class="entregables-section mt-10">
        <h3 class="text-2xl font-bold text-center mb-2 text-gray-900">🛠️ Entregables Técnicos y Estratégicos</h3>
        <p class="text-center text-gray-600 mb-10 max-w-2xl mx-auto">Borradores y esquemas para la implementación inmediata del modelo.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="deliverable-card">
            <span class="deliverable-icon">📄</span>
            <h4 class="deliverable-title">1. Borrador de Consulta Vinculante (DGT)</h4>
            <p class="step-description">Confirmar la deducibilidad de gastos en inmuebles calificados como locales con uso mixto. Se expone el caso de un profesional que adquiere un local donde, mediante proyecto técnico, se afecta el 70-80% a la actividad. Se solicita confirmación de que la afectación parcial, documentada con certificado de arquitecto y contabilidad separada, permite la deducción del IVA soportado y los gastos de explotación (Art. 30.2 LIRPF).</p>
          </div>
          <div class="deliverable-card">
            <span class="deliverable-icon">📑</span>
            <h4 class="deliverable-title">2. Whitepaper del Token (Esquema MiCA)</h4>
            <p class="step-description"><strong>Emisor:</strong> Loft2Live S.L. <strong>Tecnología:</strong> Protocolo ERC-1155 sobre red Polygon (Eco-friendly). <strong>Derechos:</strong> Acceso preferente, canje por estancias y servicios del ecosistema. <strong>Cláusula Anti-Especulación:</strong> El precio está vinculado al valor del servicio (estancia), no a mercados secundarios, eliminando la calificación de &quot;valor mobiliario&quot;.</p>
          </div>
          <div class="deliverable-card">
            <span class="deliverable-icon">✒️</span>
            <h4 class="deliverable-title">3. Modelo de Contrato Dual (Estructura)</h4>
            <p class="step-description"><strong>Parte A:</strong> Contrato de arrendamiento de local comercial (sujeto a IVA). Especifica m² y uso profesional exclusivo. <strong>Parte B:</strong> Contrato accesorio de habitación/descanso. Naturaleza inseparable del principal, uso restringido al arrendatario. <strong>Nexo:</strong> La resolución de uno implica la extinción automática del otro.</p>
          </div>
          <div class="deliverable-card">
            <span class="deliverable-icon">🧮</span>
            <h4 class="deliverable-title">4. Calculadora Fiscal Personalizada</h4>
            <p class="step-description">Para un inmueble de 350.000€ con uso 70/30: <strong>Recuperación IVA:</strong> 51.450€ (vía declaración trimestral). <strong>Deducción IRPF anual:</strong> ~9.345€ (gastos + amortización). <strong>Ahorro neto anual (30% IRPF):</strong> ~2.800€/año comparado con vivienda tradicional.</p>
          </div>
          <div class="deliverable-card">
            <span class="deliverable-icon">🗺️</span>
            <h4 class="deliverable-title">5. Roadmap Técnico Blockchain</h4>
            <p class="step-description"><strong>Fase 1:</strong> Despliegue de Smart Contracts para registro de estancias (Q1). <strong>Fase 2:</strong> Integración de Dashboard con Oráculos para datos de uso real (Q2). <strong>Fase 3:</strong> Sistema de certificación fiscal automatizado &quot;On-Chain&quot; (Q3).</p>
          </div>
          <div class="deliverable-card">
            <span class="deliverable-icon">📐</span>
            <h4 class="deliverable-title">6. Plan de Validación con Arquitecto</h4>
            <p class="step-description"><strong>Hito 1:</strong> Informe de superficies útiles por estancias. <strong>Hito 2:</strong> Memoria descriptiva de la idoneidad profesional de cada zona. <strong>Hito 3:</strong> Dossier fotográfico y técnico para defensa ante inspección de la AEAT.</p>
          </div>
        </div>
      </div>

      <!-- CTA Ahorro + Modelo compraventa + Tabla comparativa -->
      <div class="cta-buttons-row">
        <button
          type="button"
          class="savings-cta-button"
          @click="savingsModalOpen = true"
        >
          💰 ¿Cuánto voy a ahorrar?
        </button>
        <button
          type="button"
          class="savings-cta-button contract-cta-button"
          @click="contractModalOpen = true"
        >
          📄 Modelo compraventa
        </button>
        <button
          type="button"
          class="savings-cta-button arrendamiento-cta-button"
          @click="arrendamientoModalOpen = true"
        >
          📋 Contrato de arrendamiento
        </button>
        <button
          type="button"
          class="savings-cta-button comparativa-cta-button"
          @click="comparativaModalOpen = true"
        >
          📊 Comparativa 80/20 vs Tradicional
        </button>
      </div>

      <LandingSavingsModal :open="savingsModalOpen" @close="savingsModalOpen = false" />
      <LandingContractModal :open="contractModalOpen" @close="contractModalOpen = false" />
      <LandingArrendamientoModal :open="arrendamientoModalOpen" @close="arrendamientoModalOpen = false" />
      <LandingFlexUseExampleModal :open="flexUseExampleModalOpen" @close="flexUseExampleModalOpen = false" />
      <LandingComparativaModal :open="comparativaModalOpen" @close="comparativaModalOpen = false" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import LandingSavingsModal from './LandingSavingsModal.vue'
import LandingContractModal from './LandingContractModal.vue'
import LandingArrendamientoModal from './LandingArrendamientoModal.vue'
import LandingLeyMadridModal from './LandingLeyMadridModal.vue'
import LandingFlexUseExampleModal from './LandingFlexUseExampleModal.vue'
import LandingComparativaModal from './LandingComparativaModal.vue'

gsap.registerPlugin(ScrollTrigger)

const instalacionesSwiperModules = [Navigation, Pagination, Autoplay]

const instalacionesImages = [
  { src: '/images/images/Instalaciones/1760012002_Piscina(3).jpg', alt: 'Piscina' },
  { src: '/images/images/Instalaciones/Loft3_032.webp', alt: 'Instalaciones' },
  { src: '/images/images/Instalaciones/Loft3_055.webp', alt: 'Instalaciones' },
  { src: '/images/images/Instalaciones/Loft3_038.webp', alt: 'Instalaciones' },
  { src: '/images/images/Instalaciones/1760967484_5.png', alt: 'Instalaciones' },
  { src: '/images/images/Instalaciones/1760011299_Coworking.jpg', alt: 'Coworking' },
  { src: '/images/images/Instalaciones/Loft3_029.webp', alt: 'Instalaciones' },
  { src: '/images/images/Instalaciones/Whisk_idzxmwz3mgzwujnz0izjvmytgtn3qtl2gtyk1cm_063.webp', alt: 'Instalaciones' }
]

const savingsModalOpen = ref(false)
const contractModalOpen = ref(false)
const arrendamientoModalOpen = ref(false)
const leyMadridModalOpen = ref(false)
const flexUseExampleModalOpen = ref(false)
const comparativaModalOpen = ref(false)
const roadmapVisible = ref(false)

onMounted(() => {
  gsap.utils.toArray<Element>('.step-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 50,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'power2.out'
    })
  })
})
</script>

<style scoped>
/* Fuentes Outfit y Switzer en toda la sección */
.how-it-works-section,
.how-it-works-section * {
  font-family: 'Outfit', 'Switzer', sans-serif;
}

/* Variables locales para compatibilidad con el tema */
.how-it-works-section {
  --color-primary: var(--color-brand-500);
  --color-primary-foreground: #fff;
  --color-card: var(--color-white);
  --color-foreground: var(--color-gray-900);
  --color-muted-foreground: var(--color-gray-600);
  --color-muted: var(--color-gray-500);
  --color-border: var(--color-gray-200);
  --color-loft-50: var(--color-brand-25);
  --color-loft-100: var(--color-brand-100);
  --color-loft-border: var(--color-brand-200);
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-lg: 0.5rem;
}

.instalaciones-slider-section {
  display: flex;
  justify-content: center;
  width: 100%;
}

.instalaciones-swiper {
  width: 100%;
  max-width: 900px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.instalaciones-slide {
  aspect-ratio: 16 / 10;
  background: var(--color-gray-100);
}

.instalaciones-slide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.instalaciones-swiper :deep(.swiper-button-prev),
.instalaciones-swiper :deep(.swiper-button-next) {
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.instalaciones-swiper :deep(.swiper-button-prev:hover),
.instalaciones-swiper :deep(.swiper-button-next:hover) {
  background: rgba(0, 0, 0, 0.6);
}

.instalaciones-swiper :deep(.swiper-button-prev::after),
.instalaciones-swiper :deep(.swiper-button-next::after) {
  font-size: 1.25rem;
}

.instalaciones-swiper :deep(.swiper-pagination-bullet) {
  background: rgba(255, 255, 255, 0.6);
  opacity: 1;
}

.instalaciones-swiper :deep(.swiper-pagination-bullet-active) {
  background: #fff;
  transform: scale(1.2);
}

.step-card {
  background: var(--color-card);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  box-shadow: 0 4px 8px -2px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.06);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.step-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-loft-100), var(--color-primary));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.step-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.step-card:hover::before {
  transform: scaleX(1);
}

.step-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.step-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-loft-100), var(--color-primary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-foreground);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  font-size: 1.75rem;
  line-height: 1;
}

.step-card:hover .step-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 10px 20px rgba(70, 95, 255, 0.3);
}

.step-number {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-loft-100), var(--color-primary));
  color: var(--color-primary-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 4px 6px rgba(70, 95, 255, 0.3);
  z-index: 3;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-foreground);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.step-description {
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-size: 0.95rem;
}

.step-description strong {
  color: var(--color-primary);
  font-weight: 600;
}

.niveles-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.niveles-list li {
  padding: 1rem 1.25rem;
  background: var(--color-gray-50);
  border-radius: 0.75rem;
  border-left: 4px solid var(--color-primary);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.dark .niveles-list li {
  background: rgba(255, 255, 255, 0.06);
}

.nivel-label {
  color: var(--color-primary);
  font-size: 0.95rem;
  font-weight: 600;
  display: block;
}

.nivel-desc {
  color: var(--color-muted-foreground);
  font-size: 0.9rem;
  line-height: 1.5;
}

.step-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.step-list li {
  color: var(--color-muted-foreground);
  line-height: 1.7;
  font-size: 0.95rem;
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: 0.5rem;
}

.step-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: 700;
}

.flex-options,
.payment-options {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.flex-option,
.payment-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--color-gray-50);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.flex-option:hover,
.payment-option:hover {
  background: var(--color-gray-100);
  transform: translateX(4px);
}

.flex-emoji,
.payment-emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.flex-option span:last-child,
.payment-option span:last-child {
  color: var(--color-gray-600);
  font-size: 0.95rem;
}

.cta-buttons-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

.how-intro {
  text-align: center;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
}

.how-intro-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-foreground);
  margin: 0 0 1rem 0;
}

.how-intro-title::after {
  content: '';
  display: block;
  width: 48px;
  height: 4px;
  background: var(--color-primary);
  margin: 0.5rem auto 0;
  border-radius: 2px;
}

.how-intro-text {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--color-muted-foreground);
  margin: 0 0 0.75rem 0;
}

.how-intro-text strong {
  color: var(--color-primary);
}

.how-intro-sub {
  font-size: 0.95rem;
  color: var(--color-muted);
  margin: 0;
  font-weight: 500;
}

.section-block-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-foreground);
  text-align: center;
  margin: 0 0 0.25rem 0;
}

.section-block-title::after {
  content: '';
  display: block;
  width: 48px;
  height: 4px;
  background: var(--color-primary);
  margin: 0.5rem auto 0;
  border-radius: 2px;
}

.section-block-subtitle {
  font-size: 1rem;
  color: var(--color-muted-foreground);
  text-align: center;
  margin: 0 0 2rem 0;
}

.section-subtitle {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-foreground);
  text-align: center;
  margin: 2.5rem 0 0 0;
}

.section-subtitle:first-of-type {
  margin-top: 1rem;
}

.savings-cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-primary-foreground);
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-xl);
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(70, 95, 255, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.savings-cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(70, 95, 255, 0.45);
}

.contract-cta-button {
  background: linear-gradient(135deg, #4b5563, #6b7280);
  box-shadow: 0 4px 14px rgba(75, 85, 99, 0.35);
}

.contract-cta-button:hover {
  box-shadow: 0 6px 20px rgba(75, 85, 99, 0.45);
}

.roadmap-cta-button {
  background: linear-gradient(135deg, #059669, #10b981);
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
}

.roadmap-cta-button:hover {
  box-shadow: 0 6px 20px rgba(5, 150, 105, 0.45);
}

.arrendamiento-cta-button {
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
}

.arrendamiento-cta-button:hover {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
}

.ley-madrid-cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-loft-50);
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.ley-madrid-cta-button:hover {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border-color: transparent;
  transform: translateY(-2px);
}

.flex-use-example-trigger {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary);
  background: transparent;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.flex-use-example-trigger:hover {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

.entregables-section {
  padding-top: 1rem;
}

.deliverable-card {
  background: var(--color-card);
  border-radius: var(--radius-2xl);
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(16, 24, 40, 0.1), 0 1px 2px 0 rgba(16, 24, 40, 0.06);
  border: 1px solid var(--color-border);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.deliverable-card:hover {
  box-shadow: 0 12px 16px -4px rgba(16, 24, 40, 0.08);
  border-color: var(--color-loft-border);
}

.deliverable-icon {
  display: block;
  font-size: 1.75rem;
  margin-bottom: 0.75rem;
}

.deliverable-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-foreground);
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.deliverable-card .step-description {
  margin: 0;
}

.comparativa-cta-button {
  background: linear-gradient(135deg, #0d9488, #14b8a6);
  box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
}

.comparativa-cta-button:hover {
  box-shadow: 0 6px 20px rgba(13, 148, 136, 0.45);
}

@media (max-width: 768px) {
  .step-card {
    padding: 1.5rem;
  }

  .step-title {
    font-size: 1.25rem;
  }
}
</style>
