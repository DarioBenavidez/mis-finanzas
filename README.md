# Orbe — versión web

Página single-file (React vía CDN + Babel + Supabase, sin build step) que sirve como
versión web/PWA de [Orbe](https://github.com/DarioBenavidez/orbe). Apunta al **mismo**
proyecto de Supabase que usan la app móvil (Expo) y el bot de WhatsApp — tabla `finanzas`,
columna jsonb `data` — así que todo lo que se guarda acá es visible al instante en la app
y para el bot, y viceversa.

## Hecho (2026-07-30)

- **Rebranding completo a "Orbe"**: nombre, paleta (`#005247` / `#C9A84C`), manifest.json,
  service worker.
- **Paridad de esquema con la app real**, para que los datos interoperen bien:
  - Categorías dinámicas y editables (`data.categories`) en vez de una lista fija.
  - Corregido el campo de meta de ahorro (`goal` → `target`), que no coincidía con lo que
    usa el bot/app.
  - Pagar una deuda ahora genera la transacción de gasto correspondiente.
- **Paneles nuevos** que faltaban respecto a la app: Préstamos, Gastos Fijos,
  Suscripciones, Turnos, Calendario. Préstamos/Gastos Fijos/Suscripciones son de solo
  lectura con aviso de "pedíselo al bot de WhatsApp" — así es como está diseñada también
  la app real, no es una limitación de la web.
- Soporte USD en Ahorros/Deudas/Préstamos con cotización blue en vivo
  (`{BACKEND_URL}/api/dolar`).
- Proyección: ahora suma gastos fijos (antes solo presupuesto) y admite ajustes de sueldo
  futuro (`salaryOverrides`).
- Registro pide nombre/apellido y exige contraseña más fuerte (igual que la app).
- **Vinculación de WhatsApp desde la web** (genera código, abre `wa.me` con el mensaje
  `ORBE:<código>` listo). El backend tiene `ALLOWED_ORIGIN` vacío → CORS cae al comodín
  `*`, así que funciona sin cambios en el backend.
- **Reestructuración completa de navegación** para que sea igual a la app: bottom nav fijo
  (Inicio / Análisis / + / WhatsApp / Perfil) en vez del sidebar con 11 tabs de antes. Cada
  panel (Ahorros, Deudas, Presupuesto, etc.) se abre como pantalla completa con botón
  atrás, no como tab persistente. Pensada mobile-first, igual que la app.
- Instalado el skill de diseño [Impeccable](https://impeccable.style) (`.claude/skills/impeccable`)
  para el trabajo pendiente de abajo.

Verificado con esbuild (sintaxis) y carga en Chrome sin errores de consola. **No se probó
el flujo logueado completo con una cuenta real** — se evitó a propósito para no crear un
usuario de prueba en la base de producción que comparte con el bot.

## Pendiente

- **Rediseño del layout de escritorio.** La reestructuración de navegación quedó pensada
  para mobile (bottom nav + columna centrada angosta); en pantallas grandes se ve mal.
  Para retomarlo: abrir una sesión de Claude Code con working directory en este repo,
  correr `/impeccable init` una vez, y después pedir el rediseño de escritorio.
- Probar el flujo logueado completo (login, cada panel, vinculación de WhatsApp) con una
  cuenta real.
- Confirmar visualmente en un dispositivo real la grilla de paneles y el modal de
  WhatsApp — no se pudo hacer un test end-to-end sin cuenta.
- Modo oscuro: descartado explícitamente por el dueño del proyecto, no implementar.

## Dónde vive todo

- App real (Expo + backend): `~/Documents/ORBE - PROYECTO` — repo privado
  `DarioBenavidez/orbe`.
- Esta página: `~/Projects/mis-finanzas` — repo `DarioBenavidez/mis-finanzas`, publicada
  en GitHub Pages.
- Notas del proyecto en Obsidian: `~/Documents/Orbe - Notas` (vault separado, no mezclar
  con el de Mil Impresiones).
