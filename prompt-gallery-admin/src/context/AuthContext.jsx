import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, getStoredToken, login as apiLogin, setStoredToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => getStoredToken())
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function boot() {
      const stored = getStoredToken()
      if (!stored) {
        if (!cancelled) {
          setUser(null)
          setToken('')
          setBooting(false)
        }
        return
      }
      try {
        const me = await getMe(stored)
        if (!cancelled) {
          setUser(me)
          setToken(stored)
        }
      } catch {
        setStoredToken('')
        if (!cancelled) {
          setUser(null)
          setToken('')
        }
      } finally {
        if (!cancelled) setBooting(false)
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const data = await apiLogin({ email, password })
    const nextUser = data.user
    if (nextUser.role !== 'admin' && nextUser.role !== 'superadmin') {
      setStoredToken('')
      throw new Error('This account does not have admin access')
    }
    setStoredToken(data.token)
    setToken(data.token)
    setUser(nextUser)
    return nextUser
  }, [])

  const signOut = useCallback(() => {
    setStoredToken('')
    setToken('')
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  const value = useMemo(
    () => ({
      user,
      token,
      booting,
      isAuthenticated: Boolean(user),
      isStaff: user?.role === 'admin' || user?.role === 'superadmin',
      isSuperadmin: user?.role === 'superadmin',
      signIn,
      signOut,
    }),
    [booting, signIn, signOut, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
