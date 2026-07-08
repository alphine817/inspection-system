import AuthPageLayout from '../components/auth/AuthPageLayout'
import AuthVisualPanel from '../components/auth/AuthVisualPanel'
import LoginDetailsPanel from '../components/auth/LoginDetailsPanel'
import LoginForm from '../components/auth/LoginForm'
import { authImages } from '../constants/authImages'

export default function LoginPage() {
  return (
    <AuthPageLayout
      details={<LoginDetailsPanel />}
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
