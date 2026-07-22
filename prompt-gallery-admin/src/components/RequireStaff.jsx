import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireStaff({ children, superadminOnly = false }) {
  const { booting, isStaff, isSuperadmin } = useAuth()
  const location = useLocation()

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-[13px] text-mute">
        Loading…
      </div>
    )
  }

  if (!isStaff) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (superadminOnly && !isSuperadmin) {
    return <Navigate to="/" replace />
  }

  return children
}
