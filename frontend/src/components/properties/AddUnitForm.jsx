import { useMemo, useState } from 'react'
import { CheckCircle2, Home } from 'lucide-react'
import { ApiError, api } from '../../api/client'
import { hasValidationErrors } from '../../utils/validation'
import { validateAddUnit } from '../../utils/unitValidation'
import Button from '../ui/Button'
import Input from '../ui/Input'

const initialValues = {
  unitNumber: '',
  bedrooms: '',
  bathrooms: '',
  squareFeet: '',
  monthlyRent: '',
}

export default function AddUnitForm({
  propertyId,
  propertyName,
  onSubmitted,
  onCancel,
}) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const errors = useMemo(() => validateAddUnit(values), [values])

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
      unitNumber: true,
      bedrooms: true,
      bathrooms: true,
      squareFeet: true,
      monthlyRent: true,
    })

    if (hasValidationErrors(errors)) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      await api.createUnit({
        property_id: propertyId,
        unit_number: values.unitNumber.trim(),
        bedrooms: values.bedrooms === '' ? undefined : Number(values.bedrooms),
        bathrooms: values.bathrooms === '' ? undefined : Number(values.bathrooms),
        square_feet: values.squareFeet === '' ? undefined : Number(values.squareFeet),
        monthly_rent: values.monthlyRent === '' ? undefined : Number(values.monthlyRent),
      })

      setSubmitted(true)
      setValues(initialValues)
      setTouched({})
      onSubmitted?.()
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Unable to create unit.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add Unit</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Add a unit to <span className="font-semibold text-slate-700 dark:text-slate-300">{propertyName}</span>
        </p>
      </div>

      {submitted && (
        <div
          className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="font-semibold">Unit saved successfully.</p>
        </div>
      )}

      {submitError && (
        <div
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          name="unitNumber"
          label="Unit name / number"
          placeholder="101"
          value={values.unitNumber}
          onChange={(event) => updateField('unitNumber', event.target.value)}
          onBlur={() => handleBlur('unitNumber')}
          error={visibleErrors.unitNumber}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            name="bedrooms"
            type="number"
            min="0"
            step="1"
            label="Bedrooms"
            placeholder="2"
            value={values.bedrooms}
            onChange={(event) => updateField('bedrooms', event.target.value)}
            onBlur={() => handleBlur('bedrooms')}
            error={visibleErrors.bedrooms}
          />
          <Input
            name="bathrooms"
            type="number"
            min="0"
            step="0.5"
            label="Bathrooms"
            placeholder="1.5"
            value={values.bathrooms}
            onChange={(event) => updateField('bathrooms', event.target.value)}
            onBlur={() => handleBlur('bathrooms')}
            error={visibleErrors.bathrooms}
            hint="Supports half baths (e.g. 1.5)"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            name="squareFeet"
            type="number"
            min="0"
            step="1"
            label="Square footage"
            placeholder="850"
            value={values.squareFeet}
            onChange={(event) => updateField('squareFeet', event.target.value)}
            onBlur={() => handleBlur('squareFeet')}
            error={visibleErrors.squareFeet}
          />
          <Input
            name="monthlyRent"
            type="number"
            min="0"
            step="0.01"
            label="Monthly rent"
            placeholder="45000"
            value={values.monthlyRent}
            onChange={(event) => updateField('monthlyRent', event.target.value)}
            onBlur={() => handleBlur('monthlyRent')}
            error={visibleErrors.monthlyRent}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            <Home className="h-4 w-4" aria-hidden="true" />
            {submitting ? 'Saving…' : 'Save unit'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </form>
    </section>
  )
}
