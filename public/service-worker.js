// Service Worker for Progressive Web App support

const CACHE_NAME = "naijaspark-quiz-v1"
const OFFLINE_URL = "/offline"

// Assets to cache
const ASSETS_TO_CACHE = [
  "/",
  "/offline",
  "/favicon.ico",
  "/manifest.json",
  "/app/globals.css",
  // Add other important assets here
]

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        return cache.addAll(ASSETS_TO_CACHE)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip browser extensions and chrome-extension requests
  if (event.request.url.startsWith("chrome-extension://")) return

  // Handle API requests differently
  if (event.request.url.includes("/api/")) {
    handleApiRequest(event)
    return
  }

  // Handle regular requests
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache the response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If fetch fails (offline), show offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL)
          }

          // For image requests, return a placeholder
          if (event.request.destination === "image") {
            return caches.match("/placeholder.svg")
          }

          // For other requests, just return a simple error response
          return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          })
        })
    }),
  )
})

// Handle API requests
function handleApiRequest(event) {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response
      })
      .catch(() => {
        // If API request fails, check if we have cached data
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          // If no cached data, return error
          return new Response(JSON.stringify({ error: "You are offline" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          })
        })
      }),
  )
}

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

