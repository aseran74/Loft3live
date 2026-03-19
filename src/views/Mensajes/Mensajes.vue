<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Mensajes</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Envía mensajes a inquilinos y compradores. Publica en el tablón de anuncios ofertas, quedadas o avisos.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <div class="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
      <button
        type="button"
        class="border-b-2 px-4 py-2 text-sm font-medium transition-colors"
        :class="tabActivo === 'enviar' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        @click="tabActivo = 'enviar'"
      >
        Enviar mensajes
      </button>
      <button
        type="button"
        class="border-b-2 px-4 py-2 text-sm font-medium transition-colors"
        :class="tabActivo === 'tablon' ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        @click="tabActivo = 'tablon'"
      >
        Tablón de anuncios
      </button>
    </div>

    <!-- Tab: Enviar mensajes -->
    <div v-show="tabActivo === 'enviar'" class="space-y-6">
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-4 text-lg font-semibold">Nuevo mensaje</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium">Proyecto</label>
            <select
              v-model="formMensaje.proyecto_id"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
            >
              <option value="">Todos los proyectos</option>
              <option v-for="p in proyectos" :key="p.id" :value="p.id">{{ p.nombre_proyecto }}</option>
            </select>
          </div>
          <div>
            <label class="mb-2 block text-sm font-medium">Enviar a</label>
            <div class="flex flex-wrap gap-3">
              <label class="inline-flex items-center gap-2">
                <input v-model="formMensaje.enviarA" type="radio" value="inquilinos" class="h-4 w-4" />
                Todos los inquilinos
              </label>
              <label class="inline-flex items-center gap-2">
                <input v-model="formMensaje.enviarA" type="radio" value="compradores" class="h-4 w-4" />
                Todos los compradores
              </label>
              <label class="inline-flex items-center gap-2">
                <input v-model="formMensaje.enviarA" type="radio" value="seleccion" class="h-4 w-4" />
                Seleccionar
              </label>
            </div>
          </div>
        </div>
        <div v-if="formMensaje.enviarA === 'seleccion'" class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="rounded-lg border border-gray-200 p-3 dark:border-gray-600">
            <p class="mb-2 text-xs font-medium text-gray-500">Inquilinos</p>
            <div class="max-h-40 overflow-auto space-y-1">
              <label v-for="i in inquilinosProyecto" :key="i.id" class="flex items-center gap-2 text-sm">
                <input v-model="formMensaje.destinatariosInq" type="checkbox" :value="i.id" class="h-3 w-3" />
                Apartamento {{ i.loft_num }} · {{ i.nombre }}
              </label>
              <p v-if="!formMensaje.proyecto_id" class="text-xs text-gray-400">Selecciona un proyecto</p>
            </div>
          </div>
          <div class="rounded-lg border border-gray-200 p-3 dark:border-gray-600">
            <p class="mb-2 text-xs font-medium text-gray-500">Compradores</p>
            <div class="max-h-40 overflow-auto space-y-1">
              <label v-for="c in compradoresProyecto" :key="c.id" class="flex items-center gap-2 text-sm">
                <input v-model="formMensaje.destinatariosComp" type="checkbox" :value="c.id" class="h-3 w-3" />
                {{ c.nombre }}
              </label>
              <p v-if="!formMensaje.proyecto_id" class="text-xs text-gray-400">Selecciona un proyecto</p>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <label class="mb-2 block text-sm font-medium">Asunto</label>
          <input
            v-model.trim="formMensaje.asunto"
            type="text"
            placeholder="Asunto del mensaje"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div class="mt-4">
          <label class="mb-2 block text-sm font-medium">Mensaje</label>
          <textarea
            v-model.trim="formMensaje.cuerpo"
            rows="4"
            placeholder="Escribe el mensaje..."
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          />
        </div>
        <div class="mt-4">
          <button
            type="button"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            :disabled="guardandoMensaje || !puedeEnviar"
            @click="enviarMensaje"
          >
            {{ guardandoMensaje ? 'Enviando…' : 'Enviar mensaje' }}
          </button>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 class="mb-3 text-lg font-semibold">Mensajes enviados</h2>
        <ul class="space-y-2">
          <li
            v-for="m in mensajesEnviados"
            :key="m.id"
            class="flex items-center justify-between rounded-lg border border-gray-100 py-2 px-3 dark:border-gray-600"
          >
            <div>
              <span class="font-medium">{{ m.asunto }}</span>
              <span class="ml-2 text-xs text-gray-500">{{ formatoFecha(m.created_at) }} · {{ m.destinatarios_count }} destinatario(s)</span>
            </div>
            <button type="button" class="text-red-600 text-xs hover:underline" @click="eliminarMensaje(m)">Eliminar</button>
          </li>
          <li v-if="mensajesEnviados.length === 0" class="py-4 text-center text-gray-500 text-sm">No hay mensajes enviados</li>
        </ul>
      </div>
    </div>

    <!-- Tab: Tablón de anuncios -->
    <div v-show="tabActivo === 'tablon'" class="space-y-6">
      <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold">Tablón de anuncios</h2>
          <button
            type="button"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
            @click="abrirModalAnuncio(null)"
          >
            Nueva entrada
          </button>
        </div>
        <div class="mb-3">
          <label class="mb-1 block text-xs font-medium text-gray-500">Filtrar por proyecto</label>
          <select
            v-model="filtroTablonProyecto"
            class="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
          >
            <option value="">Todos</option>
            <option v-for="p in proyectos" :key="p.id" :value="p.id">{{ p.nombre_proyecto }}</option>
          </select>
        </div>
        <div class="space-y-3">
          <article
            v-for="a in tablonFiltrado"
            :key="a.id"
            class="rounded-xl border p-4 dark:border-gray-600"
            :class="{
              'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20': a.tipo === 'oferta',
              'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20': a.tipo === 'quedada',
              'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800': a.tipo === 'anuncio',
            }"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <span
                  class="rounded px-2 py-0.5 text-xs font-medium"
                  :class="{
                    'bg-amber-200 text-amber-800 dark:bg-amber-700 dark:text-amber-100': a.tipo === 'oferta',
                    'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-100': a.tipo === 'quedada',
                    'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200': a.tipo === 'anuncio',
                  }"
                >
                  {{ etiquetaTipo(a.tipo) }}
                </span>
                <h3 class="mt-1 font-semibold">{{ a.titulo }}</h3>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">{{ a.contenido }}</p>
                <p v-if="a.fecha_desde || a.fecha_hasta" class="mt-2 text-xs text-gray-500">
                  {{ a.fecha_desde ? formatoFechaCorta(a.fecha_desde) : '' }}
                  <span v-if="a.fecha_desde && a.fecha_hasta"> – </span>
                  {{ a.fecha_hasta ? formatoFechaCorta(a.fecha_hasta) : '' }}
                </p>
                <p v-if="a.proyecto_id" class="mt-1 text-xs text-gray-400">{{ nombreProyecto(a.proyecto_id) }}</p>
              </div>
              <div class="flex gap-2">
                <button type="button" class="text-brand-600 text-xs hover:underline" @click="abrirModalAnuncio(a)">Editar</button>
                <button type="button" class="text-red-600 text-xs hover:underline" @click="eliminarAnuncio(a)">Eliminar</button>
              </div>
            </div>
          </article>
          <p v-if="tablonFiltrado.length === 0" class="py-6 text-center text-gray-500 text-sm">No hay entradas en el tablón</p>
        </div>
      </div>
    </div>

    <!-- Modal anuncio -->
    <Teleport to="body">
      <div
        v-if="modalAnuncioVisible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        @click.self="cerrarModalAnuncio"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-800">
          <h3 class="mb-4 text-lg font-semibold">{{ editandoAnuncio ? 'Editar entrada' : 'Nueva entrada en el tablón' }}</h3>
          <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="mb-2 block text-sm font-medium">Proyecto (opcional)</label>
              <select
                v-model="formAnuncio.proyecto_id"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
              >
                <option value="">Todos / General</option>
                <option v-for="p in proyectos" :key="p.id" :value="p.id">{{ p.nombre_proyecto }}</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Tipo</label>
              <select
                v-model="formAnuncio.tipo"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
              >
                <option value="anuncio">Anuncio</option>
                <option value="oferta">Oferta</option>
                <option value="quedada">Quedada</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Título</label>
              <input
                v-model.trim="formAnuncio.titulo"
                type="text"
                placeholder="Ej. Ofertas marzo, Networking podcasting"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Contenido</label>
              <textarea
                v-model.trim="formAnuncio.contenido"
                rows="3"
                placeholder="Ej. 40% descuento del 5 al 26. En la piscina día 28."
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-2 block text-sm font-medium">Fecha desde (opcional)</label>
                <input v-model="formAnuncio.fecha_desde" type="date" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium">Fecha hasta (opcional)</label>
                <input v-model="formAnuncio.fecha_hasta" type="date" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900" />
              </div>
            </div>
          </div>
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold dark:border-gray-600" @click="cerrarModalAnuncio">Cancelar</button>
            <button
              type="button"
              class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
              :disabled="guardandoAnuncio || !formAnuncio.titulo.trim()"
              @click="guardarAnuncio"
            >
              {{ guardandoAnuncio ? 'Guardando…' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </admin-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { insforge } from '@/lib/insforge'

interface ProyectoLite {
  id: string
  nombre_proyecto: string
}

interface InquilinoLite {
  id: string
  loft_num: number
  nombre: string
}

interface CompradorLite {
  id: string
  nombre: string
}

interface MensajeEnviado {
  id: string
  proyecto_id: string | null
  asunto: string
  cuerpo: string
  created_at: string
  destinatarios_count?: number
}

interface Anuncio {
  id: string
  proyecto_id: string | null
  tipo: 'oferta' | 'quedada' | 'anuncio'
  titulo: string
  contenido: string
  fecha_desde: string | null
  fecha_hasta: string | null
  created_at: string
}

const proyectos = ref<ProyectoLite[]>([])
const inquilinos = ref<InquilinoLite[]>([])
const compradores = ref<CompradorLite[]>([])
const mensajesEnviados = ref<MensajeEnviado[]>([])
const tablonAnuncios = ref<Anuncio[]>([])

const tabActivo = ref<'enviar' | 'tablon'>('enviar')
const error = ref('')
const success = ref('')
const guardandoMensaje = ref(false)
const guardandoAnuncio = ref(false)
const filtroTablonProyecto = ref('')

const formMensaje = ref({
  proyecto_id: '',
  enviarA: 'inquilinos' as 'inquilinos' | 'compradores' | 'seleccion',
  destinatariosInq: [] as string[],
  destinatariosComp: [] as string[],
  asunto: '',
  cuerpo: '',
})

const modalAnuncioVisible = ref(false)
const editandoAnuncio = ref<Anuncio | null>(null)
const formAnuncio = ref({
  proyecto_id: '',
  tipo: 'anuncio' as 'oferta' | 'quedada' | 'anuncio',
  titulo: '',
  contenido: '',
  fecha_desde: '',
  fecha_hasta: '',
})

const inquilinosProyecto = computed(() => {
  if (!formMensaje.value.proyecto_id) return []
  return inquilinos.value.filter((i) => (i as any).proyecto_id === formMensaje.value.proyecto_id)
})

const compradoresProyecto = computed(() => {
  if (!formMensaje.value.proyecto_id) return []
  return compradores.value.filter((c) => (c as any).proyecto_id === formMensaje.value.proyecto_id)
})

const puedeEnviar = computed(() => {
  const f = formMensaje.value
  if (!f.asunto.trim() || !f.cuerpo.trim()) return false
  if (f.enviarA === 'inquilinos') return !!f.proyecto_id
  if (f.enviarA === 'compradores') return !!f.proyecto_id
  if (f.enviarA === 'seleccion') return f.destinatariosInq.length > 0 || f.destinatariosComp.length > 0
  return false
})

const tablonFiltrado = computed(() => {
  const pid = filtroTablonProyecto.value
  if (!pid) return tablonAnuncios.value
  return tablonAnuncios.value.filter((a) => a.proyecto_id === pid)
})

function nombreProyecto(id: string) {
  return proyectos.value.find((p) => p.id === id)?.nombre_proyecto || ''
}

function formatoFecha(iso: string) {
  return new Date(iso).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
}

function formatoFechaCorta(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function etiquetaTipo(tipo: string) {
  return { oferta: 'Oferta', quedada: 'Quedada', anuncio: 'Anuncio' }[tipo] || tipo
}

async function cargarProyectos() {
  const { data, error: err } = await insforge.database.from('proyectos').select('id, nombre_proyecto').order('nombre_proyecto', { ascending: true })
  if (err) return
  proyectos.value = (data ?? []) as ProyectoLite[]
}

async function cargarInquilinos() {
  const { data, error: err } = await insforge.database.from('inquilinos').select('id, proyecto_id, loft_num, nombre')
  if (err) return
  inquilinos.value = (data ?? []) as (InquilinoLite & { proyecto_id: string })[]
}

async function cargarCompradores() {
  const { data, error: err } = await insforge.database.from('compradores').select('id, proyecto_id, nombre')
  if (err) return
  compradores.value = (data ?? []) as (CompradorLite & { proyecto_id: string })[]
}

async function cargarMensajes() {
  const { data, error: err } = await insforge.database.from('mensajes').select('id, proyecto_id, asunto, cuerpo, created_at').order('created_at', { ascending: false })
  if (err) return
  const lista = (data ?? []) as MensajeEnviado[]
  if (lista.length === 0) {
    mensajesEnviados.value = []
    return
  }
  const ids = lista.map((m) => m.id)
  const { data: dest } = await insforge.database.from('mensajes_destinatarios').select('mensaje_id').in('mensaje_id', ids)
  const countByMsg: Record<string, number> = {}
  for (const d of (dest ?? []) as { mensaje_id: string }[]) {
    countByMsg[d.mensaje_id] = (countByMsg[d.mensaje_id] ?? 0) + 1
  }
  mensajesEnviados.value = lista.map((m) => ({ ...m, destinatarios_count: countByMsg[m.id] ?? 0 }))
}

async function cargarTablon() {
  const { data, error: err } = await insforge.database.from('tablon_anuncios').select('id, proyecto_id, tipo, titulo, contenido, fecha_desde, fecha_hasta, created_at').order('created_at', { ascending: false })
  if (err) return
  tablonAnuncios.value = (data ?? []) as Anuncio[]
}

async function enviarMensaje() {
  error.value = ''
  success.value = ''
  const f = formMensaje.value
  let destInq: string[] = []
  let destComp: string[] = []
  if (f.enviarA === 'inquilinos' && f.proyecto_id) {
    destInq = inquilinos.value.filter((i) => (i as any).proyecto_id === f.proyecto_id).map((i) => i.id)
  } else if (f.enviarA === 'compradores' && f.proyecto_id) {
    destComp = compradores.value.filter((c) => (c as any).proyecto_id === f.proyecto_id).map((c) => c.id)
  } else if (f.enviarA === 'seleccion') {
    destInq = f.destinatariosInq
    destComp = f.destinatariosComp
  }
  if (destInq.length === 0 && destComp.length === 0) {
    error.value = 'Selecciona al menos un destinatario.'
    return
  }
  guardandoMensaje.value = true
  try {
    const { data: msg, error: errMsg } = await insforge.database
      .from('mensajes')
      .insert({ proyecto_id: f.proyecto_id || null, asunto: f.asunto.trim(), cuerpo: f.cuerpo.trim() })
      .select('id')
      .single()
    if (errMsg) throw errMsg
    const id = (msg as any).id
    const filas = [
      ...destInq.map((destinatario_id) => ({ mensaje_id: id, tipo: 'inquilino', destinatario_id })),
      ...destComp.map((destinatario_id) => ({ mensaje_id: id, tipo: 'comprador', destinatario_id })),
    ]
    if (filas.length) {
      const { error: errDest } = await insforge.database.from('mensajes_destinatarios').insert(filas)
      if (errDest) throw errDest
    }
    success.value = `Mensaje enviado a ${filas.length} destinatario(s).`
    formMensaje.value.asunto = ''
    formMensaje.value.cuerpo = ''
    formMensaje.value.destinatariosInq = []
    formMensaje.value.destinatariosComp = []
    await cargarMensajes()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error enviando mensaje'
  } finally {
    guardandoMensaje.value = false
  }
}

async function eliminarMensaje(m: MensajeEnviado) {
  if (!confirm('¿Eliminar este mensaje?')) return
  await insforge.database.from('mensajes').delete().eq('id', m.id)
  success.value = 'Mensaje eliminado.'
  await cargarMensajes()
}

function abrirModalAnuncio(a: Anuncio | null) {
  error.value = ''
  editandoAnuncio.value = a
  formAnuncio.value = a
    ? {
        proyecto_id: a.proyecto_id || '',
        tipo: a.tipo,
        titulo: a.titulo,
        contenido: a.contenido,
        fecha_desde: a.fecha_desde || '',
        fecha_hasta: a.fecha_hasta || '',
      }
    : { proyecto_id: '', tipo: 'anuncio', titulo: '', contenido: '', fecha_desde: '', fecha_hasta: '' }
  modalAnuncioVisible.value = true
}

function cerrarModalAnuncio() {
  modalAnuncioVisible.value = false
  editandoAnuncio.value = null
}

async function guardarAnuncio() {
  error.value = ''
  success.value = ''
  guardandoAnuncio.value = true
  try {
    const payload: Record<string, unknown> = {
      proyecto_id: formAnuncio.value.proyecto_id || null,
      tipo: formAnuncio.value.tipo,
      titulo: formAnuncio.value.titulo.trim(),
      contenido: formAnuncio.value.contenido.trim(),
      fecha_desde: formAnuncio.value.fecha_desde || null,
      fecha_hasta: formAnuncio.value.fecha_hasta || null,
    }
    if (editandoAnuncio.value) {
      payload.updated_at = new Date().toISOString()
      const { error: err } = await insforge.database.from('tablon_anuncios').update(payload).eq('id', editandoAnuncio.value.id)
      if (err) {
        error.value = (err as { message?: string })?.message ?? 'Error al actualizar la entrada'
        return
      }
      success.value = 'Entrada actualizada.'
    } else {
      const { error: err } = await insforge.database.from('tablon_anuncios').insert(payload)
      if (err) {
        error.value = (err as { message?: string })?.message ?? 'Error al publicar en el tablón'
        return
      }
      success.value = 'Entrada publicada en el tablón.'
    }
    cerrarModalAnuncio()
    filtroTablonProyecto.value = ''
    await cargarTablon()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error guardando'
  } finally {
    guardandoAnuncio.value = false
  }
}

async function eliminarAnuncio(a: Anuncio) {
  if (!confirm('¿Eliminar esta entrada del tablón?')) return
  await insforge.database.from('tablon_anuncios').delete().eq('id', a.id)
  success.value = 'Entrada eliminada.'
  await cargarTablon()
}

onMounted(async () => {
  await cargarProyectos()
  await cargarInquilinos()
  await cargarCompradores()
  await cargarMensajes()
  await cargarTablon()
})
</script>
