import { Navigate } from 'react-router-dom'
import { getDashboardPathForRole } from '../../constants/rbac'
import useAuth from '../../hooks/useAuth'

export default function RoleHomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={getDashboardPathForRole(user?.role)} replace />
}
