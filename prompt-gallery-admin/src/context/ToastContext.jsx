import { createContext, useContext, useState, useCallback } from 'react'
import { Toast } from '../components/ui/Toast'

const ToastContext = createContext({
  toasts: [],
  pushToast: () => {},
  toast: () => {},
  dismissToast: () => {},
})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushToast = useCallback((msg, type = 'success', title = '') => {
    const id = Date.now() + Math.random()
    const item = typeof msg === 'object' ? { id, ...msg } : { id, msg, type, title }
    setToasts((prev) => [...prev, item])
    const ttl = item.type === 'error' || item.variant === 'destructive' ? 4500 : 3000
    setTimeout(() => {
      dismissToast(id)
    }, ttl)
  }, [dismissToast])

  const toast = useCallback(
    (opts) => {
      if (typeof opts === 'string') {
        pushToast(opts)
      } else {
        pushToast(opts)
      }
    },
    [pushToast]
  )

  toast.success = (msg, title = 'Success') => pushToast(msg, 'success', title)
  toast.error = (msg, title = 'Error') => pushToast(msg, 'error', title)
  toast.info = (msg, title = 'Info') => pushToast(msg, 'info', title)

  return (
    <ToastContext.Provider value={{ toasts, pushToast, toast, dismissToast }}>
      {children}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
