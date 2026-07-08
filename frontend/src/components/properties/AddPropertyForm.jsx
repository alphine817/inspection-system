import { useMemo, useState } from 'react'
import { Building2, CheckCircle2 } from 'lucide-react'
import { ApiError, api } from '../../api/client'
import { hasValidationErrors } from '../../utils/validation'
import { validateAddProperty } from '../../utils/propertyValidation'
import Button from '../ui/Button'
import Input from '../ui/Input'

const initialValues = {
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Kenya',
  notes: '',
}

export default function AddPropertyForm({ id = 'add-property-form', onSubmitted }) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const errors = useMemo(() => validateAddProperty(values), [values])

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
      name: true,
      addressLine1: true,
      city: true,
      state: true,
      postalCode: true,
      notes: true,
    })

    if (hasValidationErrors(errors)) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      await api.createProperty({
        name: values.name.trim(),
        address_line1: values.addressLine1.trim(),
        address_line2: values.addressLine2.trim() || undefined,
        city: values.city.trim(),
        state: values.state.trim(),
        postal_code: values.postalCode.trim(),
        country: values.country.trim() || 'Kenya',
        notes: values.notes.trim() || undefined,
      })

      setSubmitted(true)
      setValues(initialValues)
      setTouched({})
      onSubmitted?.()
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Unable to create property.')
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
        <h2 className="text-lg font-bold text-slate-900">Add Property</h2>
        <p className="text-sm text-slate-500">Register a new building in your portfolio</p>
      </div>

      {submitted && (
        <div
          className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="font-semibold">Property saved successfully.</p>
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
        <Input
          name="name"
          label="Property name"
          placeholder="Sunset Apartments"
          value={values.name}
          onChange={(event) => updateField('name', event.target.value)}
          onBlur={() => handleBlur('name')}
          error={visibleErrors.name}
        />

        <Input
          name="addressLine1"
          label="Street address"
          placeholder="123 Ngong Road"
          value={values.addressLine1}
          onChange={(event) => updateField('addressLine1', event.target.value)}
          onBlur={() => handleBlur('addressLine1')}
          error={visibleErrors.addressLine1}
        />

        <Input
          name="addressLine2"
          label="Address line 2"
          placeholder="Kilimani"
          value={values.addressLine2}
          onChange={(event) => updateField('addressLine2', event.target.value)}
          hint="Optional"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            name="city"
            label="City"
            placeholder="Nairobi"
            value={values.city}
            onChange={(event) => updateField('city', event.target.value)}
            onBlur={() => handleBlur('city')}
            error={visibleErrors.city}
          />
          <Input
            name="state"
            label="State / County"
            placeholder="Nairobi County"
            value={values.state}
            onChange={(event) => updateField('state', event.target.value)}
            onBlur={() => handleBlur('state')}
            error={visibleErrors.state}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            name="postalCode"
            label="Postal code"
            placeholder="00100"
            value={values.postalCode}
            onChange={(event) => updateField('postalCode', event.target.value)}
            onBlur={() => handleBlur('postalCode')}
            error={visibleErrors.postalCode}
          />
          <Input
            name="country"
            label="Country"
            placeholder="Kenya"
            value={values.country}
            onChange={(event) => updateField('country', event.target.value)}
          />
        </div>

        <Input
          name="notes"
          label="Notes"
          placeholder="Optional building details or access info"
          value={values.notes}
          onChange={(event) => updateField('notes', event.target.value)}
          onBlur={() => handleBlur('notes')}
          error={visibleErrors.notes}
          hint={`${values.notes.length}/500 characters`}
        />

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          <Building2 className="h-4 w-4" aria-hidden="true" />
          {submitting ? 'Saving…' : 'Save property'}
        </Button>
      </form>
    </section>
  )
}
