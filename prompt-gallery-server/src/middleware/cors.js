import cors from 'cors'

export function createCorsMiddleware() {
  const allowed = [
    process.env.CLIENT_ORIGIN,
    process.env.ADMIN_ORIGIN,
    'http://localhost:5173',
    'http://localhost:5174',
  ].filter(Boolean)

  return cors({
    origin(origin, callback) {
      // Allow non-browser tools (curl, Render health checks) with no Origin
      if (!origin || allowed.includes(origin)) {
        callback(null, true)
        return
      }
      callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  })
}
