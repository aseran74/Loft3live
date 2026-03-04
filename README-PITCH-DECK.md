# Loft2Live — Pitch Deck & Documentación del Producto

> **Plataforma inmobiliaria P2P** impulsada por **Grupo Vihorev**. Mismo espacio para vivir y trabajar, con estructura clara, flexible y defendible legalmente.

---

## 1. Elevator pitch

**Loft2Live** (también referido como LoftAndLive) es una plataforma que permite:

- **Invertir** en proyectos de lofts (comprar tickets o unidades completas).
- **Vivir y trabajar** en espacios tipo Smart Loft con ventajas fiscales (modelo 80/20).
- **Intercambiar uso** entre miembros (Flextime, puntos, lofts libres y agosto libre).

Todo ello con **control digital**, **movilidad** (el contrato te sigue si cambias de ciudad) y **salida sin bloqueos** (alquiler libre, venta de participaciones en la red, o venta tradicional).

---

## 2. Problema y oportunidad

- Rigidez del “ladrillo”: poca flexibilidad entre vivir, trabajar e invertir.
- Falta de modelos fiscales claros para uso profesional + habitacional.
- Inversores y residentes buscan liquidez, movilidad y aprovechamiento del espacio cuando no lo usan.

**Oportunidad:** Un ecosistema que una **inversión**, **vivienda profesional** y **uso flexible** (Flex Use) en una sola plataforma, con tokenización (ERC-1155, Polygon) y derechos canjeables por estancias y servicios.

---

## 3. Solución: las 6 decisiones claras

| # | Decisión | Descripción |
|---|----------|-------------|
| 1 | **Cómo entrar** | Alquiler flexible sin inversión, Socio Flex desde 5.000€ (tickets/participaciones), o compra directa del loft. |
| 2 | **Ventajas fiscales compra** | Uso profesional: recuperar IVA, amortizar y deducir gastos. |
| 3 | **Ventajas fiscales alquiler** | 80% uso profesional (deducible 100%) + 20% habitacional (deducible 30%). Modelo Smart Loft 80/20. |
| 4 | **Control y movilidad** | Perfil digital, ingresos en tiempo real, historial; contrato portable entre ciudades. |
| 5 | **Flex Use** | Cuando no usas el espacio, otros lo ocupan; tú generas ingresos o créditos (puntos) canjeables por estancias/servicios/descuentos. |
| 6 | **Salida sin bloqueos** | Alquiler libre, venta de participaciones en la red, o venta tradicional del loft. |

---

## 4. Modelo de negocio y producto

- **Emisor / Gestor:** Loft2Live S.L. (ecosistema de activos híbridos).
- **Tecnología:** Protocolo ERC-1155 sobre Polygon. Tokens de utilidad (L2L), tickets de participación (ej. 5.000€), cláusula anti-especulación (precio ligado al valor del servicio).
- **Tarifas:** Tarifa Socio Loft2Live para titulares de al menos 1 ticket; descuentos en días sueltos y en red.
- **Agosto:** Desalojo agosto (1 sep – 31 jul) o prórroga; agosto disponible para mantenimiento o corta estancia.

---

## 5. Funcionalidades del producto (por rol)

### 5.1 Público (sin login)

| Funcionalidad | Descripción |
|---------------|-------------|
| **Landing** | Hero, confianza (métricas desde Insforge), oportunidades de inversión, cómo funciona, beneficios, CTA. |
| **Inversiones** | Listado y detalle de proyectos de inversión (precio, lofts, permisos, fotos, vídeos, calculadora IRPF 80/20). |
| **Blog** | Página de blog. |
| **Auth** | Registro, inicio de sesión, restablecer contraseña, verificación de email. |

### 5.2 Administrador

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | KPIs: proyectos, inquilinos, compradores, reservas instalaciones, corta estancia, incidencias, solicitudes de información. Accesos rápidos a compra de puntos y reservas de puntos compradores. |
| **Proyectos** | Listado, crear, editar, detalle (fotos, oficina actual/remodelada, instalaciones, vídeos, unidades, precios, documentación). |
| **Gestión compradores** | CRUD compradores, asignación a proyecto, tickets comprados vs. tickets en proyecto. |
| **Gestión inquilinos** | CRUD inquilinos, loft #, proyecto, desalojo agosto, fechas alquiler. |
| **Gestión perfiles** | Unificación de perfiles (admin, inquilinos, compradores); asignación de rol (admin, inquilino, comprador, visitante). |
| **Facturación alquiler** | Configuración por proyecto/inquilino, periodos, base 55 lofts, renta base, descuento inquilino-propietario. |
| **Facturación compradores** | Gastos por mes, reparto a compradores por trimestre, TIR por ticket. |
| **Reserva instalaciones** | Reservas de instalaciones comunes (salas, etc.) por proyecto, inquilino, fecha. |
| **Reserva corta estancia** | Reservas de corta estancia por loft (disponibilidad según desalojo agosto / temporada). |
| **Mensajes** | Envío a inquilinos/compradores; tablón de anuncios. |
| **Incidencias** | Listado y gestión de incidencias. |
| **Flextime (admin)** | Canjes entre inquilinos (solicitudes, aprobaciones). |
| **Solicitudes de información** | Gestión de solicitudes de información (visitantes). |

### 5.3 Comprador (inversor)

| Módulo | Descripción |
|--------|-------------|
| **Dashboard comprador** | Resumen, saldo de puntos, acceso a compra/utilizar puntos, facturación, mensajes. |
| **Compra de puntos** | Compra de puntos asociada a trimestre/cobro (gestión con el equipo). |
| **Utilizar puntos** | Selector de **proyecto** y **cards de disponibilidad** (tabla `disponibilidad`): por cada opción se muestra **número de loft**, tipo (Flextime, Agosto libre, Libre), fechas y **coste en puntos/día**. Reserva aprobada descuenta puntos. |
| **Mi facturación** | Consulta de facturación y repartos como comprador. |
| **Mensajes** | Bandeja de mensajes. |

