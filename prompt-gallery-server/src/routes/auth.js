import { Router } from 'express'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { signToken } from '../utils/jwt.js'
import { getErrorMessage } from '../utils/errors.js'

const router = Router()

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function validateCredentials({ name, email, password }, { requireName = false } = {}) {
  const errors = []
  const cleanEmail = normalizeEmail(email)
  const cleanPassword = String(password || '')
  const cleanName = String(name || '').trim()

  if (requireName && cleanName.length < 2) errors.push('Name must be at least 2 characters')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) errors.push('Enter a valid email')
  if (cleanPassword.length < 6) errors.push('Password must be at least 6 characters')

  return {
    ok: errors.length === 0,
    error: errors[0] || '',
    name: cleanName,
    email: cleanEmail,
    password: cleanPassword,
  }
}

router.post('/signup', async (req, res) => {
  try {
    const parsed = validateCredentials(req.body || {}, { requireName: true })
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error })
      return
    }

    const existing = await User.findOne({ email: parsed.email })
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' })
      return
    }

    const passwordHash = await User.hashPassword(parsed.password)
    const user = await User.create({
      name: parsed.name,
      email: parsed.email,
      passwordHash,
    })

    const token = signToken(user)
    res.status(201).json({ data: { user: user.toPublicJSON(), token } })
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err, 'Signup failed') })
  }
})

router.post('/login', async (req, res) => {
  try {
    const parsed = validateCredentials(req.body || {})
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error })
      return
    }

    const user = await User.findOne({ email: parsed.email }).select('+passwordHash')
    if (!user || !(await user.verifyPassword(parsed.password))) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const token = signToken(user)
    res.json({ data: { user: user.toPublicJSON(), token } })
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err, 'Login failed') })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  res.json({ data: { user: req.user.toPublicJSON() } })
})

export default router
