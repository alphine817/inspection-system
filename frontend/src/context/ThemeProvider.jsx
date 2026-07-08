import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  THEMES,
  applyTheme,
  getStoredTheme,
  initTheme,
  persistTheme,
  resolveTheme,
} from '../utils/theme'

export const ThemeContext = createContext(null)

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => initTheme())

  useEffect(() => {
    applyTheme(theme)
    persistTheme(theme)
  }, [theme])

  useEffect(() => {
    if (theme !== THEMES.SYSTEM) return undefined

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme(theme)

    mediaQuery.addEventListener?.('change', handleChange)
    return () => mediaQuery.removeEventListener?.('change', handleChange)
  }, [theme])

  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme === THEMES.DARK || nextTheme === THEMES.LIGHT || nextTheme === THEMES.SYSTEM ? nextTheme : THEMES.LIGHT)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      if (current === THEMES.DARK) return THEMES.LIGHT
      if (current === THEMES.LIGHT) return THEMES.DARK
      return THEMES.DARK
    })
  }, [])

  const value = useMemo(
    () => ({
      theme,
      isDark: resolveTheme(theme) === THEMES.DARK,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export { THEMES, getStoredTheme }
