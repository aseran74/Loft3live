import { insforge } from '@/lib/insforge'

export interface HeroStat {
  icon: string
  value: number
  suffix: string
  label: string
  barWidth: string
}

export interface PhaseMetric {
  label: string
  value: string
}

export interface Phase {
  title: string
  color: string
  units: number
  metrics: PhaseMetric[]
  grossValue: string
}

export interface TotalItem {
  value: string
  label: string
}

export interface LandingTrustStats {
  heroStats: HeroStat[]
  phases: Phase[]
  totalItems: TotalItem[]
  roiPercent: string
}

const defaults: LandingTrustStats = {
  heroStats: [
    { icon: '👥', value: 0, suffix: '+', label: 'Inversores activos', barWidth: '82%' },
    { icon: '💶', value: 0, suffix: 'M€', label: 'Capital elevado', barWidth: '60%' },
    { icon: '🏗️', value: 0, suffix: '', label: 'Proyectos financiados', barWidth: '20%' },
    { icon: '📈', value: 0, suffix: 'M€', label: 'Valor bruto total', barWidth: '60%' },
  ],
  phases: [],
  totalItems: [
    { value: '0', label: 'Unidades' },
    { value: '0 m²', label: 'Superficie' },
    { value: '0 M €', label: 'Coste inversión' },
    { value: '0 M €', label: 'Valor bruto' },
  ],
  roiPercent: '0',
}

/**
 * Obtiene la configuración de la sección "Confianza" desde Insforge (tabla landing_trust_config).
 * Opcionalmente actualiza heroStats con datos en vivo: número de compradores, proyectos y suma de inversión.
 */
export async function fetchLandingTrustStats(mergeLiveData = true): Promise<LandingTrustStats> {
  const { data: rows, error } = await insforge.database
    .from('landing_trust_config')
    .select('clave, valor')

  if (error) {
    console.warn('[landingTrustStats] Error cargando config:', error.message)
    return defaults
  }

  const map = new Map<string, unknown>()
  for (const r of rows ?? []) {
    map.set(r.clave, r.valor)
  }

  const heroStats = (map.get('hero_stats') as HeroStat[] | undefined) ?? defaults.heroStats
  const phases = (map.get('phases') as Phase[] | undefined) ?? defaults.phases
  const totalItems = (map.get('total_items') as TotalItem[] | undefined) ?? defaults.totalItems
  const roiPercent =
    typeof map.get('roi_percent') === 'number'
      ? String(map.get('roi_percent'))
      : (map.get('roi_percent') as string | undefined) ?? defaults.roiPercent

  let result: LandingTrustStats = {
    heroStats: [...heroStats],
    phases: [...phases],
    totalItems: [...totalItems],
    roiPercent: String(roiPercent),
  }

  if (mergeLiveData) {
    try {
      const [compradoresRes, proyectosRes] = await Promise.all([
        insforge.database.from('compradores').select('id', { count: 'exact', head: true }),
        insforge.database
          .from('proyectos')
          .select('id, num_lofts, objetivo_inversion_total')
      ])

      const numCompradores = compradoresRes.count ?? 0
      const proyectos = (proyectosRes.data ?? []) as { id: string; num_lofts: number; objetivo_inversion_total: number }[]
      const numProyectos = proyectos.length
      const totalUnidades = proyectos.reduce((s, p) => s + (Number(p.num_lofts) || 0), 0)
      const valorBrutoMillones = proyectos.reduce(
        (s, p) => s + (Number(p.objetivo_inversion_total) || 0) / 1_000_000,
        0
      )

      result.heroStats = result.heroStats.map((h) => {
        if (h.label === 'Inversores activos') return { ...h, value: numCompradores }
        if (h.label === 'Proyectos financiados') return { ...h, value: numProyectos }
        if (h.label === 'Valor bruto total') return { ...h, value: Math.round(valorBrutoMillones * 10) / 10 }
        if (h.label === 'Capital elevado') return { ...h, value: Math.round(valorBrutoMillones * 10) / 10 }
        return h
      })
    } catch (e) {
      console.warn('[landingTrustStats] Error merging live data:', e)
    }
  }

  return result
}
