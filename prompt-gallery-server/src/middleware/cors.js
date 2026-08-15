import cors from 'cors'

export function createCorsMiddleware() {
  return cors({
    origin: true, // Dynamically reflect request origin for 100% CORS compatibility
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200,
  })
}
