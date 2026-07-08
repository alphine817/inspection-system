import { useEffect, useState } from 'react'
import { loadSettings } from '../utils/settings'

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    function refresh() {
      setSettings(loadSettings())
    }

    window.addEventListener('settings:updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('settings:updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return settings
}
