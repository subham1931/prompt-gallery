import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'prompt_gallery_cms_notifications'

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'n-default-1',
    title: 'New Prompt Published',
    message: 'Prompt "PEAKY BLINDER PIPELINE" was created and published.',
    time: 'Just now',
    read: false,
    type: 'create',
  },
  {
    id: 'n-default-2',
    title: 'Prompt Auto-Published',
    message: 'Scheduled prompt "test-20" was auto-published by scheduler.',
    time: '15m ago',
    read: false,
    type: 'publish',
  },
  {
    id: 'n-default-3',
    title: 'System Status',
    message: 'Database backup completed. All services running smoothly.',
    time: '2h ago',
    read: true,
    type: 'system',
  },
]

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAllRead: () => {},
  markAsRead: () => {},
  clearAll: () => {},
})

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (err) {
      console.warn('Failed to parse notifications from localStorage:', err.message)
    }
    return DEFAULT_NOTIFICATIONS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    } catch (err) {
      console.warn('Failed to save notifications to localStorage:', err.message)
    }
  }, [notifications])

  const addNotification = ({ title, message, type = 'create' }) => {
    const item = {
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type,
    }
    setNotifications((prev) => [item, ...prev])
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllRead,
        markAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}
