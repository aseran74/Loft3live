import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { insforge } from '@/lib/insforge'

type AuthUser = { id: string; email: string; profile?: { name?: string; avatar_url?: string } | null }

export interface InquilinoSession {
  id: string
  nombre: string
  proyecto_id: string
  loft_num: number
  correo: string | null
  telefono: string | null
  proyecto_nombre?: string
  fecha_inicio_alquiler?: string | null
  fecha_fin_alquiler?: string | null
  es_toda_temporada?: boolean
}

export interface CompradorSession {
  id: string
  nombre: string
  proyecto_id: string
  tickets: number
  correo: string | null
  telefono: string | null
  proyecto_nombre?: string
}

const user = ref<AuthUser | null>(null)
const loading = ref(true)
const inquilino = ref<InquilinoSession | null>(null)
const comprador = ref<CompradorSession | null>(null)
const perfilRol = ref<'visitante' | 'inquilino' | 'comprador' | 'admin' | null>(null)

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!user.value)

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@admin.com'
  const isAdmin = computed(
    () =>
      !!user.value &&
      (perfilRol.value === 'admin' ||
        (user.value!.email && user.value!.email.toLowerCase() === adminEmail.toLowerCase()))
  )

  const isInquilino = computed(() => !!inquilino.value)
  const isComprador = computed(() => !!comprador.value)

  async function ensurePerfilVisitante(email: string) {
    const e = email.trim().toLowerCase()
    if (!e) return
    await insforge.database
      .from('perfiles')
      .upsert({ email: e, rol: 'visitante', updated_at: new Date().toISOString() }, { onConflict: 'email' })
    perfilRol.value = 'visitante'
  }

  async function fetchInquilinoByEmail(email: string) {
    const { data, error } = await insforge.database
      .from('inquilinos')
      .select('id, nombre, proyecto_id, loft_num, correo, telefono, fecha_inicio_alquiler, fecha_fin_alquiler, es_toda_temporada')
      .ilike('correo', email)
      .maybeSingle()
    if (error || !data) {
      inquilino.value = null
      return
    }
    const row = data as InquilinoSession
    const { data: proj } = await insforge.database
      .from('proyectos')
      .select('nombre_proyecto')
      .eq('id', row.proyecto_id)
      .single()
    inquilino.value = {
      ...row,
      proyecto_nombre: (proj as { nombre_proyecto?: string } | null)?.nombre_proyecto,
    }
  }

  async function fetchCompradorByEmail(email: string) {
    const { data, error } = await insforge.database
      .from('compradores')
      .select('id, nombre, proyecto_id, tickets, correo, telefono')
      .ilike('correo', email)
      .maybeSingle()
    if (error || !data) {
      comprador.value = null
      return
    }
    const row = data as CompradorSession
    const { data: proj } = await insforge.database
      .from('proyectos')
      .select('nombre_proyecto')
      .eq('id', row.proyecto_id)
      .single()
    comprador.value = {
      ...row,
      proyecto_nombre: (proj as { nombre_proyecto?: string } | null)?.nombre_proyecto,
    }
  }

  async function initSession() {
    loading.value = true
    inquilino.value = null
    comprador.value = null
    perfilRol.value = null
    const { data } = await insforge.auth.getCurrentSession()
    user.value = (data?.session?.user ?? null) as AuthUser | null
    if (!user.value?.email) {
      loading.value = false
      return data?.session
    }
    const email = user.value.email
    const { data: perfil } = await insforge.database
      .from('perfiles')
      .select('rol')
      .ilike('email', email)
      .maybeSingle()
    if (perfil && typeof (perfil as { rol?: string }).rol === 'string') {
      perfilRol.value = (perfil as { rol: 'visitante' | 'inquilino' | 'comprador' | 'admin' }).rol
    } else if (email !== adminEmail) {
      await ensurePerfilVisitante(email)
    }
    const shouldFetchInquilino =
      perfilRol.value !== 'admin' &&
      perfilRol.value !== 'visitante' &&
      (perfilRol.value === 'inquilino' || perfilRol.value === null)
    if (shouldFetchInquilino && email !== adminEmail) {
      await fetchInquilinoByEmail(email)
    }
    if (perfilRol.value === 'comprador' && email !== adminEmail) {
      await fetchCompradorByEmail(email)
    }
    loading.value = false
    return data?.session
  }

  function waitUntilReady(): Promise<void> {
    if (!loading.value) return Promise.resolve()
    return new Promise((resolve) => {
      const check = () => {
        if (!loading.value) {
          resolve()
          return
        }
        setTimeout(check, 50)
      }
      check()
    })
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await insforge.auth.signInWithPassword({ email, password })
    if (error) {
      return { error }
    }
    if (data?.user) {
      user.value = data.user as AuthUser
      return { data }
    }
    return { error: new Error('Error desconocido al iniciar sesión') }
  }

  async function signUp(params: { email: string; password: string; name?: string }) {
    const { data, error } = await insforge.auth.signUp({
      email: params.email,
      password: params.password,
      name: params.name,
    })
    if (error) {
      return { error }
    }
    if (data?.requireEmailVerification) {
      return { data, requireEmailVerification: true }
    }
    if (data?.user) {
      user.value = data.user as AuthUser
      await ensurePerfilVisitante((data.user as AuthUser).email)
      return { data }
    }
    return { data }
  }

  async function signInWithOAuth(provider: 'google' | 'facebook' | 'github' | 'microsoft' | 'discord' | 'apple' | 'x', redirectTo?: string) {
    await insforge.auth.signInWithOAuth({
      provider,
      redirectTo: redirectTo || window.location.origin + '/',
    })
  }

  async function signOut() {
    await insforge.auth.signOut()
    user.value = null
    inquilino.value = null
    comprador.value = null
    perfilRol.value = null
    router.push('/signin')
  }

  /** Detecta si el error de la API es por sesión caducada (JWT expired / 401) */
  function isSessionExpiredError(err: unknown): boolean {
    if (!err) return false
    const msg = typeof (err as { message?: string }).message === 'string' ? (err as { message: string }).message : ''
    const code = typeof (err as { statusCode?: number }).statusCode === 'number' ? (err as { statusCode: number }).statusCode : 0
    return (
      code === 401 ||
      /JWT\s*expired|token\s*expired|sesi[oó]n\s*caducada|expired/i.test(msg)
    )
  }

  /** Cierra sesión y redirige al login indicando que la sesión caducó */
  async function handleSessionExpired() {
    user.value = null
    inquilino.value = null
    comprador.value = null
    perfilRol.value = null
    try {
      await insforge.auth.signOut()
    } catch (_) {
      /* ignorar */
    }
    router.push('/signin?expired=1')
  }

  return {
    user,
    inquilino,
    comprador,
    perfilRol,
    loading,
    isAuthenticated,
    isAdmin,
    isInquilino,
    isComprador,
    initSession,
    waitUntilReady,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    isSessionExpiredError,
    handleSessionExpired,
  }
}
