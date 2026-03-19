<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'pt-3 pb-3 px-4 sm:px-6 lg:px-8' : 'pt-2 pb-1'"
  >
    <div 
      class="mx-auto max-w-7xl transition-all duration-300"
      :class="{
        'rounded-full bg-white/20 dark:bg-gray-900/30 backdrop-blur-md shadow-lg border border-white/10 dark:border-white/5 px-4 sm:px-6 lg:px-8 py-2': isDarkNav,
        'px-4 sm:px-6 lg:px-8': !isDarkNav
      }"
    >
      <div class="flex items-center justify-between h-14 lg:h-16 overflow-visible">
        <!-- Logo: blanco cuando navbar transparente, oscuro cuando scrolled o en /inversiones -->
        <router-link to="/" class="flex items-center shrink-0 overflow-visible" title="Ir a inicio">
          <img 
            :src="isDarkNav ? '/images/images/loft2live-logo-color.png' : '/images/images/loft2live-logo-blanco.png'" 
            alt="Loft2Live - Inversión y alquiler flexible en apartamentos" 
            class="h-24 w-auto object-contain object-left lg:h-28"
          />
        </router-link>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-6" :class="isDarkNav ? 'text-gray-900' : 'text-white'">
          <!-- Búsqueda con dropdown -->
          <div class="relative" ref="busquedaDropdownRef">
            <button
              @click.prevent="toggleBusquedaDropdown"
              class="inline-flex items-center gap-2 transition-colors font-semibold hover:opacity-80"
              :class="isDarkNav ? 'text-gray-900' : 'text-white'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Búsqueda</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-if="busquedaDropdownOpen"
              class="absolute top-full left-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-xl py-2 z-50"
            >
          <router-link
            to="/inversiones"
            class="block px-4 py-2 text-sm transition-colors dropdown-nav-link"
            @click="closeBusquedaDropdown"
          >
            Compra
          </router-link>
          <router-link
            to="/alquileres"
            class="block px-4 py-2 text-sm transition-colors dropdown-nav-link"
            @click="closeBusquedaDropdown"
          >
            Alquileres
          </router-link>
          <router-link
            to="/alquileres/temporada"
            class="block px-4 py-2 text-sm transition-colors dropdown-nav-link pl-6 text-gray-600"
            @click="closeBusquedaDropdown"
          >
            Temporada entera
          </router-link>
          <router-link
            to="/alquileres/corta-estancia"
            class="block px-4 py-2 text-sm transition-colors dropdown-nav-link pl-6 text-gray-600"
            @click="closeBusquedaDropdown"
          >
            Corta estancia
          </router-link>
            </div>
          </div>
          <router-link to="/inversiones#preguntas" class="inline-flex items-center gap-2 transition-colors font-semibold hover:opacity-80" :class="isDarkNav ? 'text-gray-900 hover:text-brand-600' : 'text-white'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9a4 4 0 1 1 7.5 2c-.9.8-1.5 1.3-1.5 2.5V14" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 17h.01" />
            </svg>
            <span>Preguntas frecuentes</span>
          </router-link>
          <router-link to="/quienes-somos" class="inline-flex items-center gap-2 transition-colors font-semibold hover:opacity-80" :class="isDarkNav ? 'text-gray-900 hover:text-brand-600' : 'text-white'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20a8 8 0 0 1 16 0" />
            </svg>
            <span>Quiénes somos</span>
          </router-link>
          <router-link to="/blog" class="inline-flex items-center gap-2 transition-colors font-semibold hover:opacity-80" :class="isDarkNav ? 'text-gray-900 hover:text-brand-600' : 'text-white'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V4z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16" />
            </svg>
            <span>Blog</span>
          </router-link>
        </nav>

        <!-- Acceso + Usuario (Desktop) -->
        <div class="hidden md:flex items-center space-x-4" :class="isDarkNav ? 'text-gray-900' : 'text-white'">
          <div class="flex items-center space-x-2 font-semibold">
            <span>ES</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <!-- Sign in (cuando NO está autenticado) -->
          <router-link
            v-if="!isAuthenticated"
            to="/signin"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-500 hover:opacity-90 transition-opacity"
          >
            <!-- Icono Google -->
            <svg class="w-4 h-4" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.208 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917Z" />
              <path fill="#FF3D00" d="M6.306 14.691 12.88 19.51C14.66 15.108 18.977 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691Z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.191-5.238C29.147 35.135 26.701 36 24 36c-5.188 0-9.617-3.318-11.282-7.946l-6.52 5.02C9.514 39.556 16.227 44 24 44Z" />
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a11.96 11.96 0 0 1-4.085 5.565l.003-.002 6.191 5.238C36.973 39.205 44 34 44 24c0-1.341-.138-2.651-.389-3.917Z" />
            </svg>
            Iniciar sesión
          </router-link>

          <!-- Usuario -->
          <div v-if="isAuthenticated" class="relative ml-3" ref="dropdownRef">
            <button
              class="flex items-center gap-2 font-semibold hover:opacity-80"
              :class="isDarkNav ? 'text-gray-900' : 'text-white'"
              @click.prevent="toggleDropdown"
            >
              <span class="overflow-hidden rounded-full h-9 w-9 border border-gray-200 bg-white">
                <img
                  v-if="userPhoto"
                  :src="userPhoto"
                  alt="Usuario"
                  class="h-9 w-9 object-cover"
                />
                <div v-else class="h-9 w-9 flex items-center justify-center text-xs font-bold text-brand-500">
                  {{ userInitials }}
                </div>
              </span>
              <span class="text-sm font-medium max-w-[160px] truncate">{{ userName }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-3 w-[260px] rounded-2xl border border-gray-200 bg-white p-3 shadow-xl"
            >
              <div>
                <div class="font-semibold text-gray-900 text-sm truncate">{{ userName }}</div>
                <div class="text-xs text-gray-500 mt-0.5 truncate">{{ userEmail }}</div>
              </div>
              <div class="mt-3 border-t border-gray-200 pt-3 flex flex-col gap-2">
                <router-link
                  :to="isAdmin ? '/dashboard' : (perfilRol === 'comprador' ? '/comprador' : (isInquilino || perfilRol === 'inquilino' ? '/inquilino' : '/visitante'))"
                  class="px-3 py-2 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100"
                  @click="closeDropdown"
                >
                  {{ isAdmin ? 'Panel admin' : 'Mi espacio' }}
                </router-link>
                <button
                  type="button"
                  class="px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/30 text-left"
                  @click="handleSignOut"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Acceso + Menu button -->
        <div class="flex md:hidden items-center">
          <button class="p-2 font-semibold hover:opacity-80" :class="isDarkNav ? 'text-gray-900' : 'text-white'" @click="mobileMenuOpen = !mobileMenuOpen">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-3 border-t" :class="isDarkNav ? 'border-gray-300' : 'border-white/20'">
        <nav class="flex flex-col space-y-3" :class="isDarkNav ? 'text-gray-900' : 'text-white'">
          <!-- Búsqueda móvil -->
          <div>
            <button
              @click="mobileBusquedaOpen = !mobileBusquedaOpen"
              class="w-full inline-flex items-center justify-between gap-2 transition-colors font-semibold hover:opacity-80"
            >
              <div class="inline-flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Búsqueda</span>
              </div>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mobileBusquedaOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" />
              </svg>
            </button>
            <div v-if="mobileBusquedaOpen" class="ml-7 mt-2 space-y-2" :class="isDarkNav ? 'text-gray-600' : 'text-white/90'">
              <router-link
                to="/inversiones"
                class="block py-2 text-sm text-gray-600 hover:opacity-70"
                @click="mobileMenuOpen = false; mobileBusquedaOpen = false"
              >
                Compra
              </router-link>
              <router-link
                to="/alquileres"
                class="block py-2 text-sm text-gray-600 hover:opacity-70"
                @click="mobileMenuOpen = false; mobileBusquedaOpen = false"
              >
                Alquileres
              </router-link>
              <router-link
                to="/alquileres/temporada"
                class="block py-2 pl-4 text-sm text-gray-500 hover:opacity-70"
                @click="mobileMenuOpen = false; mobileBusquedaOpen = false"
              >
                Temporada entera
              </router-link>
              <router-link
                to="/alquileres/corta-estancia"
                class="block py-2 pl-4 text-sm text-gray-500 hover:opacity-70"
                @click="mobileMenuOpen = false; mobileBusquedaOpen = false"
              >
                Corta estancia
              </router-link>
            </div>
          </div>
          <router-link
            to="/inversiones#preguntas"
            class="inline-flex items-center gap-2 transition-colors font-semibold hover:opacity-80"
            @click="mobileMenuOpen = false"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9a4 4 0 1 1 7.5 2c-.9.8-1.5 1.3-1.5 2.5V14" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 17h.01" />
            </svg>
            Preguntas frecuentes
          </router-link>
          <router-link
            to="/quienes-somos"
            class="inline-flex items-center gap-2 transition-colors font-semibold hover:opacity-80"
            @click="mobileMenuOpen = false"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 20a8 8 0 0 1 16 0" />
            </svg>
            Quiénes somos
          </router-link>
          <router-link
            to="/blog"
            class="inline-flex items-center gap-2 transition-colors font-semibold hover:opacity-80"
            @click="mobileMenuOpen = false"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V4z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16" />
            </svg>
            Blog
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            to="/signin"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-500"
            @click="mobileMenuOpen = false"
          >
            <svg class="w-4 h-4" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.208 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917Z" />
              <path fill="#FF3D00" d="M6.306 14.691 12.88 19.51C14.66 15.108 18.977 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691Z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.191-5.238C29.147 35.135 26.701 36 24 36c-5.188 0-9.617-3.318-11.282-7.946l-6.52 5.02C9.514 39.556 16.227 44 24 44Z" />
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a11.96 11.96 0 0 1-4.085 5.565l.003-.002 6.191 5.238C36.973 39.205 44 34 44 24c0-1.341-.138-2.651-.389-3.917Z" />
            </svg>
            Iniciar sesión
          </router-link>
          <template v-if="isAuthenticated">
            <router-link
              :to="isAdmin ? '/dashboard' : (perfilRol === 'comprador' ? '/comprador' : (isInquilino || perfilRol === 'inquilino' ? '/inquilino' : '/visitante'))"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-500"
              @click="mobileMenuOpen = false"
            >
              {{ isAdmin ? 'Panel admin' : 'Mi espacio' }}
            </router-link>
            <button
              type="button"
              class="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/30 transition-colors"
              @click="handleSignOut"
            >
              Cerrar sesión
            </button>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const mobileBusquedaOpen = ref(false)
const dropdownOpen = ref(false)
const busquedaDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const busquedaDropdownRef = ref<HTMLElement | null>(null)

const router = useRouter()
const { user, isAuthenticated, isAdmin, isInquilino, perfilRol, signOut } = useAuth()

const userName = computed(() => {
  const u = user.value
  if (!u) return 'Usuario'
  const name = u.profile?.name || (u as { displayName?: string }).displayName || u.email
  return name || 'Usuario'
})

const userEmail = computed(() => user.value?.email || '')

const userPhoto = computed(() => user.value?.profile?.avatar_url || (user.value as { photoURL?: string })?.photoURL || '')

const userInitials = computed(() => {
  const base = userName.value || 'U'
  const parts = base.split(' ').filter(Boolean)
  const initials = (parts[0]?.[0] || 'U') + (parts[1]?.[0] || '')
  return initials.toUpperCase()
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const toggleBusquedaDropdown = () => {
  busquedaDropdownOpen.value = !busquedaDropdownOpen.value
}

const closeBusquedaDropdown = () => {
  busquedaDropdownOpen.value = false
}

const handleSignOut = async () => {
  try {
    await signOut()
    closeDropdown()
    mobileMenuOpen.value = false
    router.push('/signin')
  } catch (e) {
    console.error('Error al cerrar sesión:', e)
  }
}

const onClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
  if (busquedaDropdownRef.value && !busquedaDropdownRef.value.contains(event.target as Node)) {
    closeBusquedaDropdown()
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

/** En vista detalle /inversiones (y lista) el fondo es claro: navbar con fuentes en negro desde el inicio */
const isDarkNav = computed(() => isScrolled.value || route.path.startsWith('/inversiones'))

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.dropdown-nav-link {
  color: var(--color-gray-900);
}
.dropdown-nav-link:hover {
  color: var(--color-brand-500);
  background-color: color-mix(in srgb, var(--color-brand-500) 10%, transparent);
}
</style>
