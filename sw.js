// Bump este número en cada deploy que cambie la lógica del SW o cuando haya que
// invalidar caches viejos. `activate` borra todo lo que no sea este CACHE.
const CACHE = "mis-finanzas-v4";
const ASSETS = [
  "/",
  "/index.html",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
  "https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js",
  "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap"
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // Guardar cada asset por separado: si uno falla (404, red caída) no se
    // aborta el precache entero, y nunca se guarda una respuesta con error.
    await Promise.allSettled(ASSETS.map(async url => {
      try {
        const res = await fetch(url, { cache: "no-cache" });
        if (res && res.ok) await c.put(url, res.clone());
      } catch (_) {}
    }));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Solo se cachean respuestas 2xx reales. Nunca un 404/500 ni una respuesta
// opaca de error — eso era lo que dejaba la página "rota" pegada tras una caída
// del hosting aunque el sitio ya hubiera vuelto.
function isCacheable(res) {
  return res && res.ok && (res.type === "basic" || res.type === "cors");
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  e.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (isCacheable(res)) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
      }
      return res;
    } catch (_) {
      // Sin red: servir de cache si lo tenemos.
      const cached = await caches.match(req);
      if (cached) return cached;
      // Para navegaciones, caer al index cacheado como último recurso.
      if (req.mode === "navigate") {
        const shell = await caches.match("/index.html") || await caches.match("/");
        if (shell) return shell;
      }
      return Response.error();
    }
  })());
});
