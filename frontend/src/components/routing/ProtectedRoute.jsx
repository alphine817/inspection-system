import { Navigate, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { getDashboardPathForRole } from '../../constants/rbac'
import useAuth from '../../hooks/useAuth'

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children ?? <Outlet />
}

export function RoleGuard({ allowedRoles }) {
  const { user } = useAuth()
  const context = useOutletContext()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />
  }

  return <Outlet context={context} />
}
