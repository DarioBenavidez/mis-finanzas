// Build de la web de Orbe. Fuente editable: index.src.html (con
// <script type="text/babel"> y el CDN de @babel/standalone). Este script:
//   1. saca el <script> de @babel/standalone (2.9 MB que se parseaban en cada carga)
//   2. transpila el <script type="text/babel"> a JS plano con esbuild (JSX clásico)
//   3. escribe index.html listo para servir (GitHub Pages sirve la raíz del repo)
// Correr: `npm run build`. En CI lo hace .github/workflows/build.yml en cada push
// que toque index.src.html.
import { readFileSync, writeFileSync } from "node:fs";
import { transformSync } from "esbuild";

const SRC = "index.src.html";
const OUT = "index.html";

const html = readFileSync(SRC, "utf8");

// 1. sacar el <script> de @babel/standalone (con o sin versión pinneada)
let out = html.replace(
  /[ \t]*<script src="https:\/\/[^"]*@babel\/standalone[^"]*"><\/script>\n?/,
  ""
);
if (out === html) throw new Error("no encontré el <script> de @babel/standalone en " + SRC);

// 2. transpilar el único <script type="text/babel">…</script>
const re = /<script type="text\/babel">([\s\S]*?)<\/script>/;
const m = out.match(re);
if (!m) throw new Error('no encontré <script type="text/babel"> en ' + SRC);

const { code, warnings } = transformSync(m[1], {
  loader: "jsx",
  jsx: "transform",            // runtime clásico: React.createElement / React.Fragment (globales del UMD)
  target: "es2020",
  minify: true,
  legalComments: "none",
  sourcemap: false,
});
for (const w of warnings) console.warn("esbuild:", w.text);

// 3. re-inyectar como <script> plano. Escapar cualquier "</script>" que
//    hubiera quedado dentro de un string del bundle (rompería el inline).
const safe = code.replace(/<\/script>/gi, "<\\/script>");
out = out.replace(re, `<script>\n${safe}\n</script>`);

writeFileSync(OUT, out);

const kb = (n) => Math.round(n / 1024) + " KB";
console.log(`${OUT} escrito — ${kb(out.length)} (fuente ${kb(html.length)}); JSX transpilado: ${kb(m[1].length)} → ${kb(code.length)} minificado; babel.min.js fuera.`);
