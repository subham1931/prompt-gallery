import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  getMe,
  getStoredToken,
  login as apiLogin,
  setStoredToken,
  signup as apiSignup,
} from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => getStoredToken())
  const [booting, setBooting] = useState(true)
  const [pendingAction, setPendingAction] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function boot() {
      const stored = getStoredToken()
      if (!stored) {
        if (!cancelled) {
          setBooting(false)
          setUser(null)
          setToken('')
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

  const openAuth = useCallback(
    (mode = 'signin', action = null) => {
      setPendingAction(() => action)
      const next = `${location.pathname}${location.search}`
      const params = new URLSearchParams()
      if (next && next !== '/signin' && next !== '/signup') {
        params.set('next', next)
      }
      const path = mode === 'signup' ? '/signup' : '/signin'
      const search = params.toString()
      navigate(search ? `${path}?${search}` : path)
    },
    [location.pathname, location.search, navigate],
  )

  const requireAuth = useCallback(
    (action) => {
      if (user) {
        action?.()
        return true
      }
      openAuth('signin', action)
      return false
    },
    [openAuth, user],
  )

  const applySession = useCallback((nextUser, nextToken) => {
    setStoredToken(nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const finishAuth = useCallback(
    (nextPath) => {
      const action = pendingAction
      setPendingAction(null)
      const target =
        nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/'
      navigate(target, { replace: true })
      if (typeof action === 'function') {
        queueMicrotask(() => action())
      }
    },
    [navigate, pendingAction],
  )

  const signIn = useCallback(
    async ({ email, password }, nextPath) => {
      const data = await apiLogin({ email, password })
      applySession(data.user, data.token)
      finishAuth(nextPath)
      return data.user
    },
    [applySession, finishAuth],
  )

  const signUp = useCallback(
    async ({ name, email, password }, nextPath) => {
      const data = await apiSignup({ name, email, password })
      applySession(data.user, data.token)
      finishAuth(nextPath)
      return data.user
    },
    [applySession, finishAuth],
  )

  const signOut = useCallback(() => {
    setStoredToken('')
    setToken('')
    setUser(null)
    setPendingAction(null)
    navigate('/')
  }, [navigate])

  const updateUser = useCallback((nextUser) => {
    setUser(nextUser)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      booting,
      isAuthenticated: Boolean(user),
      openAuth,
      requireAuth,
      signIn,
      signUp,
      signOut,
      updateUser,
    }),
    [booting, openAuth, requireAuth, signIn, signOut, signUp, token, updateUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
