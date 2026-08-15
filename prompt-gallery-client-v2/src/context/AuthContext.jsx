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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('signin')

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
      setAuthModalMode(mode)
      setIsAuthModalOpen(true)
    },
    [],
  )

  const closeAuth = useCallback(() => {
    setIsAuthModalOpen(false)
  }, [])

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

  const finishAuth = useCallback(() => {
    const action = pendingAction
    setPendingAction(null)
    setIsAuthModalOpen(false)
    if (typeof action === 'function') {
      queueMicrotask(() => action())
    }
  }, [pendingAction])

  const signIn = useCallback(
    async ({ email, password }, nextPath) => {
      const data = await apiLogin({ email, password })
      applySession(data.user, data.token)
      finishAuth()
      return data.user
    },
    [applySession, finishAuth],
  )

  const signUp = useCallback(
    async ({ name, email, password }, nextPath) => {
      const data = await apiSignup({ name, email, password })
      applySession(data.user, data.token)
      finishAuth()
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
      isAuthModalOpen,
      authModalMode,
      openAuth,
      closeAuth,
      requireAuth,
      signIn,
      signUp,
      signOut,
      updateUser,
    }),
    [
      booting,
      isAuthModalOpen,
      authModalMode,
      openAuth,
      closeAuth,
      requireAuth,
      signIn,
      signOut,
      signUp,
      token,
      updateUser,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
