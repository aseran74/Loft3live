<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/inquilino" class="block">
        <template v-if="isExpanded || isHovered || isMobileOpen">
          <img
            src="/images/images/loft2live-logo-blanco.png"
            alt="Loft2Live"
            width="150"
            height="40"
            class="h-10 w-auto max-w-[150px] object-contain opacity-95 hidden dark:block"
          />
          <img
            src="/images/images/loft2live-logo-color.png"
            alt="Loft2Live"
            width="150"
            height="40"
            class="h-10 w-auto max-w-[150px] object-contain opacity-95 block dark:hidden"
          />
        </template>
        <template v-else>
          <img
            src="/images/images/loft2live-logo-blanco.png"
            alt="Loft2Live"
            width="32"
            height="32"
            class="h-8 w-8 object-contain opacity-95 hidden dark:block"
          />
          <img
            src="/images/images/loft2live-logo-color.png"
            alt="Loft2Live"
            width="32"
            height="32"
            class="h-8 w-8 object-contain opacity-95 block dark:hidden"
          />
        </template>
      </router-link>
    </div>
    <nav class="flex flex-col gap-1 overflow-y-auto no-scrollbar">
      <div
        :class="[
          'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
        ]"
      >
        <template v-if="isExpanded || isHovered || isMobileOpen">Menú</template>
        <HorizontalDots v-else />
      </div>
      <ul class="flex flex-col gap-1">
        <li>
          <router-link
            to="/inquilino"
            :class="[
              'menu-item group',
              {
                'menu-item-active': route.path === '/inquilino',
                'menu-item-inactive': route.path !== '/inquilino',
              },
            ]"
          >
            <span :class="[route.path === '/inquilino' ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
              <GridIcon />
            </span>
            <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
              Dashboard
            </span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/inquilino/reservar-instalaciones"
            :class="[
              'menu-item group',
              {
                'menu-item-active': isActive('/inquilino/reservar-instalaciones'),
                'menu-item-inactive': !isActive('/inquilino/reservar-instalaciones'),
              },
            ]"
          >
            <span :class="[isActive('/inquilino/reservar-instalaciones') ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
              <TaskIcon />
            </span>
            <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
              Reservar instalaciones
            </span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/inquilino/incidencias"
            :class="[
              'menu-item group',
              {
                'menu-item-active': isActive('/inquilino/incidencias'),
                'menu-item-inactive': !isActive('/inquilino/incidencias'),
              },
            ]"
          >
            <span :class="[isActive('/inquilino/incidencias') ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
              <FlagIcon />
            </span>
            <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
              Incidencias
            </span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/inquilino/mensajes"
            :class="[
              'menu-item group',
              {
                'menu-item-active': isActive('/inquilino/mensajes'),
                'menu-item-inactive': !isActive('/inquilino/mensajes'),
              },
            ]"
          >
            <span :class="[isActive('/inquilino/mensajes') ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
              <ChatIcon />
            </span>
            <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
              Mensajes
            </span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/inquilino/flextime"
            :class="[
              'menu-item group',
              {
                'menu-item-active': isActive('/inquilino/flextime'),
                'menu-item-inactive': !isActive('/inquilino/flextime'),
              },
            ]"
          >
            <span :class="[isActive('/inquilino/flextime') ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
              <CalenderIcon />
            </span>
            <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
              Flextime
            </span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/inquilino/utilizar-puntos"
            :class="[
              'menu-item group',
              {
                'menu-item-active': isActive('/inquilino/utilizar-puntos'),
                'menu-item-inactive': !isActive('/inquilino/utilizar-puntos'),
              },
            ]"
          >
            <span :class="[isActive('/inquilino/utilizar-puntos') ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
              <StaredIcon />
            </span>
            <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
              Utilizar puntos
            </span>
          </router-link>
        </li>
        <li class="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <router-link
            to="/profile"
            :class="[
              'menu-item group',
              {
                'menu-item-active': route.path === '/profile',
                'menu-item-inactive': route.path !== '/profile',
              },
            ]"
          >
            <span :class="[route.path === '/profile' ? 'menu-item-icon-active' : 'menu-item-icon-inactive']">
              <UserCircleIcon />
            </span>
            <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
              Mi perfil
            </span>
          </router-link>
        </li>
        <li class="pt-2 border-t border-gray-200 dark:border-gray-700">
          <a
            href="#"
            class="menu-item group menu-item-inactive"
            @click.prevent="handleSignOut"
          >
            <span class="menu-item-icon-inactive">
              <LogoutIcon />
            </span>
            <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
              Cerrar sesión
            </span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { GridIcon, TaskIcon, FlagIcon, ChatIcon, LogoutIcon, HorizontalDots, UserCircleIcon, CalenderIcon, StaredIcon } from '@/icons'
import { useSidebar } from '@/composables/useSidebar'
import { useAuth } from '@/composables/useAuth'
import { watch } from 'vue'

const route = useRoute()
const { isExpanded, isMobileOpen, isHovered, toggleMobileSidebar } = useSidebar()
const { signOut } = useAuth()

const isActive = (path: string) => route.path === path || route.path.startsWith(path + '/')

watch(() => route.path, () => {
  if (isMobileOpen.value) {
    toggleMobileSidebar()
  }
})

async function handleSignOut() {
  await signOut()
  window.location.href = '/signin'
}
</script>
