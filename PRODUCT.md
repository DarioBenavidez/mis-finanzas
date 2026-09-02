# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Usuarios activos hoy de finanzas personales: gente que ya usa Orbe desde la app móvil
(Expo) y/o el bot de WhatsApp, con datos reales en producción. Esta versión web/PWA es
una superficie adicional para las mismas cuentas existentes, no un producto nuevo para
una audiencia distinta.

## Product Purpose

Orbe es un asistente de finanzas personales: seguimiento de ingresos/gastos,
presupuesto por categoría, ahorros, deudas, préstamos, gastos fijos, suscripciones,
turnos, calendario y proyección de saldo futuro. Existe para que la persona pueda ver y
registrar su situación financiera desde donde le resulte más cómodo en cada momento.

## Positioning

El mismo dato en tres superficies: app móvil, web y bot de WhatsApp comparten
exactamente la misma fila en Supabase (tabla `finanzas`, columna jsonb `data`). Lo que
se carga por cualquiera de las tres se ve al instante en las otras dos. El
diferenciador no es una superficie particular sino que ninguna de las tres es la
"verdadera" — son vistas intercambiables del mismo estado.

## Operating Context

- Backend y esquema de datos compartidos con la app real (Expo) y el bot de WhatsApp;
  cualquier cambio de esquema en la web tiene que mantener paridad con esos dos.
- Categorías de gastos son dinámicas y editables por el usuario (`data.categories`), no
  una lista fija en código.
- Préstamos, Gastos Fijos y Suscripciones se gestionan desde la web (alta, edición,
  baja y, en Préstamos, registro de cobros) con paridad total de esquema y efectos
  con el bot de WhatsApp. Antes eran de solo lectura; la app móvil todavía lo es.
- Soporte de USD en Ahorros/Deudas/Préstamos con cotización blue en vivo
  (`{BACKEND_URL}/api/dolar`).
- Vinculación de WhatsApp desde la web genera un código y abre `wa.me` con el mensaje
  `ORBE:<código>` listo para enviar.
- Publicada como PWA (GitHub Pages) — `manifest.json` fuerza `orientation: portrait`,
  heredado del diseño mobile-first original; revisar si sigue siendo apropiado al
  rediseñar para escritorio.

## Capabilities and Constraints

- Sin build step: single-file `index.html` con React vía CDN + Babel + Supabase.
- Navegación actual: bottom nav fijo (Inicio / Análisis / + / WhatsApp / Perfil) +
  paneles a pantalla completa con botón atrás para el resto (Ahorros, Deudas,
  Presupuesto, etc.) — patrón calcado de la app móvil, pensado explícitamente
  mobile-first.
- Contenido renderizado en una sola columna centrada con `maxWidth: 720px`, sin
  variantes de layout para pantallas grandes todavía.
- Modo oscuro descartado explícitamente por el dueño del proyecto — no implementar.

## Brand Commitments

- Nombre: "Orbe". Paleta confirmada: verde `#005247` (accent/primary), dorado
  `#C9A84C` (gold), fondo `#F2F7F5`, texto `#0D1F1C`.
- Tipografía actual: Nunito + DM Sans.
- Ícono actual: emoji de globo terráqueo (🌐 / `globe-with-meridians`), heredado de
  antes del rebranding — no confirmado como definitivo.

## Evidence on Hand

- Código fuente completo en `index.html` (única fuente de verdad visual hoy, no hay
  `DESIGN.md`).
- No hay cuenta de prueba disponible para QA end-to-end: se evita a propósito crear
  usuarios de prueba en la base de producción compartida con el bot.

## Product Principles

- Paridad de esquema con la app móvil y el bot es innegociable — un cambio que rompa
  esa paridad rompe la sincronización entre las tres superficies.
- Mobile-first no significa mobile-only: el layout debe extenderse a escritorio sin
  descartar los patrones de navegación que ya funcionan en el teléfono.
- No inventar datos ni estados de ejemplo: los paneles reflejan el estado real de
  `finanzas.data`, nunca placeholders a completar.
- Cualquier alta/edición desde la web (incluidos Préstamos, Gastos Fijos y
  Suscripciones) escribe exactamente los mismos campos y dispara los mismos efectos
  secundarios que el backend del bot, para no romper la interoperabilidad.
- Cambios visuales no deben tocar el esquema de datos ni la lógica de sincronización
  con Supabase.

## Accessibility & Inclusion

No se estableció un requisito de accesibilidad específico del producto más allá de
buenas prácticas estándar (contraste, tamaños táctiles).
