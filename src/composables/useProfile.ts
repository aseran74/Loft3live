import { ref, computed, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { insforge } from '@/lib/insforge'

export interface ProfileData {
  nombre: string | null
  telefono: string | null
  bio: string | null
  rol: string | null
}

export function useProfile() {
  const { user } = useAuth()
  const profile = ref<ProfileData>({
    nombre: null,
    telefono: null,
    bio: null,
    rol: null,
  })
  const loading = ref(true)
  const saving = ref(false)

  const email = computed(() => user.value?.email ?? null)

  async function fetchProfile() {
    const emailVal = email.value
    if (!emailVal) {
      profile.value = { nombre: null, telefono: null, bio: null, rol: null }
      loading.value = false
      return
    }
    loading.value = true
    const { data, error } = await insforge.database
      .from('perfiles')
      .select('nombre, telefono, bio, rol')
      .ilike('email', emailVal)
      .maybeSingle()
    loading.value = false
    if (error || !data) {
      profile.value = { nombre: null, telefono: null, bio: null, rol: null }
      return
    }
    const row = data as { nombre?: string | null; telefono?: string | null; bio?: string | null; rol?: string | null }
    profile.value = {
      nombre: row.nombre ?? null,
      telefono: row.telefono ?? null,
      bio: row.bio ?? null,
      rol: row.rol ?? null,
    }
  }

  watch(email, fetchProfile, { immediate: true })

  async function updateProfile(payload: { nombre?: string; telefono?: string; bio?: string }) {
    const emailVal = email.value
    if (!emailVal) return { error: new Error('No hay usuario') }
    saving.value = true
    const { error } = await insforge.database
      .from('perfiles')
      .upsert(
        {
          email: emailVal,
          rol: profile.value.rol ?? 'visitante',
          nombre: payload.nombre ?? profile.value.nombre ?? null,
          telefono: payload.telefono ?? profile.value.telefono ?? null,
          bio: payload.bio ?? profile.value.bio ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
    saving.value = false
    if (error) return { error }
    await fetchProfile()
    return {}
  }

  return {
    profile,
    email,
    loading,
    saving,
    fetchProfile,
    updateProfile,
  }
}
