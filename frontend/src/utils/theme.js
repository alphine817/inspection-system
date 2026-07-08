export const THEME_STORAGE_KEY = 'propstat-theme'

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
}

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === THEMES.DARK || stored === THEMES.LIGHT || stored === THEMES.SYSTEM) return stored
  } catch {
    /* localStorage unavailable */
  }
  return THEMES.LIGHT
}

export function getSystemTheme() {
  if (typeof window === 'undefined') return THEMES.LIGHT
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
}

export function resolveTheme(theme) {
  if (theme === THEMES.SYSTEM) {
    return getSystemTheme()
  }

  return theme === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT
}

export function applyTheme(theme) {
  const root = document.documentElement
  const resolvedTheme = resolveTheme(theme)

  if (resolvedTheme === THEMES.DARK) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function persistTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* localStorage unavailable */
  }
}

export function initTheme() {
  const theme = getStoredTheme()
  applyTheme(theme)
  return theme
}
