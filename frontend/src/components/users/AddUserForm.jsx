import { useMemo, useState } from 'react'
import { CheckCircle2, UserPlus } from 'lucide-react'
import { ApiError, api } from '../../api/client'
import { hasValidationErrors } from '../../utils/validation'
import { validateAddUser } from '../../utils/userValidation'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  password: '',
}

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'property_manager', label: 'Property Manager' },
  { value: 'inspector', label: 'Inspector' },
  { value: 'tenant', label: 'Tenant' },
]

export default function AddUserForm({ id = 'add-user-form', onSubmitted }) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const errors = useMemo(() => validateAddUser(values), [values])

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field]),
  )

  function updateField(field, value) {
    setSubmitted(false)
    setSubmitError(null)
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleBlur(field) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      password: true,
    })

    if (hasValidationErrors(errors)) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      await api.createUser({
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        role: values.role,
        password: values.password,
      })

      setSubmitted(true)
      setValues(initialValues)
      setTouched({})
      onSubmitted?.()
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Unable to create user.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id={id}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Add User</h2>
        <p className="text-sm text-slate-500">Create a new team member with role-based access</p>
      </div>

      {submitted && (
        <div
          className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="font-semibold">User created successfully.</p>
        </div>
      )}

      {submitError && (
        <div
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            name="firstName"
            label="First name"
            placeholder="Jane"
            value={values.firstName}
            onChange={(event) => updateField('firstName', event.target.value)}
            onBlur={() => handleBlur('firstName')}
            error={visibleErrors.firstName}
          />
          <Input
            name="lastName"
            label="Last name"
            placeholder="Mwangi"
            value={values.lastName}
            onChange={(event) => updateField('lastName', event.target.value)}
            onBlur={() => handleBlur('lastName')}
            error={visibleErrors.lastName}
          />
        </div>

        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="jane.mwangi@example.com"
          value={values.email}
          onChange={(event) => updateField('email', event.target.value)}
          onBlur={() => handleBlur('email')}
          error={visibleErrors.email}
        />

        <Input
          type="tel"
          name="phone"
          label="Phone"
          placeholder="+254 700 000 000"
          value={values.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          onBlur={() => handleBlur('phone')}
          error={visibleErrors.phone}
          hint="Optional"
        />

        <Select
          name="role"
          label="Role"
          placeholder="Select role"
          options={roleOptions}
          value={values.role}
          onChange={(event) => updateField('role', event.target.value)}
          onBlur={() => handleBlur('role')}
          error={visibleErrors.role}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Minimum 8 characters"
          value={values.password}
          onChange={(event) => updateField('password', event.target.value)}
          onBlur={() => handleBlur('password')}
          error={visibleErrors.password}
        />

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          {submitting ? 'Creating…' : 'Create user'}
        </Button>
      </form>
    </section>
  )
}
