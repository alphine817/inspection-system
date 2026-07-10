import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { ApiError, api } from '../../api/client'
import { hasValidationErrors } from '../../utils/validation'
import { validateBookingRequest } from '../../utils/bookingValidation'
import Button from '../ui/Button'
import Input from '../ui/Input'

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  preferredMoveInDate: '',
}

export default function BookingModal({ unit, onClose }) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [success, setSuccess] = useState(false)

  const errors = useMemo(() => validateBookingRequest(values), [values])

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([field]) => touched[field]),
  )

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function updateField(field, value) {
    setSubmitError(null)
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
      phone: true,
      preferredMoveInDate: true,
    })

    if (hasValidationErrors(errors)) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      await api.createBooking({
        unit_id: unit.id,
        full_name: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        preferred_move_in_date: values.preferredMoveInDate,
      })
      setSuccess(true)
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Unable to submit booking request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-4 backdrop-blur-sm sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Close booking form"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <h2 id="booking-modal-title" className="pr-8 text-lg font-bold text-slate-900 dark:text-slate-100">
            {success ? 'Request submitted' : `Book Unit ${unit.unit_number}`}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {success
              ? 'Your application is on its way to our team.'
              : `${unit.property_name} · ${unit.city}, ${unit.state}`}
          </p>
        </div>

        <div className="px-6 py-5">
          {success ? (
            <div className="space-y-5">
              <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <p>
                  Booking Request Received! We have automatically set up your Tenant Portal account.
                  Please check your email for temporary login credentials to track your application status.
                </p>
              </div>
              <Button type="button" onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {submitError && (
                <div
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              <Input
                name="fullName"
                label="Full name"
                placeholder="Jane Doe"
                value={values.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                onBlur={() => handleBlur('fullName')}
                error={visibleErrors.fullName}
              />

              <Input
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(event) => updateField('email', event.target.value)}
                onBlur={() => handleBlur('email')}
                error={visibleErrors.email}
              />

              <Input
                name="phone"
                type="tel"
                label="Phone number"
                placeholder="+254 700 000 000"
                value={values.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                onBlur={() => handleBlur('phone')}
                error={visibleErrors.phone}
              />

              <Input
                name="preferredMoveInDate"
                type="date"
                label="Preferred move-in date"
                value={values.preferredMoveInDate}
                onChange={(event) => updateField('preferredMoveInDate', event.target.value)}
                onBlur={() => handleBlur('preferredMoveInDate')}
                error={visibleErrors.preferredMoveInDate}
              />

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button type="submit" disabled={submitting} className="w-full sm:flex-1">
                  {submitting ? 'Submitting…' : 'Submit booking request'}
                </Button>
                <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
