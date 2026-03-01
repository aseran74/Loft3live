export type AmenityKey =
  | 'gimnasio'
  | 'cocina_barbacoa_comunidad'
  | 'piscina'
  | 'piscina_cubierta'
  | 'jacuzzi'

export interface AmenityItem {
  key: AmenityKey
  label: string
}

export const amenityGroups: { title: string; subtitle?: string; items: AmenityItem[] }[] = [
  {
    title: 'Instalaciones comunidad',
    items: [
      { key: 'gimnasio', label: 'Gimnasio' },
      { key: 'cocina_barbacoa_comunidad', label: 'Cocina Barbacoa Comunidad' },
      { key: 'piscina', label: 'Piscina' },
      { key: 'piscina_cubierta', label: 'Piscina cubierta' },
      { key: 'jacuzzi', label: 'Jacuzzi' },
    ],
  },
]

const iconMap: Record<AmenityKey, string> = {
  gimnasio:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 6.5h11v11h-11z"/><path d="M12 3v18"/><path d="M3 12h18"/></svg>',
  cocina_barbacoa_comunidad:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18v2"/><path d="M20 18v2"/><path d="M12 2v16"/><path d="M2 12h20"/><path d="M4 10v8"/><path d="M20 10v8"/><path d="M8 8v8"/><path d="M16 8v8"/><circle cx="12" cy="14" r="1.5"/></svg>',
  piscina:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20"/><path d="M4 10v4"/><path d="M8 8v8"/><path d="M12 6v12"/><path d="M16 8v8"/><path d="M20 10v4"/></svg>',
  piscina_cubierta:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18"/><path d="M4 19c1.5 0 1.5-1 3-1s1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1\"/><path d="M7 12V7a5 5 0 0 1 10 0v5\"/></svg>',
  jacuzzi:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h16\"/><path d="M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4\"/><path d=\"M8 7c0 1 1 1 1 2s-1 1-1 2\"/><path d=\"M12 6c0 1 1 1 1 2s-1 1-1 2\"/><path d=\"M16 7c0 1 1 1 1 2s-1 1-1 2\"/></svg>',
}

export function getAmenityIconSvg(key: AmenityKey): string {
  return iconMap[key] || ''
}
