<template>
  <admin-layout>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Gestión perfiles</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Asigna el rol de acceso (visitante, inquilino, comprador, admin) a los correos registrados. Si no hay perfil guardado, el rol se deduce de Gestión Inquilinos, Gestión Compradores o del email de admin. Los que se registran obtienen perfil «visitante» al registrarse o al iniciar sesión; si falta alguno, añádelo arriba por email.
      </p>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{{ error }}</div>
    <div v-if="success" class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{{ success }}</div>

    <div class="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Añadir perfil por email</h2>
      <div class="flex flex-wrap items-end gap-4">
        <div class="min-w-[200px]">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            v-model.trim="nuevoEmail"
            type="email"
            placeholder="usuario@ejemplo.com"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div class="min-w-[160px]">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Rol</label>
          <select
            v-model="nuevoRol"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            <option value="visitante">Visitante</option>
            <option value="inquilino">Inquilino</option>
            <option value="comprador">Comprador</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="button"
          class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
          :disabled="guardandoAdd || !nuevoEmail"
          @click="añadirPerfil"
        >
          {{ guardandoAdd ? 'Guardando…' : 'Añadir perfil' }}
        </button>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Perfiles por email</h2>
      <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Lista unificada: perfiles guardados, correos de inquilinos, de compradores y email de admin. Cambia el rol y guarda para asignar acceso.
      </p>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-600">
              <th class="pb-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">Email</th>
              <th class="pb-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">Rol efectivo</th>
              <th class="pb-3 pr-4 font-semibold text-gray-700 dark:text-gray-300">Asignar rol</th>
              <th class="pb-3 font-semibold text-gray-700 dark:text-gray-300"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in listaPerfiles"
              :key="item.email"
              class="border-t border-gray-100 dark:border-gray-700"
            >
              <td class="py-3 pr-4 font-medium text-gray-900 dark:text-white">{{ item.email }}</td>
              <td class="py-3 pr-4">
                <span
                  :class="[
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    badgeClass(item.rolEfectivo),
                  ]"
                >
                  {{ rolLabel(item.rolEfectivo) }}
                </span>
              </td>
              <td class="py-3 pr-4">
                <select
                  :value="seleccionados[item.email]"
                  class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  @change="(e) => (seleccionados[item.email] = (e.target as HTMLSelectElement).value as Rol)"
                >
                  <option value="visitante">Visitante</option>
                  <option value="inquilino">Inquilino</option>
                  <option value="comprador">Comprador</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="py-3">
                <button
                  type="button"
                  class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                  :disabled="guardandoId === item.email || seleccionados[item.email] === item.rolEfectivo"
                  @click="guardarRol(item)"
                >
                  {{ guardandoId === item.email ? 'Guardando…' : 'Guardar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="listaPerfiles.length === 0" class="py-6 text-center text-sm text-gray-500">
        No hay perfiles aún. Añade uno arriba o crea inquilinos/compradores con correo.
      </p>
    </div>
  </admin-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { insforge } from '@/lib/insforge'

type Rol = 'visitante' | 'inquilino' | 'comprador' | 'admin'

interface PerfilRow {
  email: string
  rol: Rol | null
}

interface ListaItem {
  email: string
  rolEfectivo: Rol
  enInquilinos: boolean
  enCompradores: boolean
}

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@admin.com'
const error = ref('')
const success = ref('')
const perfiles = ref<PerfilRow[]>([])
const emailsInquilinos = ref<Set<string>>(new Set())
const emailsCompradores = ref<Set<string>>(new Set())
const seleccionados = ref<Record<string, Rol>>({})
const nuevoEmail = ref('')
const nuevoRol = ref<Rol>('visitante')
const guardandoAdd = ref(false)
const guardandoId = ref<string | null>(null)

const listaPerfiles = computed(() => {
  const emails = new Set<string>()
  perfiles.value.forEach((p) => emails.add(p.email.toLowerCase()))
  emailsInquilinos.value.forEach((e) => emails.add(e.toLowerCase()))
  emailsCompradores.value.forEach((e) => emails.add(e.toLowerCase()))
  emails.add(adminEmail.toLowerCase())

  return Array.from(emails).sort((a, b) => a.localeCompare(b)).map((email) => {
    const perfil = perfiles.value.find((p) => p.email.toLowerCase() === email)
    const enInquilinos = emailsInquilinos.value.has(email)
    const enCompradores = emailsCompradores.value.has(email)
    let rolEfectivo: Rol
    if (perfil?.rol) {
      rolEfectivo = perfil.rol
    } else if (email === adminEmail.toLowerCase()) {
      rolEfectivo = 'admin'
    } else if (enInquilinos) {
      rolEfectivo = 'inquilino'
    } else if (enCompradores) {
      rolEfectivo = 'comprador'
    } else {
      rolEfectivo = 'visitante'
    }
    return {
      email,
      rolEfectivo,
      enInquilinos,
      enCompradores,
    }
  })
})

function rolLabel(r: Rol): string {
  const map: Record<Rol, string> = {
    visitante: 'Visitante',
    inquilino: 'Inquilino',
    comprador: 'Comprador',
    admin: 'Admin',
  }
  return map[r] ?? r
}

function badgeClass(r: Rol): string {
  const map: Record<Rol, string> = {
    visitante: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    inquilino: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
    comprador: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    admin: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  }
  return map[r] ?? ''
}

async function load() {
  error.value = ''
  const [resPerfiles, resInq, resComp] = await Promise.all([
    insforge.database.from('perfiles').select('email, rol'),
    insforge.database.from('inquilinos').select('correo'),
    insforge.database.from('compradores').select('correo'),
  ])
  if (resPerfiles.error) {
    error.value = resPerfiles.error.message || 'Error cargando perfiles'
    return
  }
  perfiles.value = (resPerfiles.data ?? []).map((r: any) => ({
    email: (r.email ?? '').trim().toLowerCase(),
    rol: r.rol ?? null,
  })).filter((r: PerfilRow) => r.email)

  const inq = (resInq.data ?? []).map((r: any) => (r.correo ?? '').trim().toLowerCase()).filter(Boolean)
  const comp = (resComp.data ?? []).map((r: any) => (r.correo ?? '').trim().toLowerCase()).filter(Boolean)
  emailsInquilinos.value = new Set(inq)
  emailsCompradores.value = new Set(comp)

  const emails = new Set<string>([
    ...perfiles.value.map((p) => p.email),
    ...inq,
    ...comp,
    adminEmail.toLowerCase(),
  ])
  const next: Record<string, Rol> = {}
  emails.forEach((email) => {
    const perfil = perfiles.value.find((p) => p.email === email)
    if (perfil?.rol) next[email] = perfil.rol
    else if (email === adminEmail.toLowerCase()) next[email] = 'admin'
    else if (emailsInquilinos.value.has(email)) next[email] = 'inquilino'
    else if (emailsCompradores.value.has(email)) next[email] = 'comprador'
    else next[email] = 'visitante'
  })
  seleccionados.value = next
}

async function añadirPerfil() {
  if (!nuevoEmail.value) return
  guardandoAdd.value = true
  error.value = ''
  success.value = ''
  const email = nuevoEmail.value.trim().toLowerCase()
  const { error: err } = await insforge.database
    .from('perfiles')
    .upsert({ email, rol: nuevoRol.value, updated_at: new Date().toISOString() }, { onConflict: 'email' })
  guardandoAdd.value = false
  if (err) {
    error.value = err.message || 'Error al añadir perfil'
    return
  }
  success.value = `Perfil añadido: ${email} como ${rolLabel(nuevoRol.value)}`
  nuevoEmail.value = ''
  await load()
}

async function guardarRol(item: ListaItem) {
  guardandoId.value = item.email
  error.value = ''
  success.value = ''
  const rol = seleccionados.value[item.email]
  if (rol == null) {
    guardandoId.value = null
    return
  }
  const { error: err } = await insforge.database
    .from('perfiles')
    .upsert(
      { email: item.email, rol, updated_at: new Date().toISOString() },
      { onConflict: 'email' }
    )
  guardandoId.value = null
  if (err) {
    error.value = err.message || 'Error al guardar rol'
    return
  }
  success.value = `Rol de ${item.email} actualizado a ${rolLabel(rol)}`
  await load()
}

onMounted(load)
</script>
