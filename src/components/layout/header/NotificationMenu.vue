<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="relative flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      @click="toggleDropdown"
      aria-label="Notificaciones"
    >
      <span
        v-if="totalUnread > 0"
        class="absolute right-0.5 top-0.5 z-1 flex h-2 w-2 min-w-2 rounded-full bg-brand-500"
      >
        <span class="absolute inline-flex h-full w-full min-w-full rounded-full bg-brand-500 opacity-75 animate-ping" />
      </span>
      <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
          fill="currentColor"
        />
      </svg>
    </button>

    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-2 flex max-h-[420px] w-[360px] flex-col rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:w-[380px]"
    >
      <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
        <h5 class="text-base font-semibold text-gray-800 dark:text-white">Notificaciones</h5>
        <button type="button" class="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Cerrar" @click="closeDropdown">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div v-if="!showRealNotifications" class="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Inicia sesión como comprador o inquilino para ver tus notificaciones.
      </div>

      <template v-else>
        <div v-if="loading" class="flex items-center justify-center py-12">
          <span class="text-sm text-gray-500 dark:text-gray-400">Cargando…</span>
        </div>
        <ul v-else class="flex max-h-[320px] flex-col overflow-y-auto">
          <li v-for="n in notifications" :key="n.id" class="border-b border-gray-100 last:border-b-0 dark:border-gray-700">
            <router-link
              :to="n.link"
              class="flex gap-3 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-700/50"
              @click="closeDropdown"
            >
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm"
                :class="n.iconBg"
              >
                {{ n.icon }}
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-medium text-gray-900 dark:text-white">{{ n.title }}</span>
                <span class="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">{{ n.body }}</span>
                <span class="mt-1 block text-xs text-gray-400 dark:text-gray-500">{{ n.time }}</span>
              </span>
            </router-link>
          </li>
          <li v-if="notifications.length === 0" class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No tienes notificaciones recientes.
          </li>
        </ul>

        <div v-if="mensajesLink" class="border-t border-gray-100 p-2 dark:border-gray-700">
          <router-link
            :to="mensajesLink"
            class="flex justify-center rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            @click="closeDropdown"
          >
            Ver mensajes y tablón
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { insforge } from '@/lib/insforge'

type NotificationItem = {
  id: string
  type: 'mensaje' | 'tablon' | 'reserva_aprobada'
  title: string
  body: string
  time: string
  link: string
  icon: string
  iconBg: string
  created_at: string
}

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const notifications = ref<NotificationItem[]>([])

const { comprador, inquilino, perfilRol } = useAuth()

const showRealNotifications = computed(() => {
  return (perfilRol.value === 'comprador' && comprador.value?.id) || (perfilRol.value === 'inquilino' && inquilino.value?.id)
})

const mensajesLink = computed(() => {
  if (perfilRol.value === 'comprador') return '/comprador/mensajes'
  if (perfilRol.value === 'inquilino') return '/inquilino/mensajes'
  return null
})

const totalUnread = computed(() => notifications.value.length)

