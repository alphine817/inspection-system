import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../context/AuthProvider'
import { SIGNUP_ROLE_OPTIONS } from '../../constants/rbac'
import useAuth from '../../hooks/useAuth'
import { splitFullName } from '../../utils/auth'
import { hasValidationErrors } from '../../utils/validation'
import { validateSignUp } from '../../utils/authValidation'
import Button from '../ui/Button'
import AuthFooterLink from './AuthFooterLink'
import AuthInput from './AuthInput'
import AuthSelect from './AuthSelect'
import PasswordInput from './PasswordInput'

const initialValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  role: '',
}

export default function SignUpForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const errors = useMemo(() => validateSignUp(values), [values])

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
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      companyName: true,
      role: true,
    })

    if (hasValidationErrors(errors)) return

    const { firstName, lastName } = splitFullName(values.fullName)

    setSubmitting(true)
    try {
      const { redirectTo } = await register({
        email: values.email.trim(),
        password: values.password,
        first_name: firstName,
        last_name: lastName,
        role: values.role,
      })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Unable to create account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-ink dark:text-slate-100 sm:text-3xl">
        Create Your Account
      </h1>

      <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit} noValidate>
        {submitError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300" role="alert">
            {submitError}
          </p>
        )}

        <AuthInput
          type="text"
          name="fullName"
          label="Full Name"
          autoComplete="name"
          placeholder="Jane Mwangi"
          value={values.fullName}
          onChange={(event) => updateField('fullName', event.target.value)}
          onBlur={() => handleBlur('fullName')}
          error={visibleErrors.fullName}
        />

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

        <AuthSelect
          name="role"
          label="Account Type"
          placeholder="Select your role"
          options={SIGNUP_ROLE_OPTIONS}
          value={values.role}
          onChange={(event) => updateField('role', event.target.value)}
          onBlur={() => handleBlur('role')}
          error={visibleErrors.role}
        />

        <PasswordInput
          name="password"
          label="Create Password"
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
          value={values.password}
          onChange={(event) => updateField('password', event.target.value)}
          onBlur={() => handleBlur('password')}
          error={visibleErrors.password}
        />

        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={values.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          error={visibleErrors.confirmPassword}
        />

        <AuthInput
          type="text"
          name="companyName"
          label="Company Name"
          autoComplete="organization"
          placeholder="Your property management company"
          value={values.companyName}
          onChange={(event) => updateField('companyName', event.target.value)}
          onBlur={() => handleBlur('companyName')}
          error={visibleErrors.companyName}
        />

        <Button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full touch-manipulation rounded-xl py-3.5 text-base"
        >
          {submitting ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <AuthFooterLink
        prompt="Already have an account?"
        linkText="Sign In"
        to="/login"
      />
    </>
  )
}
