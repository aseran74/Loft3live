<template>
  <InquilinoLayout v-if="esInquilino">
    <div class="mb-6">
      <router-link
        to="/inquilino"
        class="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver al dashboard
      </router-link>
      <h1 class="mt-3 text-2xl font-bold text-gray-800 dark:text-white">Mi perfil</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Edita tu nombre, teléfono y bio.</p>
    </div>
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <div v-if="profileLoading" class="py-8 text-center text-gray-500 dark:text-gray-400">
        Cargando perfil…
      </div>
      <template v-else>
        <profile-card
          :email="email"
          :nombre="profile.nombre"
          :rol="profile.rol"
          :avatar-url="user?.profile?.avatar_url"
        />
        <personal-info-card
          :email="email"
          :nombre="profile.nombre"
          :telefono="profile.telefono"
          :bio="profile.bio"
          :saving="saving"
          @save="onSavePersonalInfo"
        />
      </template>
    </div>
  </InquilinoLayout>
  <CompradorLayout v-else-if="esComprador">
    <div class="mb-6">
      <router-link
        to="/comprador"
        class="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver al dashboard
      </router-link>
      <h1 class="mt-3 text-2xl font-bold text-gray-800 dark:text-white">Mi perfil</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Edita tu nombre, teléfono y bio.</p>
    </div>
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <div v-if="profileLoading" class="py-8 text-center text-gray-500 dark:text-gray-400">
        Cargando perfil…
      </div>
      <template v-else>
        <profile-card
          :email="email"
          :nombre="profile.nombre"
          :rol="profile.rol"
          :avatar-url="user?.profile?.avatar_url"
        />
        <personal-info-card
          :email="email"
          :nombre="profile.nombre"
          :telefono="profile.telefono"
          :bio="profile.bio"
          :saving="saving"
          @save="onSavePersonalInfo"
        />
      </template>
    </div>
  </CompradorLayout>
  <VisitanteLayout v-else-if="esVisitante">
    <div class="mb-6">
      <router-link
        to="/visitante"
        class="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </router-link>
      <h1 class="mt-3 text-2xl font-bold text-gray-800 dark:text-white">Mi perfil</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Edita tu nombre, teléfono y bio.</p>
    </div>
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <div v-if="profileLoading" class="py-8 text-center text-gray-500 dark:text-gray-400">
        Cargando perfil…
      </div>
      <template v-else>
        <profile-card
          :email="email"
          :nombre="profile.nombre"
          :rol="profile.rol"
          :avatar-url="user?.profile?.avatar_url"
        />
        <personal-info-card
          :email="email"
          :nombre="profile.nombre"
          :telefono="profile.telefono"
          :bio="profile.bio"
          :saving="saving"
          @save="onSavePersonalInfo"
        />
      </template>
    </div>
  </VisitanteLayout>
  <admin-layout v-else>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="mb-4">
      <router-link
        to="/dashboard"
        class="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver al panel
      </router-link>
    </div>
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6"
    >
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Perfil</h3>
      <div v-if="profileLoading" class="py-8 text-center text-gray-500 dark:text-gray-400">
        Cargando perfil…
      </div>
      <template v-else>
        <profile-card
          :email="email"
          :nombre="profile.nombre"
          :rol="profile.rol"
          :avatar-url="user?.profile?.avatar_url"
        />
        <personal-info-card
          :email="email"
          :nombre="profile.nombre"
          :telefono="profile.telefono"
          :bio="profile.bio"
          :saving="saving"
          @save="onSavePersonalInfo"
        />
        <address-card />
      </template>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import InquilinoLayout from '@/components/layout/InquilinoLayout.vue'
import CompradorLayout from '@/components/layout/CompradorLayout.vue'
import VisitanteLayout from '@/components/layout/VisitanteLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import ProfileCard from '@/components/profile/ProfileCard.vue'
import PersonalInfoCard from '@/components/profile/PersonalInfoCard.vue'
import AddressCard from '@/components/profile/AddressCard.vue'
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useProfile } from '@/composables/useProfile'

const currentPageTitle = ref('Perfil de usuario')

const { user, isInquilino, isComprador, perfilRol } = useAuth()
const esInquilino = computed(() => isInquilino.value || perfilRol.value === 'inquilino')
const esComprador = computed(() => isComprador.value || perfilRol.value === 'comprador')
const esVisitante = computed(() => perfilRol.value === 'visitante')
const { profile, email, loading: profileLoading, saving, updateProfile } = useProfile()

async function onSavePersonalInfo(payload: { nombre?: string; telefono?: string; bio?: string }) {
  await updateProfile(payload)
}
</script>
