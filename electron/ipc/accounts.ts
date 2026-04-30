import { ipcMain, BrowserWindow } from 'electron'
import { accountManager } from '../services/auth/accounts'

export function registerAccountHandlers() {
  ipcMain.handle('accounts:get', () => {
    return accountManager.getAll()
  })

  ipcMain.handle('accounts:addMicrosoft', async () => {
    const account = await accountManager.addMicrosoft()
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('accounts:updated')
    })
    return account
  })

  ipcMain.handle('accounts:remove', (_event, id: string) => {
    accountManager.remove(id)
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('accounts:updated')
    })
  })

  ipcMain.handle('accounts:setActive', (_event, id: string) => {
    accountManager.setActive(id)
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('accounts:updated')
    })
  })

  ipcMain.handle('accounts:refresh', (_event, id: string) => {
    return accountManager.refresh(id)
  })
}