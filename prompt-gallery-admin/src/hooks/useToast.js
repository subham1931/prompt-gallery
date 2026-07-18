import { useCallback, useState } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, msg, type }])
    const ttl = type === 'error' ? 4000 : 2600
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, ttl)
  }, [])

  return { toasts, pushToast }
}
