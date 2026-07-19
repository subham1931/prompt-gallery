import cors from 'cors'

function parseOrigins(...values) {
  return values
    .flatMap((value) => String(value || '').split(','))
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)
}

/** Vercel production + preview URLs for this project's apps */
function isVercelAppOrigin(origin) {
  return /^https:\/\/prompt-gallery-(admin|client)[\w-]*\.vercel\.app$/i.test(origin)
}

export function createCorsMiddleware() {
  const allowed = new Set(
    parseOrigins(
      process.env.CLIENT_ORIGIN,
      process.env.ADMIN_ORIGIN,
      'http://localhost:5173',
      'http://localhost:5174',
    ),
  )

  return cors({
    origin(origin, callback) {
      const normalized = origin?.replace(/\/$/, '') || ''
      // Allow non-browser tools (curl, Render health checks) with no Origin
      if (!origin || allowed.has(normalized) || isVercelAppOrigin(normalized)) {
        callback(null, true)
        return
      }
      callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  })
}
