import { ipcMain, BrowserWindow } from 'electron'
import { config } from '../utils/config'

export function registerSettingsHandlers() {
  ipcMain.handle('config:get', () => {
    return config.store
  })

  ipcMain.handle('config:set', (_event, key: string, value: unknown) => {
    config.set(key as any, value)
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('settings:updated')
    })
  })
}