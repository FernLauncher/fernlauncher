import { app, BrowserWindow, ipcMain, shell, dialog, Menu } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from './utils/config'
import { Paths } from './utils/paths'
import { registerSettingsHandlers } from './ipc/settings'
import { registerInstanceHandlers } from './ipc/instances'
import { registerAccountHandlers } from './ipc/accounts'
import { registerJavaHandlers } from './ipc/java'
import { registerVersionHandlers } from './ipc/versions'
import { registerConsoleWindow } from './services/launcher'
import fs from 'fs'
import { autoUpdater } from 'electron-updater'
import { initDiscordRpc, destroyDiscordRpc } from './services/discordRpc'



const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const RENDERER_URL = process.env['VITE_DEV_SERVER_URL']

function ensureDirectories() {
  const dirs = [
    Paths.instances,
    Paths.java,
    Paths.icons,
    Paths.skins,
    Paths.mods,
    Paths.logs,
  ]
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  }
}

function createMainWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 750,
    minHeight: 500,
    frame: true,
    title: 'Fernlauncher',
    webPreferences: {
      preload: join(__dirname, '../dist-electron/preload.cjs'),
      sandbox: false,
    },
    icon: join(app.getAppPath(), 'public/iconreal.ico')
  })

  win.setMenuBarVisibility(false)

  if (RENDERER_URL) {
    console.log('Main window loading URL:', RENDERER_URL)
    win.loadURL(RENDERER_URL)
  } else {
    win.loadFile(join(app.getAppPath(), 'dist/index.html'))
  }

  return win
}

function createFirstLaunchWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 450,
    resizable: true,
    minWidth: 500,
    minHeight: 400,
    frame: true,
    title: 'Welcome to Fernlauncher',
    webPreferences: {
      preload: join(__dirname, '../dist-electron/preload.cjs'),
      sandbox: false,
    },
    icon: join(app.getAppPath(), 'public/iconreal.ico')
  })

  win.setMenuBarVisibility(false)

  if (RENDERER_URL) {
    console.log('First launch loading URL:', RENDERER_URL)
    win.loadURL(RENDERER_URL + '?firstLaunch=true')
  } else {
    win.loadFile(join(app.getAppPath(), 'dist/index.html'), {
      query: { firstLaunch: 'true' },
    })
  }

  return win
}

function createNewInstanceWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 580,
    minWidth: 600,
    minHeight: 500,
    title: 'New Instance — Fernlauncher',
    center: true,
    webPreferences: {
      preload: join(__dirname, '../dist-electron/preload.cjs'),
      sandbox: false,
    },
    icon: join(app.getAppPath(), 'public/iconreal.ico')
  })

  win.setMenuBarVisibility(false)

  if (RENDERER_URL) {
    win.loadURL(RENDERER_URL + '?window=newInstance')
  } else {
    win.loadFile(join(app.getAppPath(), 'dist/index.html'), {
      query: { window: 'newInstance' },
    })
  }

  return win
}

async function applyProxy() {
  const { session } = await import('electron')
  const proxyConfig = config.get('proxy')
  
  if (proxyConfig.type === 'none') {
    await session.defaultSession.setProxy({ mode: 'direct' })
  } else if (proxyConfig.type === 'http' || proxyConfig.type === 'socks5') {
    await session.defaultSession.setProxy({
      proxyRules: `${proxyConfig.type}://${proxyConfig.address}:${proxyConfig.port}`,
    })
  }
}

function createSettingsWindow() {
  const win = new BrowserWindow({
    width: 850,
    height: 580,
    minWidth: 700,
    minHeight: 500,
    title: 'Settings — Fernlauncher',
    center: true,
    webPreferences: {
      preload: join(__dirname, '../dist-electron/preload.cjs'),
      sandbox: false,
    },
    icon: join(app.getAppPath(), 'public/iconreal.ico')
  })

  win.setMenuBarVisibility(false)

  if (RENDERER_URL) {
    win.loadURL(RENDERER_URL + '?window=settings')
  } else {
    win.loadFile(join(app.getAppPath(), 'dist/index.html'), {
      query: { window: 'settings' },
    })
  }

  return win
}

function createConsoleWindow(instanceId: string) {
  const win = new BrowserWindow({
    width: 850,
    height: 600,
    minWidth: 700,
    minHeight: 400,
    title: 'Console — Fernlauncher',
    center: true,
    webPreferences: {
      preload: join(__dirname, '../dist-electron/preload.cjs'),
      sandbox: false,
    },
    icon: join(app.getAppPath(), 'public/iconreal.ico')
  })
  win.setMenuBarVisibility(false)
  registerConsoleWindow(instanceId, win)
  if (RENDERER_URL) {
    win.loadURL(RENDERER_URL + `?window=console&instanceId=${instanceId}`)
  } else {
    win.loadFile(join(app.getAppPath(), 'dist/index.html'), {
      query: { window: 'console', instanceId },
    })
  }
  return win
}

