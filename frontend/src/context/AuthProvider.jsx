import { createContext, useCallback, useMemo, useState } from 'react'
import { ApiError, api } from '../api/client'
import { getDashboardPathForRole } from '../constants/rbac'
import {
  clearStoredUser,
  getStoredSession,
  normalizeAuthUser,
  persistSession,
} from '../utils/auth'

export const AuthContext = createContext(null)

function buildAuthResult(apiResponse) {
  const user = normalizeAuthUser(apiResponse.user)

  persistSession({
    user,
    token: apiResponse.token,
  })

  return {
    user,
    token: apiResponse.token,
    redirectTo: getDashboardPathForRole(user.role),
  }
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession())

  const login = useCallback(async ({ email, password }) => {
    const response = await api.login({ email, password })
    const result = buildAuthResult(response)

    setSession({
      ...result.user,
      token: result.token,
    })

    return result
  }, [])

  const register = useCallback(async (payload) => {
    const response = await api.register(payload)
    const result = buildAuthResult(response)

    setSession({
      ...result.user,
      token: result.token,
    })

    return result
  }, [])

  const logout = useCallback(() => {
    clearStoredUser()
    setSession(null)
  }, [])

  const value = useMemo(() => {
    const user = session
      ? {
          id: session.id,
          email: session.email,
          role: session.role,
          displayName: session.displayName,
          firstName: session.firstName,
          lastName: session.lastName,
        }
      : null

    return {
      user,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      login,
      register,
      logout,
    }
  }, [session, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { ApiError }
