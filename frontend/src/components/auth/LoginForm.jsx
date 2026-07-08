import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hasValidationErrors } from '../../utils/validation'
import { validateLogin } from '../../utils/authValidation'
import Button from '../ui/Button'
import AuthBrandLogo from './AuthBrandLogo'
import AuthFooterLink from './AuthFooterLink'
import AuthInput from './AuthInput'
import PasswordInput from './PasswordInput'

const initialValues = {
  email: '',
  password: '',
}

export default function LoginForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const errors = useMemo(() => validateLogin(values), [values])

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field]),
  )

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleBlur(field) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setTouched({ email: true, password: true })

    if (hasValidationErrors(errors)) return

    setSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      navigate('/dashboard')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <AuthBrandLogo showName={false} inline />
        <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-slate-100">Sign in to PropStat Pro</h1>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthInput
          type="email"
          name="email"
          label="Email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={(event) => updateField('email', event.target.value)}
          onBlur={() => handleBlur('email')}
          error={visibleErrors.email}
        />

        <PasswordInput
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={(event) => updateField('password', event.target.value)}
          onBlur={() => handleBlur('password')}
          error={visibleErrors.password}
        />

        <Button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full touch-manipulation rounded-xl py-3.5 text-base"
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <AuthFooterLink
        prompt="Don't have an account?"
        linkText="Sign Up"
        to="/signup"
      />
    </>
  )
}
