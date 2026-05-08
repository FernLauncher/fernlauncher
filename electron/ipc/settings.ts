import { ipcMain, BrowserWindow } from 'electron'
import { config } from '../utils/config'
import { applyProxy } from '../utils/proxy'

export function registerSettingsHandlers() {
  ipcMain.handle('config:get', () => {
    return config.store
  })

  ipcMain.handle('config:set', (_event, key: string, value: unknown) => {
    config.set(key as any, value)
    if (key === 'proxy') applyProxy()
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('settings:updated')
    })
  })
}