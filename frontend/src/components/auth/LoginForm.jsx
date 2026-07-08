import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../../context/AuthProvider'
import { isProtectedPath } from '../../constants/rbac'
import useAuth from '../../hooks/useAuth'
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
  const location = useLocation()
  const { login } = useAuth()
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

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
    setSubmitError('')
    setTouched({ email: true, password: true })

    if (hasValidationErrors(errors)) return

    setSubmitting(true)
    try {
      const { redirectTo } = await login(values)
      const from = location.state?.from
      const destination =
        from && from !== '/login' && isProtectedPath(from) ? from : redirectTo
      navigate(destination, { replace: true })
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Unable to sign in.')
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
        {submitError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300" role="alert">
            {submitError}
          </p>
        )}

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