app.whenReady().then(async () => {
  await applyProxy()
  registerSettingsHandlers()
  registerInstanceHandlers()
  registerAccountHandlers()
  registerJavaHandlers()
  registerVersionHandlers()
  ensureDirectories()
  initDiscordRpc()
  

  // Check for updates after app is ready (only in production)
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify()
    
    autoUpdater.on('update-available', () => {
      BrowserWindow.getAllWindows()[0]?.webContents.send('update:available')
    })

    autoUpdater.on('update-downloaded', () => {
      BrowserWindow.getAllWindows()[0]?.webContents.send('update:downloaded')
    })

    autoUpdater.on('download-progress', (progress) => {
      BrowserWindow.getAllWindows()[0]?.webContents.send('update:progress', Math.round(progress.percent))
})
  }

  ipcMain.handle('update:install', () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.handle('window:newInstance', () => {
    createNewInstanceWindow()
  })

  ipcMain.handle('window:settings', () => {
    createSettingsWindow()
  })

  ipcMain.handle('window:console', (_event, instanceId: string) => {
    createConsoleWindow(instanceId)
  })

  ipcMain.handle('instance:openEditor', (_event, instanceId: string) => {
  const win = new BrowserWindow({
    width: 900,
    height: 650,
    title: 'Edit Instance — Fernlauncher',
    center: true,
    webPreferences: {
      preload: join(__dirname, '../dist-electron/preload.cjs'),
      sandbox: false,
    },
    icon: join(app.getAppPath(), 'public/iconreal.ico')
    })
    win.setMenuBarVisibility(false)
    if (RENDERER_URL) {
      win.loadURL(RENDERER_URL + `?window=instanceEditor&instanceId=${instanceId}`)
    } else {
      win.loadFile(join(app.getAppPath(), 'dist/index.html'), {
        query: { window: 'instanceEditor', instanceId },
      })
    }
  })
  

  ipcMain.handle('launcher:openFolder', async (_event, key: string) => {
    const folderMap: Record<string, string> = {
      root: Paths.appData,
      instances: Paths.instances,
      mods: Paths.mods,
      skins: Paths.skins,
      java: Paths.java,
      icons: Paths.icons,
      logs: Paths.logs,
      downloads: app.getPath('downloads'),
    }
    const folder = folderMap[key]
    if (folder) {
      if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
      shell.openPath(folder)
    }
  })

  ipcMain.handle('launcher:clearMetadataCache', async () => {
    const { session } = await import('electron')
    await session.defaultSession.clearCache()
  })

  ipcMain.handle('launcher:openAbout', () => {
    const win = new BrowserWindow({
      width: 400,
      height: 380,
      title: 'About Fernlauncher',
      resizable: false,
      center: true,
      webPreferences: {
        preload: join(__dirname, '../dist-electron/preload.cjs'),
        sandbox: false,
      },
      icon: join(app.getAppPath(), 'public/iconreal.ico')
    })
    win.setMenuBarVisibility(false)
    if (RENDERER_URL) {
      win.loadURL(RENDERER_URL + '?window=about')
    } else {
      win.loadFile(join(app.getAppPath(), 'dist/index.html'), { query: { window: 'about' } })
    }
  })

  ipcMain.handle('launcher:browseFolder', async (_event, key: string) => {
    const result = await dialog.showOpenDialog({
      title: `Select ${key} folder`,
      properties: ['openDirectory'],
    })
    if (result.canceled) return null
    return result.filePaths[0]
  })

  ipcMain.handle('launcher:checkForUpdates', async () => {
    if (app.isPackaged) {
      autoUpdater.checkForUpdates()
    } else {
      BrowserWindow.getAllWindows()[0]?.webContents.send('update:notAvailable')
    }
  })

  autoUpdater.on('update-not-available', () => {
    BrowserWindow.getAllWindows()[0]?.webContents.send('update:notAvailable')
  })

  ipcMain.handle('instance:contextMenu', (_event, instanceId: string) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return

    const menu = Menu.buildFromTemplate([
      { label: 'Launch', click: () => win.webContents.send('instance:action', { action: 'launch', instanceId }) },
      { label: 'Kill', click: () => win.webContents.send('instance:action', { action: 'kill', instanceId }) },
      { type: 'separator' },
      { label: 'Rename', click: () => win.webContents.send('instance:action', { action: 'rename', instanceId }) },
      { label: 'Change Icon', click: () => win.webContents.send('instance:action', { action: 'changeIcon', instanceId }) },
      { label: 'Edit...', click: () => win.webContents.send('instance:action', { action: 'edit', instanceId }) },
      { label: 'Open Folder', click: () => win.webContents.send('instance:action', { action: 'folder', instanceId }) },
      { type: 'separator' },
      { label: 'Export...', click: () => win.webContents.send('instance:action', { action: 'export', instanceId }) },
      { label: 'Copy', click: () => win.webContents.send('instance:action', { action: 'copy', instanceId }) },
      { label: 'Create Shortcut', click: () => win.webContents.send('instance:action', { action: 'shortcut', instanceId }) },
      { type: 'separator' },
      { label: 'Delete', click: () => win.webContents.send('instance:action', { action: 'delete', instanceId }) },
    ])

    menu.popup({ window: win })
  })

  const isFirstLaunch = config.get('firstLaunch')

  if (isFirstLaunch) {
    const firstLaunchWin = createFirstLaunchWindow()
    ipcMain.once('first-launch-complete', () => {
      config.set('firstLaunch', false)
      firstLaunchWin.close()
      createMainWindow()
    })
  } else {
    createMainWindow()
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })

  const instanceArg = process.argv.find(a => a.startsWith('--instance'))
    if (instanceArg) {
      const instanceId = instanceArg.split('=')[1] ?? process.argv[process.argv.indexOf(instanceArg) + 1]
      // Launch main window then auto-launch the instance
      const win = createMainWindow()
      win.webContents.once('did-finish-load', () => {
        setTimeout(() => {
          win.webContents.send('auto-launch-instance', instanceId)
        }, 2000)
      })
    return
  }

})

app.on('window-all-closed', () => {
  destroyDiscordRpc()
  if (process.platform !== 'darwin') app.quit()
})