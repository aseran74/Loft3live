import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const publicPaths = ['/signin', '/signup', '/reset-password', '/verify-email']

/** Rutas que solo puede ver el admin. Cualquier otra ruta autenticada no-admin se trata según su perfil. */
const adminOnlyPaths = [
  '/dashboard',
  '/calendar',
  '/form-elements',
  '/basic-tables',
  '/line-chart',
  '/bar-chart',
  '/alerts',
  '/avatars',
  '/badge',
  '/buttons',
  '/images',
  '/videos',
  '/blank',
  '/error-404',
  '/proyectos',
  '/gestion-compradores',
  '/gestion-inquilinos',
  '/gestion-perfiles',
  '/facturacion-alquiler',
  '/facturacion-compradores',
  '/reserva-corta-estancia',
  '/reserva-instalaciones',
  '/mensajes',
  '/incidencias',
  '/flextime',
  '/solicitudes-info',
]

function isAdminOnlyPath(path: string): boolean {
  if (path === '/profile') return false
  return adminOnlyPaths.some((p) => path === p || path.startsWith(p + '/'))
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Landing/LandingPage.vue'),
      meta: {
        title: 'Loft2Live - Inversión y alquiler flexible en lofts | Inicio',
        description: 'Loft2Live: donde el espacio trabaja para ti. Inversión, alquiler flexible y Flex Use en lofts. Grupo Vihorev.',
      },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Ecommerce.vue'),
      meta: { title: 'Loft2Live - Panel de administración' },
    },
    {
      path: '/landing',
      redirect: '/',
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Iniciar sesión | Loft2Live',
        description: 'Accede a tu cuenta Loft2Live: inversión, alquiler flexible y gestión de puntos.',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
    {
      path: '/reset-password',
      name: 'Reset Password',
      component: () => import('../views/Auth/ResetPassword.vue'),
      meta: {
        title: 'Reset Password',
      },
    },
    {
      path: '/verify-email',
      name: 'Verify Email',
      component: () => import('../views/Auth/VerifyEmail.vue'),
      meta: {
        title: 'Verify Email',
      },
    },
    {
      path: '/proyectos',
      name: 'Proyectos',
      component: () => import('../views/Proyectos/ListaProyectos.vue'),
      meta: {
        title: 'Proyectos',
      },
    },
    {
      path: '/proyectos/crear',
      name: 'Crear Proyecto',
      component: () => import('../views/Proyectos/CrearProyecto.vue'),
      meta: {
        title: 'Crear proyecto',
      },
    },
    {
      path: '/proyectos/:id',
      name: 'Detalle Proyecto',
      component: () => import('../views/Proyectos/DetalleProyecto.vue'),
      meta: {
        title: 'Detalle proyecto',
      },
    },
    {
      path: '/proyectos/:id/editar',
      name: 'Editar Proyecto',
      component: () => import('../views/Proyectos/CrearProyecto.vue'),
      meta: {
        title: 'Editar proyecto',
      },
    },
    {
      path: '/gestion-compradores',
      name: 'Gestión Compradores',
      component: () => import('../views/Compradores/GestionCompradores.vue'),
      meta: {
        title: 'Gestión compradores',
      },
    },
    {
      path: '/gestion-inquilinos',
      name: 'Gestión Inquilinos',
      component: () => import('../views/Inquilinos/GestionInquilinos.vue'),
      meta: {
        title: 'Gestión inquilinos',
      },
    },
    {
      path: '/gestion-perfiles',
      name: 'Gestión perfiles',
      component: () => import('../views/Perfiles/GestionPerfiles.vue'),
      meta: {
        title: 'Gestión perfiles',
      },
    },
    {
      path: '/facturacion-alquiler',
      name: 'Facturación Alquiler',
      component: () => import('../views/Facturacion/FacturacionAlquiler.vue'),
      meta: {
        title: 'Facturación alquiler',
      },
    },
    {
      path: '/facturacion-compradores',
      name: 'Facturación Compradores',
      component: () => import('../views/Facturacion/FacturacionCompradores.vue'),
      meta: {
        title: 'Facturación compradores',
      },
    },
    {
      path: '/reserva-corta-estancia',
      name: 'Reserva Corta Estancia',
      component: () => import('../views/Reservas/ReservaCortaEstancia.vue'),
      meta: {
        title: 'Reserva corta estancia',
      },
    },
    {
      path: '/reserva-instalaciones',
      name: 'Reserva Instalaciones',
      component: () => import('../views/Reservas/ReservaInstalaciones.vue'),
      meta: {
        title: 'Reserva instalaciones',
      },
    },
    {
      path: '/mensajes',
      name: 'Mensajes',
      component: () => import('../views/Mensajes/Mensajes.vue'),
      meta: {
        title: 'Mensajes',
      },
    },
    {
      path: '/incidencias',
      name: 'Incidencias',
      component: () => import('../views/Incidencias/Incidencias.vue'),
      meta: {
        title: 'Incidencias',
      },
    },
    {
      path: '/flextime',
      name: 'Flextime',
      component: () => import('../views/Admin/FlextimeAdmin.vue'),
      meta: {
        title: 'Flextime',
      },
    },
    {
      path: '/inquilino',
      name: 'Dashboard Inquilino',
      component: () => import('../views/Inquilino/DashboardInquilino.vue'),
      meta: { title: 'Mi espacio' },
    },
    {
      path: '/inquilino/reservar-instalaciones',
      name: 'Reservar Instalaciones Inquilino',
      component: () => import('../views/Inquilino/ReservarInstalacionesInquilino.vue'),
      meta: { title: 'Reservar instalaciones' },
    },
    {
      path: '/inquilino/incidencias',
      name: 'Incidencias Inquilino',
      component: () => import('../views/Inquilino/IncidenciasInquilino.vue'),
      meta: { title: 'Incidencias' },
    },
    {
      path: '/inquilino/mensajes',
      name: 'Mensajes Inquilino',
      component: () => import('../views/Inquilino/MensajesInquilino.vue'),
      meta: { title: 'Mensajes' },
    },
    {
      path: '/inquilino/flextime',
      name: 'Flextime Inquilino',
      component: () => import('../views/Inquilino/FlextimeInquilino.vue'),
      meta: { title: 'Flextime' },
    },
    {
      path: '/inquilino/utilizar-puntos',
      name: 'Utilizar puntos',
      component: () => import('../views/Inquilino/UtilizarPuntos.vue'),
      meta: { title: 'Utilizar puntos' },
    },
    {
      path: '/comprador',
      name: 'Dashboard Comprador',
      component: () => import('../views/Comprador/DashboardComprador.vue'),
      meta: { title: 'Dashboard comprador' },
    },
    {
      path: '/comprador/mensajes',
      name: 'Mensajes Comprador',
      component: () => import('../views/Comprador/MensajesComprador.vue'),
      meta: { title: 'Mensajes' },
    },
    {
      path: '/comprador/mi-facturacion',
      name: 'Mi Facturación Comprador',
      component: () => import('../views/Comprador/MiFacturacionComprador.vue'),
      meta: { title: 'Mi facturación' },
    },
    {
      path: '/comprador/compra-puntos',
      name: 'Compra de puntos',
      component: () => import('../views/Comprador/CompraPuntos.vue'),
      meta: { title: 'Compra de puntos' },
    },
    {
      path: '/comprador/utilizar-puntos',
      name: 'Utilizar puntos (comprador)',
      component: () => import('../views/Comprador/UtilizarPuntosComprador.vue'),
      meta: { title: 'Utilizar puntos' },
    },
    {
      path: '/visitante',
      name: 'Dashboard Visitante',
      component: () => import('../views/Visitante/DashboardVisitante.vue'),
      meta: { title: 'Solicitar información' },
    },
    {
      path: '/solicitudes-info',
      name: 'Solicitudes de información',
      component: () => import('../views/Admin/SolicitudesInfo.vue'),
      meta: { title: 'Solicitudes de información' },
    },
    {
      path: '/inversiones',
      name: 'Inversiones',
      component: () => import('../views/Proyectos/ListaProyectosPublico.vue'),
      meta: {
        title: 'Loft2Live - Proyectos de inversión en lofts',
        description: 'Conoce los proyectos de inversión disponibles. Invierte o alquila con Flexliving y ventajas fiscales.',
      },
    },
    {
      path: '/inversiones/:id',
      name: 'InversionesDetalle',
      component: () => import('../views/Proyectos/DetalleProyecto.vue'),
      meta: {
        title: 'Loft2Live - Detalle del proyecto',
        description: 'Detalle del proyecto de inversión: precios, lofts, fotos y documentación.',
      },
    },
    { path: '/alquileres', redirect: '/' },
    { path: '/alquileres/temporada', redirect: '/' },
    { path: '/alquileres/corta-estancia', redirect: '/' },
    { path: '/quienes-somos', redirect: '/' },
    {
      path: '/blog',
      name: 'Blog',
      component: () => import('../views/Landing/BlogPage.vue'),
      meta: {
        title: 'Loft2Live - Blog | Flexliving e inversión',
        description: 'Artículos sobre inversión en lofts, Flex Use, ventajas fiscales y estilo de vida flexible.',
      },
    },
  ],
})

