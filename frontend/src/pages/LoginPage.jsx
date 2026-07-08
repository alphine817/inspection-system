import AuthPageLayout from '../components/auth/AuthPageLayout'
import AuthVisualPanel from '../components/auth/AuthVisualPanel'
import LoginForm from '../components/auth/LoginForm'
import { authImages } from '../constants/authImages'

export default function LoginPage() {
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
