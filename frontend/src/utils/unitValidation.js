export function validateAddUnit(values) {
  const errors = {}

  if (!values.unitNumber.trim()) {
    errors.unitNumber = 'Unit name or number is required.'
  }

  if (values.bedrooms !== '' && values.bedrooms != null) {
    const bedrooms = Number(values.bedrooms)
    if (!Number.isInteger(bedrooms) || bedrooms < 0) {
      errors.bedrooms = 'Bedrooms must be a whole number of 0 or more.'
    }
  }

  if (values.bathrooms !== '' && values.bathrooms != null) {
    const bathrooms = Number(values.bathrooms)
    if (Number.isNaN(bathrooms) || bathrooms < 0) {
      errors.bathrooms = 'Bathrooms must be 0 or more.'
    } else if (bathrooms % 0.5 !== 0) {
      errors.bathrooms = 'Bathrooms must use half-bath increments (e.g. 1, 1.5, 2).'
    }
  }

  if (values.squareFeet !== '' && values.squareFeet != null) {
    const squareFeet = Number(values.squareFeet)
    if (!Number.isInteger(squareFeet) || squareFeet < 0) {
      errors.squareFeet = 'Square footage must be a whole number of 0 or more.'
    }
  }

  if (values.monthlyRent !== '' && values.monthlyRent != null) {
    const monthlyRent = Number(values.monthlyRent)
    if (Number.isNaN(monthlyRent) || monthlyRent < 0) {
      errors.monthlyRent = 'Monthly rent must be 0 or more.'
    }
  }

  return errors
}
