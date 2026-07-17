import { useCallback, useState } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((msg) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, msg }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2600)
  }, [])

  return { toasts, pushToast }
}
