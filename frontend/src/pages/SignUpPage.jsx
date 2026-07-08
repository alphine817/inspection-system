import AuthPageLayout from '../components/auth/AuthPageLayout'
import AuthVisualPanel from '../components/auth/AuthVisualPanel'
import SignUpDetailsPanel from '../components/auth/SignUpDetailsPanel'
import SignUpForm from '../components/auth/SignUpForm'
import { authImages } from '../constants/authImages'

export default function SignUpPage() {
  return (
    <AuthPageLayout
      details={<SignUpDetailsPanel />}
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
