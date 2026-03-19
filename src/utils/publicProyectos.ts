import { insforge } from '@/lib/insforge'
import type { Proyecto } from '@/types/proyecto'

/**
 * Proyectos para la landing (público). Opcionalmente solo los que tienen mostrar_en_landing = true.
 */
export async function fetchPublicProyectos(onlyLanding = false): Promise<Proyecto[]> {
  let query = insforge.database
    .from('proyectos')
    .select(
      'id, created_at, updated_at, nombre_proyecto, objetivo_inversion_total, localizacion, localidad, permisos, num_lofts, num_tickets, precio_unidad, tir_preferente, precio_compra, precio_reforma, licencias, gasto_estimado_comunidad, tipo_inversion, porcentaje_llegado, min_termino_meses, monto_restante, alquiler, precio_alquiler_mes, mostrar_en_landing, consulta_vinculante_urbanistica, vendido_cerrado, caracteristicas, fotos, fotos_oficina_actual, fotos_oficina_remodelada, fotos_instalaciones_comunes, videos, street_view_embed, comodidades, unidades_tipos, complementos_flexliving'
    )
  if (onlyLanding) {
    query = query.eq('mostrar_en_landing', true)
  }
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw new Error(error.message || 'Error al cargar proyectos')
  return (data ?? []).map((row: any) => ({
    ...row,
    fotos: Array.isArray(row.fotos) ? row.fotos : [],
    fotos_oficina_actual: Array.isArray(row.fotos_oficina_actual) ? row.fotos_oficina_actual : [],
    fotos_oficina_remodelada: Array.isArray(row.fotos_oficina_remodelada) ? row.fotos_oficina_remodelada : [],
    fotos_instalaciones_comunes: Array.isArray(row.fotos_instalaciones_comunes) ? row.fotos_instalaciones_comunes : [],
    videos: Array.isArray(row.videos) ? row.videos : [],
    comodidades: Array.isArray(row.comodidades) ? row.comodidades : [],
    unidades_tipos: Array.isArray(row.unidades_tipos) ? row.unidades_tipos : [],
    complementos_flexliving: Array.isArray(row.complementos_flexliving) ? row.complementos_flexliving : [],
  })) as Proyecto[]
}
