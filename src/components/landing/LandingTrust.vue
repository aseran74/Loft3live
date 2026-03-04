<template>
  <section class="trust-section">
    <!-- Fondo texturizado -->
    <div class="bg-noise"></div>
    <div class="bg-grid"></div>

    <!-- Orbes de fondo -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <div class="container">

      <!-- Header -->
      <div class="trust-header">
        <div class="label-pill">
          <span class="pulse-dot"></span>
          Plataforma activa
        </div>
        <h2 class="headline">
          Confianza de los clientes,<br />
          <em>la base de nuestro negocio</em>
        </h2>
        <p class="subtext">
          LoftAndLive es una plataforma inmobiliaria P2P impulsada por
          <strong>Grupo Vihorev</strong>. Nuestros logros hablan por sí solos:
        </p>
        <a href="#descubre-como" class="cta-btn">
          <span>Descubre cómo</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>

      <!-- Hero Stats -->
      <div v-if="loading" class="hero-stats trust-stats text-gray-500 text-center py-8">
        Cargando estadísticas...
      </div>
      <div v-else class="hero-stats trust-stats">
        <div class="stat-card" v-for="stat in heroStats" :key="stat.label">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-value">
            <span class="counter" :data-target="stat.value">0</span>{{ stat.suffix }}
          </div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-bar">
            <div class="stat-bar-fill" :style="{ '--bar-width': stat.barWidth }"></div>
          </div>
        </div>
      </div>

      <!-- Detailed Cards -->
      <div v-if="!loading" class="detail-grid trust-table">
        <!-- Phase Cards -->
        <div
          class="phase-card"
          v-for="phase in phases"
          :key="phase.title"
          :class="`phase-${phase.color}`"
        >
          <div class="phase-header">
            <div class="phase-badge" :class="`badge-${phase.color}`">
              <span class="badge-dot"></span>
              {{ phase.title }}
            </div>
            <div class="phase-units">{{ phase.units }} <span>uds.</span></div>
          </div>

          <div class="phase-metrics">
            <div class="metric" v-for="m in phase.metrics" :key="m.label">
              <span class="metric-label">{{ m.label }}</span>
              <span class="metric-value">{{ m.value }}</span>
            </div>
          </div>

          <div class="phase-gross">
            <span class="gross-label">Valor bruto</span>
            <span class="gross-value">{{ phase.grossValue }}</span>
          </div>
        </div>

        <!-- Total Card -->
        <div class="total-card">
          <div class="total-header">
            <span class="total-label">Total acumulado</span>
            <div class="total-logo">GL</div>
          </div>
          <div class="total-grid">
            <div class="total-item" v-for="item in totalItems" :key="item.label">
              <div class="total-value">{{ item.value }}</div>
              <div class="total-item-label">{{ item.label }}</div>
            </div>
          </div>
          <div class="total-divider"></div>
          <div class="total-highlight">
            <span>Rentabilidad potencial</span>
            <span class="roi">+{{ roiPercent }}%</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { fetchLandingTrustStats } from '@/utils/landingTrustStats'
import type { HeroStat, Phase, TotalItem } from '@/utils/landingTrustStats'

gsap.registerPlugin(ScrollTrigger)

const loading = ref(true)
const heroStats = ref<HeroStat[]>([])
const phases = ref<Phase[]>([])
const totalItems = ref<TotalItem[]>([])
const roiPercent = ref('29.8')

let ctx: gsap.Context | undefined

function runAnimations() {
  ctx = gsap.context(() => {
    // Header animation
    gsap.fromTo('.trust-header > *',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.trust-header', start: 'top 80%' }
      }
    )

    // Stat cards
    gsap.fromTo('.stat-card',
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.1, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.trust-stats', start: 'top 85%' }
      }
    )

    // Bar fills
    gsap.fromTo('.stat-bar-fill',
      { scaleX: 0 },
      {
        scaleX: 1, duration: 1.2, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.trust-stats', start: 'top 85%' }
      }
    )

    // Counters
    document.querySelectorAll('.counter').forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target') || '0')
      gsap.to(counter, {
        innerHTML: target, duration: 2, snap: { innerHTML: 1 }, ease: 'power2.out',
        scrollTrigger: { trigger: '.trust-stats', start: 'top 85%' }
      })
    })

    // Phase cards
    gsap.fromTo('.phase-card',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.trust-table', start: 'top 85%' }
      }
    )

    // Total card
    gsap.fromTo('.total-card',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power3.out',
        scrollTrigger: { trigger: '.trust-table', start: 'top 85%' }
      }
    )
  })
}

onMounted(async () => {
  try {
    const stats = await fetchLandingTrustStats(true)
    heroStats.value = stats.heroStats
    phases.value = stats.phases
    totalItems.value = stats.totalItems
    roiPercent.value = stats.roiPercent
  } catch (e) {
    console.warn('[LandingTrust] Error cargando estadísticas:', e)
  } finally {
    loading.value = false
  }
  await nextTick()
  runAnimations()
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
/* Fuentes Outfit y Switzer cargadas en index.html */

/* ─── Base ─────────────────────────────────────────────── */
.trust-section {
  position: relative;
  padding: 7rem 0 6rem;
  background: #E1DBD6;
  overflow: hidden;
  font-family: 'Outfit', 'Switzer', sans-serif;
}

/* ─── Background Effects ───────────────────────────────── */
.bg-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: 0.4;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
}
.orb-1 {
  width: 500px; height: 500px;
  top: -100px; right: -80px;
  background: radial-gradient(circle, rgba(99, 179, 237, 0.15) 0%, transparent 70%);
}
.orb-2 {
  width: 400px; height: 400px;
  bottom: -60px; left: -60px;
  background: radial-gradient(circle, rgba(154, 230, 180, 0.1) 0%, transparent 70%);
}
.orb-3 {
  width: 300px; height: 300px;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(237, 137, 54, 0.06) 0%, transparent 70%);
}

