<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const wrapperRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const videoEnded = ref(false)
const scrollProgress = ref(0)

// Hero4: video y frames en public/images/images/Hero4/
const HERO_VIDEO = '/images/images/Hero4/hero-landing-video.mp4'
const HERO_FRAME_BASE = '/images/images/Hero4/hero-frame-'
const heroFrameUrls = Array.from({ length: 82 }, (_, i) =>
  `${HERO_FRAME_BASE}${String(i).padStart(3, '0')}.webp`
)

// Dos capas para crossfade suave entre frames
const frameAUrl = ref(heroFrameUrls[0])
const frameBUrl = ref(heroFrameUrls[0])
const activeFrameLayer = ref<'a' | 'b'>('a')
// Opacidad del texto: aparece al hacer scroll tras el video
const textOpacity = ref(0)

let ctx: gsap.Context | undefined

function onVideoEnded() {
  videoEnded.value = true
}

function playVideo() {
  const v = videoRef.value
  if (v) v.play().catch(() => {})
}

onMounted(() => {
  // Delay 3 s antes de intentar reproducir (da tiempo a cargar y mejora autoplay en móvil)
  const tryPlay = () => {
    const video = videoRef.value
    if (video && !videoEnded.value) {
      video.muted = true
      const p = video.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
  }
  setTimeout(tryPlay, 3000)
  setTimeout(tryPlay, 3300)

  ctx = gsap.context(() => {
    if (!wrapperRef.value) return

    ScrollTrigger.create({
      trigger: wrapperRef.value,
      start: 'top top',
      end: '+=250%',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.value = self.progress
        const progress = self.progress
        if (videoEnded.value) {
          const frameIndex = Math.min(
            Math.floor(progress * heroFrameUrls.length),
            heroFrameUrls.length - 1
          )
          const newUrl = heroFrameUrls[frameIndex]
          if (activeFrameLayer.value === 'a') {
            frameBUrl.value = newUrl
            activeFrameLayer.value = 'b'
          } else {
            frameAUrl.value = newUrl
            activeFrameLayer.value = 'a'
          }
          const textProgress = Math.max(0, (progress - 0.25) / 0.4)
          textOpacity.value = Math.min(1, textProgress)
        }
      }
    })
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <div ref="wrapperRef" class="wrapper">
    <!-- Contenido fijo en viewport: video o frames + texto -->
    <div class="hero-viewport font-outfit">
      <div class="absolute inset-0 bg-black/20 z-[1]"></div>
      <!-- Video: hasta que termine (escritorio, tablet y móvil) -->
      <video
        ref="videoRef"
        v-show="!videoEnded"
        class="hero-media hero-video"
        :src="HERO_VIDEO"
        autoplay
        muted
        playsinline
        aria-label="Vídeo hero"
        @ended="onVideoEnded"
        @click="playVideo"
      />
      <!-- Imágenes estáticas de respaldo (Hero4): mismo estilo que el video -->
      <img
        v-show="!videoEnded"
        :src="heroFrameUrls[0]"
        alt="Loft2Live - Espacio flexible para vivir y trabajar"
        class="hero-media hero-image-desktop"
      />
      <img
        v-show="!videoEnded"
        :src="heroFrameUrls[0]"
        alt="Loft2Live - Espacio flexible para vivir y trabajar"
        class="hero-media hero-image-mobile-tablet"
      />

      <!-- Tras el video: frames Hero4 con crossfade + texto en el mismo hero -->
      <template v-if="videoEnded">
        <img
          :src="frameAUrl"
          alt=""
          role="presentation"
          class="hero-media hero-frame hero-frame-a"
          :class="{ 'hero-frame-visible': activeFrameLayer === 'a' }"
          loading="eager"
        />
        <img
          :src="frameBUrl"
          alt=""
          role="presentation"
          class="hero-media hero-frame hero-frame-b"
          :class="{ 'hero-frame-visible': activeFrameLayer === 'b' }"
          loading="eager"
        />
        <div class="hero-text-block z-10">
          <h1
            class="hero-subtitle hero-title"
            :style="{ opacity: textOpacity }"
          >
            <span class="hero-subtitle-line">Donde el espacio</span>
            <span class="hero-subtitle-line">trabaja para ti</span>
          </h1>
          <div class="hero-ctas" :style="{ opacity: textOpacity }">
            <a href="#como-funciona" class="hero-cta hero-cta-primary text-white">
              ¿Cómo funciona?
            </a>
            <router-link to="/alquileres" class="hero-cta hero-cta-secondary">
              Ver alquileres
            </router-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}

.hero-viewport {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

/* Frames Hero4: crossfade suave entre fotos */
.hero-frame {
  opacity: 0;
  transition: opacity 0.4s ease-out;
}

.hero-frame.hero-frame-visible {
  opacity: 1;
}

/* Video visible en todos los tamaños (móvil, tablet, escritorio) */
.hero-video {
  display: block;
}

/* Imágenes estáticas: ocultas (el video se usa en todas las vistas) */
.hero-image-desktop,
.hero-image-mobile-tablet {
  display: none;
}

.hero-text-block {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hero-subtitle {
  position: relative;
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  font-weight: 700;
  text-align: center;
  color: white;
  font-family: 'Outfit', 'Switzer', sans-serif;
  text-shadow: 2px 2px 12px rgba(0, 0, 0, 0.6);
  line-height: 1.1;
  max-width: 90%;
  padding: 0 3rem;
  margin: 0;
  pointer-events: none;
}

.hero-subtitle-line {
  display: block;
  white-space: nowrap;
}

.hero-ctas {
  position: relative;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.hero-cta {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
}

.hero-cta-primary {
  color: white;
  background: #3C9EF3;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.3);
}

.hero-cta-primary:hover {
  opacity: 0.95;
  transform: translateY(-2px);
}

.hero-cta-secondary {
  color: #0D0D0D;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid white;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.2);
}

.hero-cta-secondary:hover {
  opacity: 0.95;
  transform: translateY(-2px);
  background: white;
}

@media (max-width: 640px) {
  .hero-subtitle {
    font-size: clamp(1.25rem, 7vw, 2.25rem);
    padding: 0 1.5rem;
  }

  .hero-ctas {
    margin-top: 1.25rem;
    gap: 0.5rem;
  }

  .hero-cta {
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
  }
}
</style>
