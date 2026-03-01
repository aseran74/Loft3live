<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
        {{ proyectoId ? 'Editar proyecto' : 'Crear proyecto' }}
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Completa el formulario para {{ proyectoId ? 'actualizar' : 'crear' }} un proyecto.
      </p>
    </div>

    <div v-if="error" class="p-4 mb-6 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
      {{ error }}
    </div>

    <FormProyecto
      :proyecto="proyecto"
      :loading="saving"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import FormProyecto from '@/components/proyectos/FormProyecto.vue'
import { insforge } from '@/lib/insforge'
import type { Proyecto, PhotoFilesPayload } from '@/types/proyecto'

const route = useRoute()
const router = useRouter()
const proyectoId = route.params.id as string | undefined
const proyecto = ref<Proyecto | null>(null)
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  if (proyectoId) {
    const { data, error: err } = await insforge.database
      .from('proyectos')
      .select()
      .eq('id', proyectoId)
      .maybeSingle()
    if (err) {
      error.value = err.message || 'Error al cargar proyecto'
      return
    }
    proyecto.value = data as Proyecto
  }
})

async function uploadPhotos(files: File[], prefix: string): Promise<string[]> {
  const urls: string[] = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${prefix}/${Date.now()}-${i}.${ext}`
    const { data, error: uploadErr } = await insforge.storage.from('photos').upload(path, file)
    if (uploadErr) throw new Error(uploadErr.message || 'Error subiendo foto')
    if (data?.url) urls.push(data.url)
  }
  return urls
}

function buildPayload(
  data: Omit<Proyecto, 'id' | 'created_at' | 'updated_at'>,
  fotosUrls: string[],
  fotosOficinaActualUrls: string[],
  fotosOficinaRemodeladaUrls: string[],
  fotosInstalacionesUrls: string[]
) {
  return {
    nombre_proyecto: data.nombre_proyecto,
    objetivo_inversion_total: Number(data.objetivo_inversion_total) || 0,
    localizacion: data.localizacion,
    localidad: data.localidad || null,
    permisos: data.permisos || '',
    num_lofts: Number(data.num_lofts) || 0,
    precio_unidad: Number(data.precio_unidad) || 0,
    precio_compra: Number(data.precio_compra) || 0,
    precio_reforma: Number(data.precio_reforma) || 0,
    licencias: Number(data.licencias) || 0,
    gasto_estimado_comunidad: Number(data.gasto_estimado_comunidad) || 0,
    tipo_inversion: data.tipo_inversion || 'Quarterly Bullet',
    porcentaje_llegado: Number(data.porcentaje_llegado) || 0,
    min_termino_meses: Number(data.min_termino_meses) || 24,
    monto_restante: Number(data.monto_restante) || 0,
    alquiler: Boolean(data.alquiler),
    precio_alquiler_mes: data.precio_alquiler_mes != null ? Number(data.precio_alquiler_mes) : null,
    mostrar_en_landing: Boolean(data.mostrar_en_landing),
    consulta_vinculante_urbanistica: Boolean(data.consulta_vinculante_urbanistica),
    vendido_cerrado: Boolean(data.vendido_cerrado),
    caracteristicas: data.caracteristicas || '',
    fotos: fotosUrls,
    fotos_oficina_actual: fotosOficinaActualUrls,
    fotos_oficina_remodelada: fotosOficinaRemodeladaUrls,
    fotos_instalaciones_comunes: fotosInstalacionesUrls,
    videos: Array.isArray(data.videos) ? data.videos : [],
    street_view_embed: data.street_view_embed || '',
    comodidades: Array.isArray(data.comodidades) ? data.comodidades : [],
    complementos_flexliving: Array.isArray(data.complementos_flexliving) ? data.complementos_flexliving : [],
    unidades_tipos: Array.isArray(data.unidades_tipos) ? data.unidades_tipos : [],
    updated_at: new Date().toISOString(),
  }
}

async function handleSubmit(
  data: Omit<Proyecto, 'id' | 'created_at' | 'updated_at'>,
  photoFiles: PhotoFilesPayload
) {
  error.value = ''
  saving.value = true
  try {
    const projectId = proyectoId || crypto.randomUUID()
    const prefix = `proyectos/${projectId}`

    let fotosUrls = [...(data.fotos || [])]
    if (photoFiles.fotos.length > 0) {
      const newUrls = await uploadPhotos(photoFiles.fotos, `${prefix}/galeria`)
      fotosUrls = [...fotosUrls, ...newUrls]
    }

    let fotosOficinaActualUrls = [...(data.fotos_oficina_actual || [])]
    if (photoFiles.fotos_oficina_actual.length > 0) {
      const newUrls = await uploadPhotos(photoFiles.fotos_oficina_actual, `${prefix}/oficina_actual`)
      fotosOficinaActualUrls = [...fotosOficinaActualUrls, ...newUrls]
    }

    let fotosOficinaRemodeladaUrls = [...(data.fotos_oficina_remodelada || [])]
    if (photoFiles.fotos_oficina_remodelada.length > 0) {
      const newUrls = await uploadPhotos(photoFiles.fotos_oficina_remodelada, `${prefix}/oficina_remodelada`)
      fotosOficinaRemodeladaUrls = [...fotosOficinaRemodeladaUrls, ...newUrls]
    }

    let fotosInstalacionesUrls = [...(data.fotos_instalaciones_comunes || [])]
    if (photoFiles.fotos_instalaciones_comunes.length > 0) {
      const newUrls = await uploadPhotos(photoFiles.fotos_instalaciones_comunes, `${prefix}/instalaciones_comunes`)
      fotosInstalacionesUrls = [...fotosInstalacionesUrls, ...newUrls]
    }

    const payload = buildPayload(
      data,
      fotosUrls,
      fotosOficinaActualUrls,
      fotosOficinaRemodeladaUrls,
      fotosInstalacionesUrls
    )

    if (proyectoId) {
      const { error: updateErr } = await insforge.database
        .from('proyectos')
        .update(payload)
        .eq('id', proyectoId)
      if (updateErr) throw updateErr
      router.push('/proyectos')
    } else {
      const { error: insertErr } = await insforge.database
        .from('proyectos')
        .insert([{ ...payload, id: projectId }])
      if (insertErr) throw insertErr
      router.push('/proyectos')
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al guardar el proyecto'
  } finally {
    saving.value = false
  }
}

function handleCancel() {
  router.push('/proyectos')
}
</script>
