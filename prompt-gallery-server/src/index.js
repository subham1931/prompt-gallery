import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDb } from './config/db.js'
import { createCorsMiddleware } from './middleware/cors.js'
import { configureCloudinary } from './utils/cloudinary.js'
import { UPLOADS_DIR } from './utils/localUpload.js'
import authRouter from './routes/auth.js'
import promptsRouter from './routes/prompts.js'
import categoriesRouter from './routes/categories.js'
import uploadRouter from './routes/upload.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 4000

configureCloudinary()

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(createCorsMiddleware())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(UPLOADS_DIR))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'prompt-gallery-server' })
})

app.use('/api/auth', authRouter)
app.use('/api/prompts', promptsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/upload', uploadRouter)

app.use((err, _req, res, _next) => {
  console.error(err)
  const message =
    typeof err?.message === 'string'
      ? err.message
      : err?.error?.message || 'Server error'
  const status = String(message).includes('CORS') ? 403 : 500
  res.status(status).json({
    error: typeof message === 'string' ? message : 'Server error',
  })
})

async function start() {
  await connectDb(process.env.MONGODB_URI)

  // Ensure default categories exist (idempotent)
  try {
    const { seedCategoriesIfEmpty } = await import('./scripts/ensureCategories.js')
    await seedCategoriesIfEmpty()
  } catch (err) {
    console.warn('Category seed skipped:', err.message)
  }

  app.listen(PORT, () => {
    console.log(`API listening on :${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server', err)
  process.exit(1)
})
