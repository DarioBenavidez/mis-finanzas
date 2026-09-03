---
target: orbefinanzas.online escritorio (index.html / BocetoLayout)
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/dario.b/Projects/mis-finanzas/index.html (desktop / orbefinanzas.online)"
timestamp: 2026-09-03T18-41-52Z
slug: index-html-desktop-orbefinanzas-online
---
# Diagnóstico — orbefinanzas.online (escritorio)

DEGRADED: single-context. Assessment A + B en secuencia, mismo contexto, sin subagentes. Detector en modo regex (faltan htmlparser2/css-tree) → hallazgos son piso.

Target: index.html (BocetoLayout) en vivo, cuenta real, solo lectura. Mobile evaluado por código. Modo: Operate.

## Design Health Score: 25/40 — Aceptable

| # | Heurística | Score | Problema |
|---|---|---|---|
| 1 | Visibilidad estado | 3 | mes visible no se refleja en paneles |
| 2 | Mundo real | 3 | OK |
| 3 | Control/libertad | 3 | deshacer, atrás, cancelar OK |
| 4 | Consistencia | 2 | dos shells desktop; densidad dispareja |
| 5 | Prevención errores | 3 | OK |
| 6 | Reconocer vs recordar | 2 | nav plana 13 ítems, scrollea, sin agrupar |
| 7 | Flexibilidad/eficiencia | 2 | sin atajos, sin bulk, fecha por dropdown |
| 8 | Estética/minimalista | 2 | lienzo vacío, cards gigantes 1 valor, gráfico invisible, glow |
| 9 | Recuperación errores | 3 | buenos error boundaries |
| 10 | Ayuda/docs | 2 | sin ayuda contextual para 13 secciones |

Especificidad: media. Paleta/concepto boceto tienen carácter; el layout desktop es genérico.

## Funciona
- Paleta verde/dorado sobre menta, cálida.
- Idea BocetoLayout: 2 columnas scroll independiente.
- Copy de errores/estados.

## Prioritarios
- [P1] Desktop desperdicia 60-70% de pantalla. Panel con 2 filas + 500px vacío; cards de 180px para 1 número; gráfico barras 2px. Se lee roto. Fix: grilla dashboard real (fila KPIs + 2-3 col widgets), alto por contenido, barras que escalen. -> /impeccable layout
- [P1] Nav = muro de 13 opciones planas, todas mismo peso, scrollea. Fix: 3 grupos con encabezado (Dinero / Planificación / Cuenta), primarios fijos, Cmd+K. -> /impeccable layout + shape
- [P1] Balance (número héroe) chico y al costado en columna de 316px con 13 links. Fix: subirlo a franja superior o card ancho dominante del panel principal, con delta vs mes anterior. -> /impeccable layout
- [P2] "Movimientos" como inicio es un log, no resumen. Fix: sección inicial = overview con widgets. -> /impeccable shape
- [P2] Inconsistencia densidad + dos shells desktop (boceto vs sidebar+content-area 1160). Fix: escala tipográfica/espaciado única (tokens), un shell. -> /impeccable typeset + extract

## Detector
3x layout-transition (index.html:735,4040,4046 animan width) · 1x dark-glow (index.html:256 halo #00291f en card balance) · 1x side-tab (privacy.html:52 borde 3px dorado).

## Personas
- Alex: sin atajos teclado, sin bulk edit en Movimientos, meses por dropdown.
- Jordan: 13 secciones sin agrupar/explicar ("Turnos" no es obvio), sin ayuda post-onboarding.
- Sam: gráfico 6 meses solo color + barras invisibles; KPIs gigantes = mucho scroll con zoom 200%.

## Menores
- Saludo "Dario Benvidez" (¿falta una a?).
- Sombra derecha card balance parece artefacto.
- "Nueva carga" siempre arriba-derecha, lejos del foco.
- manifest.json orientation: portrait heredado de mobile.
