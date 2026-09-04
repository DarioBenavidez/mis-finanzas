# Orbe — versión web

Página HTML servida como un solo archivo (React vía CDN + Supabase), versión web/PWA de
[Orbe](https://github.com/DarioBenavidez/orbe). Apunta al **mismo** proyecto de Supabase
que usan la app móvil (Expo) y el bot de WhatsApp — tabla `finanzas`, columna jsonb
`data` — así que todo lo que se guarda acá es visible al instante en la app y para el
bot, y viceversa.

## Desarrollo

- **`index.src.html`** es la fuente que se edita (JSX en un `<script type="text/babel">`).
- **`npm run build`** (esbuild) transpila el JSX y escribe **`index.html`** — sin
  `@babel/standalone` en runtime. `npm run dev` buildea y levanta un server local.
- En cada push que toque `index.src.html`, `.github/workflows/build.yml` regenera
  `index.html` y lo commitea; GitHub Pages sirve la raíz del repo como antes.
- No editar `index.html` a mano — se sobrescribe en cada build.

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
- Instalado el skill de diseño [Impeccable](https://impeccable.style) (`.claude/skills/impeccable`).
- **Rediseño del layout de escritorio** (vía `/impeccable init` + pedido de rediseño):
  desde 1024px de ancho, el bottom nav se reemplaza por un sidebar persistente (marca,
  "+ Nueva transacción", Inicio/Análisis, acceso directo a los 9 paneles de "Planificar",
  WhatsApp, Perfil). El contenido deja de estar limitado a una columna de 720px: Inicio
  pasa a un dashboard de 2 columnas (balance/presupuesto/transacciones a la izquierda,
  grilla de paneles + próximos turnos/vencimientos como rail a la derecha) y
  Análisis/Perfil quedan centrados en una columna de lectura cómoda. Los paneles
  (Ahorros, Deudas, etc.) dejan de tomar toda la pantalla en escritorio: se abren como
  card centrado con fondo atenuado, cerrable haciendo click afuera. Mobile (<1024px)
  queda exactamente igual que antes — mismo bottom nav, misma columna única, mismos
  paneles a pantalla completa. Verificado en Chrome a 390px, 800px y 1440px con datos
  mock locales (sin tocar Supabase); documentado el contexto de producto en
  `PRODUCT.md` para las próximas sesiones de Impeccable.

Verificado con esbuild (sintaxis) y carga en Chrome sin errores de consola. **No se probó
el flujo logueado completo con una cuenta real** — se evitó a propósito para no crear un
usuario de prueba en la base de producción que comparte con el bot.

## Auditoría de paridad de features (2026-07-31)

Se comparó panel por panel y pantalla por pantalla contra la app real
(`~/Documents/ORBE - PROYECTO/frontend`) para asegurar que la web tenga las mismas
funciones. Bugs y gaps encontrados y corregidos:

- **Préstamos en USD sin pagos mostraban "NaN"**: un préstamo/fiado en USD recién creado
  por el bot no tiene `remainingUSD` hasta el primer pago parcial (el backend solo lo
  agrega ahí). La web no tenía fallback a `amountUSD` y mostraba "USD NaN" y "NaN%
  cobrado" hasta el primer pago. Corregido con el mismo fallback que ya usaba la app real.
- **"Saldo a favor" en Préstamos** no filtraba por `amount > 0`, podía listar personas con
  saldo en $0. Corregido.
- **Turnos y Calendario no tenían "Editar"**: solo se podía agregar o eliminar, a
  diferencia de la app real. Agregado editar en ambos paneles.
- **Sin forma de editar una transacción existente**: la app real permite tocar cualquier
  movimiento para corregirlo (monto, categoría, fecha, tipo); la web solo permitía
  agregar o borrar. Agregado un formulario de edición inline tanto en la lista de
  Inicio como en el panel de Transacciones.
- **Modal de WhatsApp ya vinculado**: solo tenía botón "Listo". Agregados "Hablar con
  Orbe" (abre el chat directo) y "Cambiar número", igual que la app real.

Verificado con esbuild (sintaxis) y visualmente en Chrome headless a 500px (mobile),
800px y 1440px (desktop) con la técnica de copia+mock (ver memoria del proyecto) —
sin errores de consola ni fallos visuales en los paneles tocados.

## Préstamos, Gastos Fijos y Suscripciones editables desde la web (2026-09-02)

Los tres paneles que eran de solo lectura ("pedíselo al bot de WhatsApp") ahora se
gestionan desde la web, con **paridad total de esquema y de efectos** con el backend
del bot (`~/Documents/ORBE - PROYECTO/backend/actions/index.js`):

- **Gastos Fijos** (`data.recurringExpenses`): alta / edición / baja. La baja es soft
  (`active:false`), igual que `eliminar_gasto_fijo`. El alta no genera transacción
  (igual que `agregar_gasto_fijo`).
- **Suscripciones** (`data.suscripciones`): alta / edición / baja replicando
  `agregar_suscripcion` — crea y mantiene sincronizado el gasto fijo "espejo" en
  `recurringExpenses`, y registra el gasto del mes actual (checkbox, on por defecto).
  El alta con un nombre ya existente actualiza en vez de duplicar. La baja desactiva
  suscripción y espejo.
- **Préstamos / Fiados** (`data.loans` + `data.credits`): alta de préstamo (genera
  transacción de gasto categoría `Préstamos` con `loanId`, descuenta saldo a favor
  previo) y de fiado (sin transacción); **registro de cobros** por persona con reparto
  FIFO entre los préstamos activos (transacción de ingreso por lo aplicado, el
  excedente va a `credits`); edición de cada registro (no toca `payments`); borrado; y
  poner en cero un saldo a favor. Soporta USD con la cotización blue en vivo.

Sin cambios de esquema: la web solo escribe los mismos campos que ya escribe el bot,
así un registro creado desde la web es indistinguible para la app móvil y el bot.

Verificado con esbuild (sintaxis) + 45 asserts sobre las transformaciones de datos de
los tres paneles con `react-test-renderer` (shape exacto vs. esquema del bot,
efectos secundarios, FIFO, saldo a favor, USD) y visualmente en Chrome con la técnica
copia+mock a 390 / 800 / 1440px. No se probó con cuenta real.

## Pendiente

- Probar el flujo logueado completo (login, cada panel, vinculación de WhatsApp) con una
  cuenta real.
- Confirmar visualmente en un dispositivo real la grilla de paneles y el modal de
  WhatsApp — no se pudo hacer un test end-to-end sin cuenta.
- Modo oscuro: descartado explícitamente por el dueño del proyecto, no implementar.
- Gaps menores no corregidos por alcance/riesgo, para una próxima sesión si se quiere ir
  a paridad total: el formulario de "+ Nueva transacción" del panel Transacciones no
  ofrece el tipo "Ahorro" con selector de meta (sí existe como flujo separado en el panel
  Ahorros); no se agregó categoría nueva inline desde ese mismo formulario.

## Dónde vive todo

- App real (Expo + backend): `~/Documents/ORBE - PROYECTO` — repo privado
  `DarioBenavidez/orbe`.
- Esta página: `~/Projects/mis-finanzas` — repo `DarioBenavidez/mis-finanzas`, publicada
  en GitHub Pages.
- Notas del proyecto en Obsidian: `~/Documents/Orbe - Notas` (vault separado, no mezclar
  con el de Mil Impresiones).
