export interface UnidadTipo {
  nombre: string
  precio: number
  m2?: number
  planos?: string[]
  unidades_totales?: number
  precio_alquiler?: number
  alquilados?: number
}

export interface Proyecto {
  id: string
  created_at?: string
  updated_at?: string
  nombre_proyecto: string
  objetivo_inversion_total: number
  localizacion: string
  localidad: string | null
  permisos: string
  num_lofts: number
  precio_unidad: number
  /** Total de tickets del proyecto (si no se define, se usa num_lofts) */
  num_tickets?: number | null
  /** TIR preferente en porcentaje (ej. 8 = 8%) */
  tir_preferente?: number | null
  precio_compra: number
  precio_reforma: number
  licencias: number
  gasto_estimado_comunidad: number
  tipo_inversion: string
  porcentaje_llegado: number
  min_termino_meses: number
  monto_restante: number
  alquiler: boolean
  precio_alquiler_mes?: number
  mostrar_en_landing: boolean
  consulta_vinculante_urbanistica: boolean
  vendido_cerrado: boolean
  caracteristicas: string
  fotos: string[]
  fotos_oficina_actual: string[]
  fotos_oficina_remodelada: string[]
  fotos_instalaciones_comunes?: string[]
  videos: string[]
  street_view_embed: string
  comodidades: string[]
  complementos_flexliving?: string[]
  unidades_tipos: UnidadTipo[]
}

export type PhotoFilesPayload = {
  fotos: File[]
  fotos_oficina_actual: File[]
  fotos_oficina_remodelada: File[]
  fotos_instalaciones_comunes: File[]
}