function formatTime(iso: string) {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours} h`
  if (diffDays < 7) return `Hace ${diffDays} días`
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

async function loadNotifications() {
  if (!showRealNotifications.value) return
  loading.value = true
  const list: NotificationItem[] = []
  const rol = perfilRol.value
  const compId = comprador.value?.id
  const inqId = inquilino.value?.id
  const proyectoId = comprador.value?.proyecto_id ?? inquilino.value?.proyecto_id ?? null

  try {
    if (rol === 'comprador' && compId) {
      const tipoDest = 'comprador'
      const { data: dest } = await insforge.database
        .from('mensajes_destinatarios')
        .select('mensaje_id')
        .eq('tipo', tipoDest)
        .eq('destinatario_id', compId)
      const msgIds = (dest ?? []).map((d: { mensaje_id: string }) => d.mensaje_id)
      if (msgIds.length > 0) {
        const { data: msgs } = await insforge.database
          .from('mensajes')
          .select('id, asunto, cuerpo, created_at')
          .in('id', msgIds)
          .order('created_at', { ascending: false })
          .limit(5)
        for (const m of msgs ?? []) {
          const x = m as { id: string; asunto: string; cuerpo: string; created_at: string }
          list.push({
            id: `msg-${x.id}`,
            type: 'mensaje',
            title: x.asunto || 'Nuevo mensaje',
            body: (x.cuerpo || '').slice(0, 60) + ((x.cuerpo?.length ?? 0) > 60 ? '…' : ''),
            time: formatTime(x.created_at),
            link: '/comprador/mensajes',
            icon: '✉️',
            iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
            created_at: x.created_at,
          })
        }
      }

      const { data: tablon } = await insforge.database
        .from('tablon_anuncios')
        .select('id, proyecto_id, tipo, titulo, contenido, created_at')
        .order('created_at', { ascending: false })
        .limit(proyectoId ? 20 : 5)
      for (const a of tablon ?? []) {
        const x = a as { id: string; proyecto_id: string | null; tipo: string; titulo: string; contenido: string; created_at: string }
        if (x.proyecto_id && x.proyecto_id !== proyectoId) continue
        list.push({
          id: `tab-${x.id}`,
          type: 'tablon',
          title: x.titulo || 'Tablón',
          body: (x.contenido || '').slice(0, 50) + ((x.contenido?.length ?? 0) > 50 ? '…' : ''),
          time: formatTime(x.created_at),
          link: '/comprador/mensajes',
          icon: '📋',
          iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
          created_at: x.created_at,
        })
      }

      const { data: reservas } = await insforge.database
        .from('comprador_reserva_puntos')
        .select('id, dias_usados, puntos, created_at')
        .eq('comprador_id', compId)
        .eq('estado', 'aprobado')
        .order('created_at', { ascending: false })
        .limit(3)
      for (const r of reservas ?? []) {
        const x = r as { id: string; dias_usados: number; puntos: number; created_at: string }
        list.push({
          id: `res-${x.id}`,
          type: 'reserva_aprobada',
          title: 'Reserva con puntos aprobada',
          body: `${x.dias_usados} día(s) · ${x.puntos} puntos`,
          time: formatTime(x.created_at),
          link: '/comprador/utilizar-puntos',
          icon: '✅',
          iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
          created_at: x.created_at,
        })
      }
    }

    if (rol === 'inquilino' && inqId) {
      const tipoDest = 'inquilino'
      const { data: dest } = await insforge.database
        .from('mensajes_destinatarios')
        .select('mensaje_id')
        .eq('tipo', tipoDest)
        .eq('destinatario_id', inqId)
      const msgIds = (dest ?? []).map((d: { mensaje_id: string }) => d.mensaje_id)
      if (msgIds.length > 0) {
        const { data: msgs } = await insforge.database
          .from('mensajes')
          .select('id, asunto, cuerpo, created_at')
          .in('id', msgIds)
          .order('created_at', { ascending: false })
          .limit(5)
        for (const m of msgs ?? []) {
          const x = m as { id: string; asunto: string; cuerpo: string; created_at: string }
          list.push({
            id: `msg-${x.id}`,
            type: 'mensaje',
            title: x.asunto || 'Nuevo mensaje',
            body: (x.cuerpo || '').slice(0, 60) + ((x.cuerpo?.length ?? 0) > 60 ? '…' : ''),
            time: formatTime(x.created_at),
            link: '/inquilino/mensajes',
            icon: '✉️',
            iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
            created_at: x.created_at,
          })
        }
      }

      const { data: tablon } = await insforge.database
        .from('tablon_anuncios')
        .select('id, proyecto_id, tipo, titulo, contenido, created_at')
        .order('created_at', { ascending: false })
        .limit(proyectoId ? 20 : 5)
      for (const a of tablon ?? []) {
        const x = a as { id: string; proyecto_id: string | null; tipo: string; titulo: string; contenido: string; created_at: string }
        if (x.proyecto_id && x.proyecto_id !== proyectoId) continue
        list.push({
          id: `tab-${x.id}`,
          type: 'tablon',
          title: x.titulo || 'Tablón',
          body: (x.contenido || '').slice(0, 50) + ((x.contenido?.length ?? 0) > 50 ? '…' : ''),
          time: formatTime(x.created_at),
          link: '/inquilino/mensajes',
          icon: '📋',
          iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
          created_at: x.created_at,
        })
      }

      const { data: canjes } = await insforge.database
        .from('flextime_canjes')
        .select('id, inquilino_propietario_id, inquilino_visitante_id, dias_usados, puntos, created_at')
        .or(`inquilino_propietario_id.eq.${inqId},inquilino_visitante_id.eq.${inqId}`)
        .eq('estado', 'aprobado')
        .order('created_at', { ascending: false })
        .limit(5)
      for (const c of canjes ?? []) {
        const x = c as { id: string; inquilino_propietario_id: string; inquilino_visitante_id: string; dias_usados: number; puntos: number; created_at: string }
        const soyPropietario = x.inquilino_propietario_id === inqId
        list.push({
          id: `canje-${x.id}`,
          type: 'reserva_aprobada',
          title: soyPropietario ? 'Han aprobado usar tu loft' : 'Tu solicitud de uso de loft aprobada',
          body: `${x.dias_usados} día(s) · ${x.puntos} puntos`,
          time: formatTime(x.created_at),
          link: '/inquilino/flextime',
          icon: '✅',
          iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
          created_at: x.created_at,
        })
      }
    }

    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    notifications.value = list.slice(0, 15)
  } catch (e) {
    console.warn('[NotificationMenu] Error loading:', e)
    notifications.value = []
  } finally {
    loading.value = false
  }
}

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value && showRealNotifications.value) loadNotifications()
}

function closeDropdown() {
  dropdownOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) closeDropdown()
}

watch([comprador, inquilino, perfilRol], () => {
  if (dropdownOpen.value && showRealNotifications.value) loadNotifications()
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
