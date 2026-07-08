import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  THEMES,
  applyTheme,
  getStoredTheme,
  initTheme,
  persistTheme,
} from '../utils/theme'

export const ThemeContext = createContext(null)

export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => initTheme())

  useEffect(() => {
    applyTheme(theme)
    persistTheme(theme)
  }, [theme])

  const setTheme = useCallback((nextTheme) => {
    setThemeState(nextTheme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === THEMES.DARK,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export { THEMES, getStoredTheme }