### 5.4 Inquilino (residente)

| Módulo | Descripción |
|--------|-------------|
| **Mi espacio (dashboard)** | Resumen, loft asignado, enlaces a reservar instalaciones, Flextime, utilizar puntos, incidencias, mensajes. |
| **Reservar instalaciones** | Reserva de instalaciones comunes por día/hora. |
| **Flextime** | Activar periodos en los que tu loft está disponible para otros; puntos por día (renta/30). Otros solicitan uso; al aprobar, se les restan puntos y a ti se te suman. |
| **Utilizar puntos** | Solicitar uso del loft de otro inquilino (periodos Flextime activos); descuento de puntos al aprobar. |
| **Incidencias** | Reportar y ver incidencias. |
| **Mensajes** | Bandeja de mensajes. |

### 5.5 Visitante

| Módulo | Descripción |
|--------|-------------|
| **Solicitar información** | Dashboard para enviar solicitudes de información (gestión en admin). |

---

## 6. Datos y lógica de negocio clave

### 6.1 Tabla `disponibilidad` (Insforge)

- **Origen:** Vista materializada rellenada por **triggers** a partir de `inquilinos`, `flextime_periodos` y `proyectos`.
- **Tipos (motivo):**
  - **libre:** Loft sin inquilino; temporada 1 sep – 31 ago; coste en puntos/día (ej. 33).
  - **libre_agosto:** Inquilino con desalojo agosto; disponible 1–31 agosto; coste en puntos/día.
  - **flextime:** Periodos activados por inquilinos; fechas y puntos/día del periodo.
- **Uso:** Compradores e inquilinos consumen esta tabla para **utilizar puntos** (cards por proyecto, loft, motivo, fechas, coste). El coste en puntos sirve para **sumar/restar** puntos al reservar.

### 6.2 Configuración landing (Insforge)

- **Tabla `landing_trust_config`:** Datos persistentes de la sección “Confianza” (hero_stats, phases, total_items, roi_percent). Opcionalmente se mezclan con datos en vivo (número de compradores, proyectos, valor bruto desde BD).

### 6.3 Perfiles y roles

- **admin:** Acceso al panel de administración y todas las rutas admin.
- **inquilino:** Dashboard inquilino, Flextime, reservas instalaciones, utilizar puntos, incidencias, mensajes.
- **comprador:** Dashboard comprador, compra/utilizar puntos, mi facturación, mensajes.
- **visitante:** Solo solicitar información.

La app redirige según rol tras login (admin → `/dashboard`, comprador → `/comprador`, inquilino → `/inquilino`, visitante → `/visitante`).

---

## 7. Stack técnico

| Capa | Tecnología |
|------|------------|
| **Frontend** | Vue 3 (Composition API, `<script setup>`), TypeScript, Vite |
| **Estilos** | Tailwind CSS 4, fuentes Outfit / Syne / Switzer |
| **Rutas** | Vue Router 4 (rutas públicas, por rol, guards) |
| **Backend / BBDD** | **Insforge** (BaaS): auth, base de datos, storage, RLS |
| **SDK** | `@insforge/sdk` (cliente para API Insforge) |
| **UI / UX** | FullCalendar, ApexCharts, Flatpickr, GSAP + ScrollTrigger (landing), Swiper |

---

## 8. Estructura de rutas principales

```
/                     Landing pública
/inversiones          Listado proyectos inversión (público)
/inversiones/:id      Detalle proyecto (público)
/blog                 Blog
/signin, /signup      Auth

/dashboard            Admin: panel
/proyectos            Admin: listado proyectos
/gestion-compradores  Admin: compradores
/gestion-inquilinos   Admin: inquilinos
/facturacion-alquiler, /facturacion-compradores
/reserva-instalaciones, /reserva-corta-estancia
/mensajes, /incidencias, /flextime, /solicitudes-info

/comprador            Comprador: dashboard
/comprador/compra-puntos
/comprador/utilizar-puntos   ← Cards por proyecto + disponibilidad + loft

/inquilino            Inquilino: mi espacio
/inquilino/flextime
/inquilino/utilizar-puntos
/inquilino/reservar-instalaciones

/visitante            Visitante: solicitar información
/profile              Perfil (todos los roles)
```

---

## 9. Cómo usar este documento para un pitch deck

- **Slides 1–2:** Elevator pitch + problema/oportunidad (secciones 1 y 2).
- **Slides 3–4:** Las 6 decisiones + modelo (secciones 3 y 4).
- **Slides 5–6:** Producto por rol (resumir sección 5: público, admin, comprador, inquilino).
- **Slide 7:** Datos clave (disponibilidad, puntos, Flextime) — sección 6.
- **Slide 8:** Stack y escalabilidad — sección 7.
- **Slide 9:** Próximos pasos / roadmap (incluir si tienes hitos).
- **Slide 10:** Contacto / “¿Preguntas?”.

Puedes copiar tablas y párrafos a PowerPoint, Google Slides o Canva y ajustar diseño y métricas (por ejemplo datos reales de `landing_trust_config` o de producción).

---

## 10. Ejecución local

```bash
npm install
npm run dev
```

Variables de entorno recomendadas (ej. `.env`):

- `VITE_INSFORGE_BASE_URL` (o `VITE_INSFORGE_URL`)
- `VITE_INSFORGE_ANON_KEY`

---

**© LoftAndLive / Loft2Live — Documentación para pitch deck y onboarding.**
