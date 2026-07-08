import AuthPageLayout from '../components/auth/AuthPageLayout'
import AuthVisualPanel from '../components/auth/AuthVisualPanel'
import SignUpForm from '../components/auth/SignUpForm'
import { authImages } from '../constants/authImages'

export default function SignUpPage() {
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
