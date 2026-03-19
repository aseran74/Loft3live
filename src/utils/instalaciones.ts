export type InstalacionTipo =
  | 'sala_podcast'
  | 'pista_padel'
  | 'barbacoa_networking'
  | 'sala_cine'
  | 'billar'
  | 'sala_reuniones'
  | 'azotea_comunidad'
  | 'espacio_podcasting'
  | 'espacio_networking'

export interface InstalacionDef {
  tipo: InstalacionTipo
  label: string
  duracionMinutos: number
  descripcion?: string
}

export const instalacionesDef: InstalacionDef[] = [
  { tipo: 'sala_podcast', label: 'Sala Podcast', duracionMinutos: 60, descripcion: 'Reserva por horas (ej. 20:00-21:00)' },
  { tipo: 'pista_padel', label: 'Pista de Pádel', duracionMinutos: 90, descripcion: 'Reserva de hora y media' },
  { tipo: 'barbacoa_networking', label: 'Barbacoa / Cocina Networking', duracionMinutos: 120, descripcion: 'Uso de zona barbacoa y cocina' },
  { tipo: 'sala_cine', label: 'Sala de Cine', duracionMinutos: 120, descripcion: 'Proyección y butacas' },
  { tipo: 'billar', label: 'Billar', duracionMinutos: 90, descripcion: 'Mesa de billar' },
  { tipo: 'sala_reuniones', label: 'Sala de Reuniones', duracionMinutos: 60, descripcion: 'Reuniones y videollamadas' },
  { tipo: 'azotea_comunidad', label: 'Azotea comunidad', duracionMinutos: 120, descripcion: 'Zona azotea de uso común' },
  { tipo: 'espacio_podcasting', label: 'Espacio podcasting', duracionMinutos: 60, descripcion: 'Cabina o sala para grabar podcasts' },
  { tipo: 'espacio_networking', label: 'Espacio networking', duracionMinutos: 90, descripcion: 'Zona para eventos y networking' },
]

export function getInstalacionByTipo(tipo: string): InstalacionDef | undefined {
  return instalacionesDef.find((i) => i.tipo === tipo)
}

/** Convierte minutos a "HH:mm" desde medianoche (ej. 90 -> "01:30") */
export function minutosAHora(minutos: number): string {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Suma minutos a una hora "HH:mm" o "HH:mm:ss", devuelve "HH:mm" */
export function sumarMinutosAHora(hora: string, minutos: number): string {
  const [h, m] = hora.split(':').map(Number)
  const totalMin = (h ?? 0) * 60 + (m ?? 0) + minutos
  const newH = Math.floor(totalMin / 60) % 24
  const newM = totalMin % 60
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}

/** Formatea "HH:mm:ss" o "HH:mm" a "HH:mm" para mostrar */
export function formatearHora(t: string): string {
  if (!t) return '—'
  const part = t.slice(0, 5)
  return part.length === 5 ? part : t
}
