import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hasValidationErrors } from '../../utils/validation'
import { validateSignUp } from '../../utils/authValidation'
import Button from '../ui/Button'
import AuthFooterLink from './AuthFooterLink'
import AuthInput from './AuthInput'
import PasswordInput from './PasswordInput'

const initialValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  companyName: '',
}

export default function SignUpForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

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
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      companyName: true,
    })

    if (hasValidationErrors(errors)) return

    setSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      navigate('/dashboard')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Create Your Account
      </h1>

      <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit} noValidate>
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