export default router

const defaultDescription = 'Loft2Live: plataforma de inversión y alquiler flexible en lofts. Grupo Vihorev.'

router.beforeEach(async (to, from, next) => {
  document.title = (to.meta.title as string) ?? 'Loft2Live'
  const desc = (to.meta.description as string) ?? defaultDescription
  let metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc) metaDesc.setAttribute('content', desc)
  const canonical = document.querySelector('#canonical-url') as HTMLLinkElement | null
  if (canonical && window.location.origin) {
    canonical.href = window.location.origin + (import.meta.env.BASE_URL === '/' ? to.fullPath : import.meta.env.BASE_URL + to.fullPath)
  }

  const { isAuthenticated, isAdmin, isInquilino, isComprador, perfilRol, loading, waitUntilReady } = useAuth()
  if (loading.value) {
    await waitUntilReady()
    return next({ path: to.path, query: to.query, replace: true })
  }

  const isPublic = publicPaths.some((p) => to.path === p || to.path.startsWith(p + '?'))
  if (isPublic) {
    next()
    return
  }

  if (to.path === '/') {
    next()
    return
  }

  if (to.path === '/blog') {
    next()
    return
  }

  if (to.path === '/inversiones' || to.path.startsWith('/inversiones/')) {
    next()
    return
  }

  if (!isAuthenticated.value) {
    next('/signin')
    return
  }

  const esInquilino = isInquilino.value || perfilRol.value === 'inquilino'
  const esComprador = isComprador.value || perfilRol.value === 'comprador'
  const esVisitante = perfilRol.value === 'visitante'

  // Perfil: permitido a los 4 perfiles; la vista elige layout según rol
  if (to.path === '/profile') {
    next()
    return
  }

  // Rutas solo admin: si no es admin, redirigir a su dashboard
  if (isAdminOnlyPath(to.path)) {
    if (!isAdmin.value) {
      if (esComprador) return next('/comprador')
      if (esInquilino) return next('/inquilino')
      return next('/visitante')
    }
    next()
    return
  }

  // Inquilino: solo inquilinos (admin ya no llega aquí para estas rutas)
  if (to.path.startsWith('/inquilino')) {
    if (isAdmin.value) {
      next('/dashboard')
      return
    }
    if (esInquilino) {
      next()
      return
    }
    next(esComprador ? '/comprador' : '/visitante')
    return
  }

  // Comprador: solo compradores
  if (to.path.startsWith('/comprador')) {
    if (isAdmin.value) {
      next('/dashboard')
      return
    }
    if (esComprador) {
      next()
      return
    }
    next(esInquilino ? '/inquilino' : '/visitante')
    return
  }

  // Visitante: solo visitantes
  if (to.path.startsWith('/visitante')) {
    if (isAdmin.value) {
      next('/dashboard')
      return
    }
    next()
    return
  }

  // Cualquier otra ruta autenticada no permitida para el rol → redirigir a su dashboard
  if (esComprador) next('/comprador')
  else if (esInquilino) next('/inquilino')
  else if (esVisitante) next('/visitante')
  else next()
})
