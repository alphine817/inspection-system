import { Navigate } from 'react-router-dom'
import AuthPageLayout from '../components/auth/AuthPageLayout'
import AuthVisualPanel from '../components/auth/AuthVisualPanel'
import LoginForm from '../components/auth/LoginForm'
import { getDashboardPathForRole } from '../constants/rbac'
import { authImages } from '../constants/authImages'
import useAuth from '../hooks/useAuth'

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />
  }

  return (
    <AuthPageLayout
      visual={
        <AuthVisualPanel
          backgroundSrc={authImages.loginBackground}
          backgroundAlt="Modern residential building exterior"
        >
          <LoginForm />
        </AuthVisualPanel>
      }
    />
  )
}
