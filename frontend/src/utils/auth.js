import { getDashboardPathForRole } from '../constants/rbac'

export const AUTH_STORAGE_KEY = 'propstat-auth'

export function normalizeAuthUser(apiUser) {
  const firstName = apiUser.first_name ?? ''
  const lastName = apiUser.last_name ?? ''
  const displayName = `${firstName} ${lastName}`.trim() || apiUser.email

  return {
    id: apiUser.id,
    email: apiUser.email,
    role: apiUser.role,
    firstName,
    lastName,
    displayName,
  }
}

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed?.email || !parsed?.role || !parsed?.token) return null

    return parsed
  } catch {
    return null
  }
}

export function getStoredUser() {
  return getStoredSession()
}

export function getAuthToken() {
  return getStoredSession()?.token ?? null
}

export function persistSession({ user, token }) {
  try {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        ...user,
        token,
      }),
    )
  } catch {
    /* localStorage unavailable */
  }
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    /* localStorage unavailable */
  }
}

export function splitFullName(fullName) {
  const parts = fullName.trim().split(/\s+/)
  const firstName = parts[0] ?? ''
  const lastName = parts.slice(1).join(' ') || firstName

  return { firstName, lastName }
}

export { getDashboardPathForRole }
