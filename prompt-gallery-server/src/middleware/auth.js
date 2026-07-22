import { User } from '../models/User.js'
import { verifyToken } from '../utils/jwt.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) {
      res.status(401).json({ error: 'Sign in required' })
      return
    }

    let payload
    try {
      payload = verifyToken(token)
    } catch {
      res.status(401).json({ error: 'Session expired. Please sign in again.' })
      return
    }

    const user = await User.findById(payload.sub)
    if (!user) {
      res.status(401).json({ error: 'Account not found' })
      return
    }

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')
    if (scheme === 'Bearer' && token) {
      try {
        const payload = verifyToken(token)
        const user = await User.findById(payload.sub)
        if (user) req.user = user
      } catch {
        /* ignore invalid token for optional auth */
      }
    }
    next()
  } catch (err) {
    next(err)
  }
}

export function requireRole(...roles) {
  const allowed = roles.flat()
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: 'Sign in required' })
      return
    }
    if (!allowed.includes(req.user.role)) {
      res.status(403).json({ error: 'You do not have permission for this action' })
      return
    }
    next()
  }
}

export const requireStaff = [requireAuth, requireRole('admin', 'superadmin')]
export const requireSuperadmin = [requireAuth, requireRole('superadmin')]
