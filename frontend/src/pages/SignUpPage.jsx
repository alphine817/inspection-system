import { Navigate } from 'react-router-dom'
import AuthPageLayout from '../components/auth/AuthPageLayout'
import AuthVisualPanel from '../components/auth/AuthVisualPanel'
import SignUpForm from '../components/auth/SignUpForm'
import { getDashboardPathForRole } from '../constants/rbac'
import { authImages } from '../constants/authImages'
import useAuth from '../hooks/useAuth'

export default function SignUpPage() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />
  }

  return (
    <AuthPageLayout
      visual={
        <AuthVisualPanel
          backgroundSrc={authImages.signUpBackground}
          backgroundAlt="Modern housing development site"
        >
          <SignUpForm />
        </AuthVisualPanel>
      }
    />
  )
}
