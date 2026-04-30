import { useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'

export function useTheme() {
  const theme = useSettingsStore(s => s.config.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return theme
}