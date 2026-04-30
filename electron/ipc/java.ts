import { ipcMain, dialog, BrowserWindow } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { javaManager } from '../services/javaManager'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { Paths } from '../utils/paths'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const RENDERER_URL = process.env['VITE_DEV_SERVER_URL']

export function registerJavaHandlers() {
  ipcMain.handle('java:detect', async () => {
    return new Promise(resolve => {
      setImmediate(() => {
        resolve(javaManager.detect())
      })
    })
  })

  ipcMain.handle('java:installs', () => {
    return javaManager.getInstalled()
  })

  ipcMain.handle('java:download', () => {
    const win = new BrowserWindow({
      width: 600,
      height: 500,
      title: 'Install Java — Fernlaunch',
      center: true,
      webPreferences: {
        preload: join(__dirname, '../dist-electron/preload.cjs'),
        sandbox: false,
      },
    })
    win.setMenuBarVisibility(false)
    if (RENDERER_URL) {
      win.loadURL(RENDERER_URL + '?window=javaDownload')
    } else {
      win.loadFile(join(__dirname, '../../dist/index.html'), {
        query: { window: 'javaDownload' },
      })
    }
  })

  ipcMain.handle('java:browse', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Select Java Executable',
      filters: [
        { name: 'Java', extensions: process.platform === 'win32' ? ['exe'] : ['*'] }
      ],
      properties: ['openFile'],
    })
    if (result.canceled) return null
    return result.filePaths[0]
  })

  ipcMain.handle('java:mojangVersions', async () => {
    return new Promise((resolve, reject) => {
      const url = 'https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json'
      https.get(url, res => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try {
            const json = JSON.parse(data)
            const platform = process.platform === 'win32' ? 'windows-x64'
              : process.platform === 'darwin' ? 'mac-os'
              : 'linux'
            const platformData = json[platform] ?? {}
            const versions: MojangJavaVersion[] = []
            for (const [component, arr] of Object.entries(platformData)) {
              const entries = arr as any[]
              if (entries.length === 0) continue
              const latest = entries[0]
              versions.push({
                component,
                majorVersion: latest.version.name.split('.')[0] === '1'
                  ? 8
                  : parseInt(latest.version.name.split('.')[0]),
                version: latest.version.name,
                released: latest.version.released ?? '',
                type: component.includes('jre') ? 'jre' : 'jdk',
              })
            }
            versions.sort((a, b) => b.majorVersion - a.majorVersion)
            resolve(versions)
          } catch (e) {
            reject(e)
          }
        })
      }).on('error', reject)
    })
  })

  ipcMain.handle('java:downloadMojang', async (_event, component: string) => {
  const platform = process.platform === 'win32' ? 'windows-x64'
    : process.platform === 'darwin' ? 'mac-os'
    : 'linux'

  const allJson = await new Promise<any>((resolve, reject) => {
    https.get('https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json', res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(JSON.parse(data)))
    }).on('error', reject)
  })

  const platformData = allJson[platform] ?? {}
  const entries = platformData[component] as any[]
  if (!entries || entries.length === 0) throw new Error('No download found for ' + component)

  const manifestUrl = entries[0].manifest.url
  const manifest = await new Promise<any>((resolve, reject) => {
    https.get(manifestUrl, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(JSON.parse(data)))
    }).on('error', reject)
  })

  const destDir = path.join(Paths.java, component)
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

  const files = Object.entries(manifest.files) as [string, any][]
  let done = 0

  for (const [filePath, fileData] of files) {
  const fullPath = path.join(destDir, filePath)

  if (fileData.type === 'directory') {
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true })
    done++
    continue
  }

  if (fileData.type === 'link') {
    try {
      const dir = path.dirname(fullPath)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
      fs.symlinkSync(fileData.target, fullPath)
    } catch {
      // symlinks may fail on Windows — skip
    }
    done++
    continue
  }

  const download = fileData.downloads?.raw
  if (!download) {
    done++
    continue
  }

  const dir = path.dirname(fullPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  try {
    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(fullPath)
      const request = https.get(download.url, res => {
        if (res.statusCode !== 200) {
          file.close()
          fs.unlink(fullPath, () => {})
          reject(new Error(`HTTP ${res.statusCode} for ${filePath}`))
          return
        }
        res.pipe(file)
        file.on('finish', () => {
          file.close()
          if (fileData.executable) {
            try { fs.chmodSync(fullPath, 0o755) } catch {}
          }
          resolve()
        })
        file.on('error', err => {
          fs.unlink(fullPath, () => {})
          reject(err)
        })
      })
      request.on('error', err => {
        file.close()
        fs.unlink(fullPath, () => {})
        reject(err)
      })
      request.setTimeout(30000, () => {
        request.destroy()
        reject(new Error(`Timeout downloading ${filePath}`))
      })
    })
  } catch (err) {
    console.error(`Failed to download ${filePath}:`, err)
    // continue with other files instead of failing completely
  }

  done++
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send('java:downloadProgress', {
      component,
      done,
      total: files.length,
      percent: Math.round((done / files.length) * 100),
    })
  })
  }
})
}