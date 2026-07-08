export function validateAddProperty(values) {
  const errors = {}

  if (!values.name.trim()) {
    errors.name = 'Property name is required.'
  }

  if (!values.addressLine1.trim()) {
    errors.addressLine1 = 'Street address is required.'
  }

  if (!values.city.trim()) {
    errors.city = 'City is required.'
  }

  if (!values.state.trim()) {
    errors.state = 'State or county is required.'
  }

  if (!values.postalCode.trim()) {
    errors.postalCode = 'Postal code is required.'
  }

  if (values.notes && values.notes.length > 500) {
    errors.notes = 'Notes must be 500 characters or fewer.'
  }

  return errors
}
