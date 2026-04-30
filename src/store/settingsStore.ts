import { create } from 'zustand'
import { AppConfig, defaults } from '../types/config'

interface SettingsStore {
  config: AppConfig
  isLoaded: boolean
  load: () => Promise<void>
  set: <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((setState) => ({
  config: defaults,
  isLoaded: false,

  load: async () => {
    const config = await window.electron.getConfig()
    setState({ config, isLoaded: true })
  },

  set: async (key, value) => {
    await window.electron.setConfig(key as string, value)
    setState(state => ({
      config: { ...state.config, [key]: value }
    }))
  },
}))