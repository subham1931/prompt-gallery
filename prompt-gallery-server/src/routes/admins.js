import { Router } from 'express'
import { User } from '../models/User.js'
import { requireSuperadmin } from '../middleware/auth.js'
import { getErrorMessage } from '../utils/errors.js'

const router = Router()

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function validateAdminPayload({ name, email, password }, { requirePassword = true } = {}) {
  const errors = []
  const cleanEmail = normalizeEmail(email)
  const cleanPassword = String(password || '')
  const cleanName = String(name || '').trim()

  if (cleanName.length < 2) errors.push('Name must be at least 2 characters')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) errors.push('Enter a valid email')
  if (requirePassword && cleanPassword.length < 6) {
    errors.push('Password must be at least 6 characters')
  }

  return {
    ok: errors.length === 0,
    error: errors[0] || '',
    name: cleanName,
    email: cleanEmail,
    password: cleanPassword,
  }
}

/** GET /api/admins — list admin + superadmin accounts */
router.get('/', ...requireSuperadmin, async (_req, res) => {
  try {
    const users = await User.find({ role: { $in: ['admin', 'superadmin'] } })
      .sort({ role: -1, createdAt: -1 })
      .exec()
    res.json({ data: users.map((u) => u.toPublicJSON()) })
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err, 'Failed to list admins') })
  }
})

/** POST /api/admins — create an admin (never superadmin via API) */
router.post('/', ...requireSuperadmin, async (req, res) => {
  try {
    const parsed = validateAdminPayload(req.body || {})
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error })
      return
    }

    const existing = await User.findOne({ email: parsed.email })
    if (existing) {
      if (existing.role === 'admin' || existing.role === 'superadmin') {
        res.status(409).json({ error: 'An admin with this email already exists' })
        return
      }
      // Elevate existing gallery user to admin
      existing.name = parsed.name
      existing.role = 'admin'
      existing.passwordHash = await User.hashPassword(parsed.password)
      await existing.save()
      res.status(200).json({ data: existing.toPublicJSON() })
      return
    }

    const passwordHash = await User.hashPassword(parsed.password)
    const user = await User.create({
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: 'admin',
    })

    res.status(201).json({ data: user.toPublicJSON() })
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err, 'Failed to create admin') })
  }
})

/** PATCH /api/admins/:id — demote admin → user (cannot target self or superadmin) */
router.patch('/:id', ...requireSuperadmin, async (req, res) => {
  try {
    const target = await User.findById(req.params.id)
    if (!target) {
      res.status(404).json({ error: 'Admin not found' })
      return
    }

    if (String(target._id) === String(req.user._id)) {
      res.status(400).json({ error: 'You cannot change your own role' })
      return
    }

    if (target.role === 'superadmin') {
      res.status(403).json({ error: 'Cannot modify a superadmin account' })
      return
    }

    if (target.role !== 'admin') {
      res.status(400).json({ error: 'Only admin accounts can be demoted here' })
      return
    }

    const nextRole = String(req.body?.role || 'user').toLowerCase()
    if (nextRole !== 'user') {
      res.status(400).json({ error: 'Only demotion to user is allowed' })
      return
    }

    target.role = 'user'
    await target.save()
    res.json({ data: target.toPublicJSON() })
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err, 'Failed to update admin') })
  }
})

export default router
