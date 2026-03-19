import { createClient } from '@insforge/sdk'

const baseUrl = import.meta.env.VITE_INSFORGE_BASE_URL || import.meta.env.VITE_INSFORGE_URL
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY

if (!baseUrl || !anonKey) {
  console.warn(
    '[InsForge] VITE_INSFORGE_BASE_URL y VITE_INSFORGE_ANON_KEY deben estar configurados en .env. ' +
    'Obtén estos valores desde tu proyecto en insforge.dev'
  )
}

export const insforge = createClient({
  baseUrl: baseUrl || 'https://placeholder.insforge.app',
  anonKey: anonKey || '',
  // Renovar el access token con el refresh token cuando caduque (Insforge no expone duración del JWT en el dashboard)
  autoRefreshToken: true,
  persistSession: true,
})
