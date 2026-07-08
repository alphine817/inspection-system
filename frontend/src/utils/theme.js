export const THEME_STORAGE_KEY = 'propstat-theme'

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
}

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === THEMES.DARK || stored === THEMES.LIGHT) return stored
  } catch {
    /* localStorage unavailable */
  }
  return THEMES.LIGHT
}

export function getSystemTheme() {
  if (typeof window === 'undefined') return THEMES.LIGHT
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
}

export function applyTheme(theme) {
  const root = document.documentElement
  if (theme === THEMES.DARK) {
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