/* ─── Container ────────────────────────────────────────── */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 10;
}

/* ─── Header ────────────────────────────────────────────── */
.trust-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 5rem;
}

.label-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.12);
  color: #000000;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 1.5rem;
}

.pulse-dot {
  width: 8px; height: 8px;
  background: #68d391;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}

.headline {
  font-family: 'Outfit', 'Switzer', sans-serif;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 700;
  color: #000000;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}
.headline em {
  font-style: italic;
  color: #000000;
}

.subtext {
  font-size: 1.05rem;
  color: #000000;
  line-height: 1.7;
  margin-bottom: 2rem;
}
.subtext strong { color: #000000; font-weight: 600; }

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #3182ce, #2b6cb0);
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 14px 28px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 0 0 0 rgba(49, 130, 206, 0.4);
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(49, 130, 206, 0.35);
}
.cta-btn svg { transition: transform 0.2s; }
.cta-btn:hover svg { transform: translateX(4px); }

/* ─── Hero Stats ───────────────────────────────────────── */
.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

@media (max-width: 900px) { .hero-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .hero-stats { grid-template-columns: 1fr; } }

.stat-card {
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 20px;
  padding: 1.75rem 1.5rem;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
  backdrop-filter: blur(10px);
}
.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 60%);
  border-radius: 20px;
}
.stat-card:hover {
  border-color: rgba(0,0,0,0.2);
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 1.6rem;
  margin-bottom: 0.75rem;
  filter: grayscale(0.2);
}

.stat-value {
  font-family: 'Outfit', 'Switzer', sans-serif;
  font-size: 2.4rem;
  font-weight: 500;
  color: #000000;
  line-height: 1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.03em;
}

.stat-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}

.stat-bar {
  height: 3px;
  background: rgba(0,0,0,0.12);
  border-radius: 99px;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  width: var(--bar-width);
  background: linear-gradient(90deg, #3182ce, #63b3ed);
  border-radius: 99px;
  transform-origin: left;
}

/* ─── Detail Grid ──────────────────────────────────────── */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

@media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr; } }

/* Phase Cards */
.phase-card {
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 20px;
  padding: 1.75rem;
  transition: border-color 0.3s, transform 0.3s;
  backdrop-filter: blur(10px);
}
.phase-card:hover {
  transform: translateY(-4px);
}
.phase-green:hover { border-color: rgba(0,0,0,0.2); }
.phase-blue:hover { border-color: rgba(0,0,0,0.2); }
.phase-orange:hover { border-color: rgba(0,0,0,0.2); }

.phase-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.phase-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 5px 12px;
  border-radius: 99px;
}
.badge-green { background: rgba(72, 187, 120, 0.2); color: #0d7d3d; }
.badge-blue  { background: rgba(99, 179, 237, 0.2); color: #1e5a8e; }
.badge-orange{ background: rgba(237, 137, 54, 0.2); color: #b45309; }

.badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.phase-units {
  font-family: 'Outfit', 'Switzer', sans-serif;
  font-size: 1.8rem;
  font-weight: 500;
  color: #000000;
}
.phase-units span { font-size: 0.9rem; color: #000000; margin-left: 2px; }

.phase-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 1.25rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
.metric:last-child { border-bottom: none; }
.metric-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.metric-value {
  font-family: 'Outfit', 'Switzer', sans-serif;
  font-size: 0.95rem;
  color: #000000;
}

.phase-gross {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: rgba(0,0,0,0.04);
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.08);
}
.gross-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #000000;
}
.gross-value {
  font-family: 'Outfit', 'Switzer', sans-serif;
  font-size: 1.15rem;
  font-weight: 500;
  color: #000000;
}

/* Total Card */
.total-card {
  grid-column: 1 / -1;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 20px;
  padding: 2rem 2.25rem;
  backdrop-filter: blur(10px);
}

.total-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
}
.total-label {
  font-family: 'Outfit', 'Switzer', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: #000000;
}
.total-logo {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #3182ce, #2b6cb0);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700; color: white;
  letter-spacing: 0.05em;
}

.total-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
@media (max-width: 700px) { .total-grid { grid-template-columns: repeat(2, 1fr); } }

.total-item {}
.total-value {
  font-family: 'Outfit', 'Switzer', sans-serif;
  font-size: 1.65rem;
  font-weight: 500;
  color: #000000;
  margin-bottom: 0.25rem;
}
.total-item-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: #000000;
}

.total-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent);
  margin-bottom: 1.25rem;
}

.total-highlight {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total-highlight span:first-child {
  font-size: 0.82rem;
  font-weight: 600;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.roi {
  font-family: 'Outfit', 'Switzer', sans-serif;
  font-size: 1.5rem;
  font-weight: 500;
  color: #0d7d3d;
  letter-spacing: -0.02em;
}
</style>