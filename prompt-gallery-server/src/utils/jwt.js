import jwt from 'jsonwebtoken'

const DEFAULT_EXPIRES = '7d'

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }
  return secret
}

export function signToken(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email, name: user.name },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRES },
  )
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret())
}
