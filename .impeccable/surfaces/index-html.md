---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief — Orbe web app (post-login)

Scope: toda la app autenticada de `index.html` (shell, navegación, home, y cómo se
entra a cada panel). Modo: Operate. Usuarios existentes de Orbe con datos reales en
producción, compartidos con la app móvil y el bot.

## Direction contract

THESIS: Orbe abre como un **estado de cuenta**, no como un tablero. Un solo número —lo
que tenés menos lo que debés, y su variación contra el mes pasado— y debajo las tres
fuerzas que lo mueven (entra/sale, tenés, debés), cada línea abrible. Rechaza la grilla
de accesos con ícono+emoji y el hero-métrica suelto sobre stats.

OWN-WORLD: Paleta y tipografía actuales de Orbe intactas (verde #005247, oro
#C9A84C/#E8C97A, menta #E9F6F0/#E4F1EB, tinta #0D1F1C; Nunito display, DM Sans UI).
Íconos: set de line-icons dibujados, un solo stroke (1.7), sin emojis ni monogramas de
letra. Tarjetas blancas de borde fino sobre menta; el bloque "posición" en gradiente
verde. Números tabulares.

STORY: El usuario abre y entiende en un vistazo si está construyendo o perdiendo
terreno este mes. Cada fuerza se abre a su detalle; la navegación es un índice de
estado, no una grilla.

FIRST VIEWPORT: Bloque "posición" en verde arriba (kicker "Tu posición · <mes>",
número grande tabular, línea de variación vs. mes anterior). Debajo, 3 tarjetas-fuerza
apiladas: Entra y sale (neto del mes + ingresos/gastos), Tenés (ahorros/metas), Debés
(deudas + fijos por pagar). Desktop: rail izquierdo fino (Estado / Movimientos /
Ahorros / Deudas / Agenda / Análisis / Perfil) + 2 columnas (estado | panel contextual
con movimientos recientes). Mobile: header con la posición + tab bar de 4 (Estado /
Movimientos / Agenda / Análisis); "+" de carga flotante; el resto por lista dentro de
Estado. La acción primaria "Cargar movimiento" arriba a la derecha (desktop) / FAB
(mobile).

FORM: estructura "estado de cuenta / posición financiera" — candidata #5 de mi lista
de 7, elegida por el usuario tras ver los 3 modelos del sorteo. Seed key:
`b74f7a0f` (concept-seed --scope surface, dealt 5/3/4).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
