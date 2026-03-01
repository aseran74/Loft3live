# Loft2live

Aplicación web para el ecosistema **Flexliving**: normativa, inversión y gestión de espacios híbridos (vivir y trabajar). Landing pública, panel de administración y áreas privadas para inquilinos, compradores y visitantes.

## Descripción

Loft2live permite:

- **Landing** con explicación del modelo (6 decisiones claras: cómo entrar, ventajas fiscales compra/alquiler, control y movilidad, Flex Use, salida sin bloqueos), blog de noticias del sector y CTAs.
- **Panel administración**: proyectos, gestión de compradores e inquilinos, perfiles, facturación alquiler y compradores, reservas (corta estancia, instalaciones), mensajes, incidencias, Flextime (periodos y canjes), compra y reserva de puntos.
- **Área inquilino**: dashboard, mensajes, reservar instalaciones, incidencias, Flextime (activar periodos), utilizar puntos (con filtro por localidad y mapa).
- **Área comprador**: dashboard, mensajes, mi facturación, compra de puntos (trimestre pendiente por puntos), utilizar puntos (reservas aprobadas por defecto).
- **Área visitante**: solicitudes de información.

La autenticación y los datos se gestionan con **Insforge** (BaaS). Rutas protegidas por perfil (admin, inquilino, comprador, visitante).

## Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vite**
- **Vue Router 4**
- **Tailwind CSS 4**
- **TypeScript**
- **Insforge SDK** (auth, base de datos, storage)
- ApexCharts, FullCalendar, GSAP, etc.

## Requisitos

- Node.js 18.x o superior (recomendado 20.x)
- Cuenta y proyecto en [Insforge](https://insforge.com) para backend (opcional si solo quieres ver la UI)

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/aseran74/Loft3live.git
   cd Loft3live
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Configurar variables de entorno (crear `.env` en la raíz si usas Insforge):

   - URL del backend y clave anónima (según documentación de Insforge).

4. Arrancar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   La app estará en `http://localhost:5173`.

5. Build de producción:

   ```bash
   npm run build
   ```

## Estructura principal

- `src/views/Landing/` — Landing, blog, páginas públicas.
- `src/views/` — Ecommerce (dashboard admin), Inquilino, Comprador, Visitante, Auth, Proyectos, etc.
- `src/components/` — Layouts (Admin, Inquilino, Comprador, Visitante), landing, ecommerce, formularios.
- `src/composables/useAuth.ts` — Sesión, roles y datos de inquilino/comprador.
- `src/router/index.ts` — Rutas y protección por perfil.
- `src/lib/insforge.ts` — Cliente Insforge.

## Licencia

Proyecto privado. Uso según acuerdo con los titulares del repositorio.
