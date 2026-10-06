const VERSION = 'v3'
const CACHE_ESTATICA = `huellitas-estatica-${VERSION}`
const CACHE_DINAMICA = `huellitas-dinamica-${VERSION}`

const ARCHIVOS_BASE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE_ESTATICA)
      .then((cache) => cache.addAll(ARCHIVOS_BASE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nombres) =>
        Promise.all(
          nombres
            .filter((nombre) => nombre.startsWith('huellitas-') && nombre !== CACHE_ESTATICA && nombre !== CACHE_DINAMICA)
            .map((nombre) => caches.delete(nombre))
        )
      )
      .then(() => self.clients.claim())
  )
})

function guardarEnCache(peticion, respuesta) {
  const copia = respuesta.clone()
  caches.open(CACHE_DINAMICA).then((cache) => cache.put(peticion, copia))
}

self.addEventListener('fetch', (evento) => {
  const { request: peticion } = evento
  if (peticion.method !== 'GET') return

  const direccion = new URL(peticion.url)

  if (!direccion.protocol.startsWith('http')) return
  if (direccion.pathname.startsWith('/api')) return
  if (direccion.pathname.startsWith('/@') || direccion.pathname.includes('node_modules')) return

  if (peticion.mode === 'navigate') {
    evento.respondWith(
      fetch(peticion)
        .then((respuesta) => {
          if (respuesta.ok) guardarEnCache('/index.html', respuesta)
          return respuesta
        })
        .catch(async () => (await caches.match('/index.html')) || caches.match('/offline.html'))
    )
    return
  }

  const esRecursoVisual =
    peticion.destination === 'image' || peticion.destination === 'font' || direccion.hostname.includes('fonts.g')

  if (esRecursoVisual) {
    evento.respondWith(
      caches.match(peticion).then(
        (enCache) =>
          enCache ||
          fetch(peticion).then((respuesta) => {
            if (respuesta.ok || respuesta.type === 'opaque') guardarEnCache(peticion, respuesta)
            return respuesta
          })
      )
    )
    return
  }

  if (direccion.origin === self.location.origin) {
    evento.respondWith(
      caches.match(peticion).then((enCache) => {
        const desdeRed = fetch(peticion)
          .then((respuesta) => {
            if (respuesta.ok) guardarEnCache(peticion, respuesta)
            return respuesta
          })
          .catch(() => enCache)
        return enCache || desdeRed
      })
    )
  }
})
