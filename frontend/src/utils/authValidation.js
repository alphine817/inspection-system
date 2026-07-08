const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(values) {
  const errors = {}

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  return errors
}

export function validateSignUp(values) {
  const errors = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.'
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = 'Enter your full name.'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.'
  }

  if (!values.companyName.trim()) {
    errors.companyName = 'Company name is required.'
  }

  if (!values.role) {
    errors.role = 'Please select an account type.'
  }

  return errors
}
