import { launchInstance, killInstance, isInstanceRunning } from '../services/launcher'
import fs from 'fs'
import path from 'path'
import { Paths } from '../utils/paths'
import { config } from '../utils/config'
import { instanceManager } from '../services/instanceManager'
import { ipcMain, BrowserWindow, shell, app, dialog } from 'electron'
import AdmZip from 'adm-zip'
import zlib from 'zlib'
import https from 'https'

// ─── NBT helpers for servers.dat ─────────────────────────────────────────────

function readNbtString(buf: Buffer, offset: number): { value: string, offset: number } {
  const len = buf.readUInt16BE(offset)
  offset += 2
  const value = buf.slice(offset, offset + len).toString('utf8')
  return { value, offset: offset + len }
}

function parseServersNbt(buf: Buffer): { name: string, ip: string, icon: string }[] {
  try {
    const decompressed = zlib.gunzipSync(buf)
    buf = decompressed
  } catch {
    // already uncompressed
  }

  const servers: { name: string, ip: string, icon: string }[] = []
  let offset = 0

  offset++ // root tag type (10 = compound)
  const rootNameLen = buf.readUInt16BE(offset); offset += 2
  offset += rootNameLen

  while (offset < buf.length) {
    const tagType = buf[offset++]
    if (tagType === 0) break
    const nameLen = buf.readUInt16BE(offset); offset += 2
    const name = buf.slice(offset, offset + nameLen).toString('utf8'); offset += nameLen

    if (name === 'servers' && tagType === 9) {
      buf[offset++]
      const listLen = buf.readInt32BE(offset); offset += 4
      for (let i = 0; i < listLen; i++) {
        const server: any = { name: '', ip: '', icon: '' }
        while (offset < buf.length) {
          const ft = buf[offset++]
          if (ft === 0) break
          const fl = buf.readUInt16BE(offset); offset += 2
          const fn = buf.slice(offset, offset + fl).toString('utf8'); offset += fl
          if (ft === 8) {
            const r = readNbtString(buf, offset); offset = r.offset
            if (fn === 'name') server.name = r.value
            else if (fn === 'ip') server.ip = r.value
            else if (fn === 'icon') server.icon = r.value
          } else {
            if (ft === 1) offset += 1
            else if (ft === 2) offset += 2
            else if (ft === 3) offset += 4
            else if (ft === 4) offset += 8
            else if (ft === 5) offset += 4
            else if (ft === 6) offset += 8
          }
        }
        servers.push(server)
      }
      break
    } else {
      if (tagType === 8) { const l = buf.readUInt16BE(offset); offset += 2 + l }
      else if (tagType === 1) offset += 1
      else if (tagType === 2) offset += 2
      else if (tagType === 3) offset += 4
      else if (tagType === 4) offset += 8
      else if (tagType === 5) offset += 4
      else if (tagType === 6) offset += 8
    }
  }
  return servers
}

function writeServersNbt(servers: { name: string, ip: string }[]): Buffer {
  const writeString = (s: string) => {
    const b = Buffer.from(s, 'utf8')
    const len = Buffer.alloc(2)
    len.writeUInt16BE(b.length)
    return Buffer.concat([len, b])
  }

  const serverBufs: Buffer[] = []
  for (const s of servers) {
    const namePay = Buffer.concat([Buffer.from([8]), writeString('name'), writeString(s.name)])
    const ipPay = Buffer.concat([Buffer.from([8]), writeString('ip'), writeString(s.ip)])
    serverBufs.push(Buffer.concat([namePay, ipPay, Buffer.from([0])]))
  }

  const listHeader = Buffer.alloc(5)
  listHeader[0] = 10
  listHeader.writeInt32BE(servers.length, 1)

  const listTag = Buffer.concat([
    Buffer.from([9]),
    writeString('servers'),
    listHeader,
    ...serverBufs,
  ])

  return Buffer.concat([
    Buffer.from([10]),
    writeString(''),
    listTag,
    Buffer.from([0]),
  ])
}

// ─── CurseForge helpers ───────────────────────────────────────────────────────

function cfLoaderType(loader: string): string {
  return loader === 'forge' ? '1' : loader === 'fabric' ? '4' : loader === 'neoforge' ? '6' : loader === 'quilt' ? '5' : '0'
}

function cfRequest(url: string, apiKey: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'x-api-key': apiKey, 'Accept': 'application/json' } }, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${data}`))
        try { resolve(JSON.parse(data)) }
        catch (e: any) { reject(new Error(`Invalid JSON: ${e.message}`)) }
      })
    }).on('error', reject)
  })
}

// ─── IPC handlers ─────────────────────────────────────────────────────────────

export function registerInstanceHandlers() {
  ipcMain.handle('instances:get', () => instanceManager.getAll())

  ipcMain.handle('instances:create', (_event, data: CreateInstanceData) => {
    const instance = instanceManager.create(data)
    BrowserWindow.getAllWindows().forEach(win => win.webContents.send('instances:updated'))
    return instance
  })

  ipcMain.handle('instances:delete', (_event, id: string) => {
    instanceManager.delete(id)
    BrowserWindow.getAllWindows().forEach(win => win.webContents.send('instances:updated'))
  })

  ipcMain.handle('instances:copy', (_event, id: string) => {
    const instance = instanceManager.copy(id)
    BrowserWindow.getAllWindows().forEach(win => win.webContents.send('instances:updated'))
    return instance
  })

  ipcMain.handle('instances:update', (_event, instance: Instance) => {
    instanceManager.update(instance)
    BrowserWindow.getAllWindows().forEach(win => win.webContents.send('instances:updated'))
  })

  ipcMain.handle('instances:launch', (_event, id: string) => launchInstance(id))
  ipcMain.handle('instances:kill', (_event, id: string) => killInstance(id))
  ipcMain.handle('instances:isRunning', (_event, id: string) => isInstanceRunning(id))

  ipcMain.handle('instance:listFolder', async (_event, instanceId: string, subPath: string) => {
    const dir = path.join(Paths.instances, instanceId, subPath)
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir)
  })

  ipcMain.handle('instance:openFolder', async (_event, instanceId: string, subPath: string) => {
    const dir = path.join(Paths.instances, instanceId, subPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    shell.openPath(dir)
  })

  ipcMain.handle('instance:deleteFile', async (_event, instanceId: string, subPath: string) => {
    const filePath = path.join(Paths.instances, instanceId, subPath)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  })

  ipcMain.handle('instance:downloadMod', async (_event, instanceId: string, downloadUrl: string, fileName: string) => {
    const modsDir = path.join(Paths.instances, instanceId, 'minecraft', 'mods')
    if (!fs.existsSync(modsDir)) fs.mkdirSync(modsDir, { recursive: true })
    const dest = path.join(modsDir, fileName)

    await new Promise<void>((resolve, reject) => {
      const makeRequest = (url: string, hops = 0) => {
        if (hops > 5) return reject(new Error('Too many redirects'))
        https.get(url, { headers: { 'User-Agent': 'Fernlaunch/1.0' } }, (res: any) => {
          if ([301, 302, 307, 308].includes(res.statusCode)) return makeRequest(res.headers.location, hops + 1)
          if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
          const file = fs.createWriteStream(dest)
          res.pipe(file)
          file.on('finish', () => { file.close(); resolve() })
          file.on('error', reject)
        }).on('error', reject)
      }
      makeRequest(downloadUrl)
    })

    return fileName
  })

  ipcMain.handle('instance:curseforgeSearch', async (_event, query: string, mcVersion: string, loader: string, classId: number, offset: number) => {
    const apiKey = config.store.services.curseforgeApiKey
    if (!apiKey) throw new Error('CurseForge API key not configured.')
    const params = new URLSearchParams({
      gameId: '432', searchFilter: query, gameVersion: mcVersion,
      classId: String(classId), modLoaderType: cfLoaderType(loader),
      index: String(offset), pageSize: '20', sortField: '2', sortOrder: 'desc',
    })
    return cfRequest(`https://api.curseforge.com/v1/mods/search?${params}`, apiKey)
  })

  ipcMain.handle('instance:curseforgeGetFiles', async (_event, modId: number, mcVersion: string, loader: string) => {
    const apiKey = config.store.services.curseforgeApiKey
    if (!apiKey) throw new Error('CurseForge API key not configured.')
    const params = new URLSearchParams({
      gameVersion: mcVersion, modLoaderType: cfLoaderType(loader), pageSize: '20',
    })
    return cfRequest(`https://api.curseforge.com/v1/mods/${modId}/files?${params}`, apiKey)
  })

  ipcMain.handle('instance:getServers', async (_event, instanceId: string) => {
    const serversPath = path.join(Paths.instances, instanceId, 'minecraft', 'servers.dat')
    if (!fs.existsSync(serversPath)) return []
    try { return parseServersNbt(fs.readFileSync(serversPath)) }
    catch { return [] }
  })

  ipcMain.handle('instance:addServer', async (_event, instanceId: string, name: string, ip: string) => {
    const serversPath = path.join(Paths.instances, instanceId, 'minecraft', 'servers.dat')
    const mcDir = path.join(Paths.instances, instanceId, 'minecraft')
    if (!fs.existsSync(mcDir)) fs.mkdirSync(mcDir, { recursive: true })
    let servers: { name: string, ip: string }[] = []
    if (fs.existsSync(serversPath)) {
      try { servers = parseServersNbt(fs.readFileSync(serversPath)) } catch {}
    }
    servers.push({ name, ip })
    const buf = writeServersNbt(servers)
    console.log('[servers.dat] First 4 bytes:', buf[0].toString(16), buf[1].toString(16), buf[2].toString(16), buf[3].toString(16))
    fs.writeFileSync(serversPath, buf)
  })

  ipcMain.handle('instance:removeServer', async (_event, instanceId: string, index: number) => {
    const serversPath = path.join(Paths.instances, instanceId, 'minecraft', 'servers.dat')
    if (!fs.existsSync(serversPath)) return
    try {
      const servers = parseServersNbt(fs.readFileSync(serversPath))
      servers.splice(index, 1)
      fs.writeFileSync(serversPath, writeServersNbt(servers))
    } catch {}
  })

  ipcMain.handle('instance:downloadFile', async (_event, instanceId: string, downloadUrl: string, fileName: string, subFolder: string) => {
    const destDir = path.join(Paths.instances, instanceId, 'minecraft', subFolder)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })
    const dest = path.join(destDir, fileName)

    await new Promise<void>((resolve, reject) => {
      const makeRequest = (url: string, hops = 0) => {
        if (hops > 5) return reject(new Error('Too many redirects'))
        https.get(url, { headers: { 'User-Agent': 'Fernlaunch/1.0' } }, (res: any) => {
          if ([301, 302, 307, 308].includes(res.statusCode)) return makeRequest(res.headers.location, hops + 1)
          if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
          const file = fs.createWriteStream(dest)
          res.pipe(file)
          file.on('finish', () => { file.close(); resolve() })
          file.on('error', reject)
        }).on('error', reject)
      }
      makeRequest(downloadUrl)
    })

    return fileName
  })

  ipcMain.handle('instance:createShortcut', async (_event, instanceId: string) => {
    const instance = instanceManager.getAll().find(i => i.id === instanceId)
    if (!instance) return

    const { filePath } = await dialog.showSaveDialog({
      title: 'Create Shortcut',
      defaultPath: path.join(app.getPath('desktop'), `${instance.name}.lnk`),
      filters: [{ name: 'Shortcut', extensions: ['lnk'] }],
    })

    if (!filePath) return

    // In production, process.execPath is the app exe
    // In dev, we can't easily create a working shortcut
    if (app.isPackaged) {
      shell.writeShortcutLink(filePath, {
        target: process.execPath,
        description: `Launch ${instance.name} via Fernlaunch`,
      })
    } else {
      dialog.showMessageBox({
        type: 'info',
        message: 'Shortcuts can only be created in the packaged app, not in dev mode.',
      })
    }
  })

  ipcMain.handle('instance:export', async (_event, instanceId: string) => {
    const instance = instanceManager.getAll().find(i => i.id === instanceId)
    if (!instance) return

    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Instance',
      defaultPath: `${instance.name}.fernpack`,
      filters: [{ name: 'Fernlaunch Pack', extensions: ['fernpack'] }],
    })

    if (!filePath) return

    const instancePath = path.join(Paths.instances, instanceId)
    const zip = new AdmZip()
    zip.addLocalFolder(instancePath)
    zip.writeZip(filePath)
  })

  ipcMain.handle('instance:import', async (_event, filePath: string) => {
    const zip = new AdmZip(filePath)
    const instanceJson = zip.readAsText('instance.json')
    if (!instanceJson) throw new Error('Invalid fernpack file')
    
    const instance: Instance = JSON.parse(instanceJson)
    const newId = Date.now().toString(36) + Math.random().toString(36).slice(2)
    instance.id = newId
    instance.name = instance.name + ' (Imported)'
    
    const newPath = path.join(Paths.instances, newId)
    fs.mkdirSync(newPath, { recursive: true })
    zip.extractAllTo(newPath, true)
    
    // Update instance.json with new id
    fs.writeFileSync(path.join(newPath, 'instance.json'), JSON.stringify(instance, null, 2))
    
    BrowserWindow.getAllWindows().forEach(win => win.webContents.send('instances:updated'))
  })

  ipcMain.handle('dialog:openFile', async (_event, options: any) => {
    return dialog.showOpenDialog(options)
  })

  ipcMain.handle('instance:setIcon', async (_event, instanceId: string) => {
    const { filePaths } = await dialog.showOpenDialog({
      title: 'Choose Instance Icon',
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif'] }],
      properties: ['openFile'],
    })
    if (!filePaths?.[0]) return null

    const ext = path.extname(filePaths[0])
    const iconDir = path.join(Paths.instances, instanceId)
    const iconPath = path.join(iconDir, `icon${ext}`)
    fs.copyFileSync(filePaths[0], iconPath)

    // Update instance
    const instance = instanceManager.getAll().find(i => i.id === instanceId)
    if (instance) {
      instance.icon = `icon${ext}`
      instanceManager.update(instance)
      BrowserWindow.getAllWindows().forEach(win => win.webContents.send('instances:updated'))
    }

    return iconPath
  })

  ipcMain.handle('instance:getIconPath', (_event, instanceId: string, iconFile: string) => {
    return path.join(Paths.instances, instanceId, iconFile)
  })

  ipcMain.handle('instance:getIconData', async (_event, instanceId: string, iconFile: string) => {
    const iconPath = path.join(Paths.instances, instanceId, iconFile)
    if (!fs.existsSync(iconPath)) return null
    const data = fs.readFileSync(iconPath)
    const ext = path.extname(iconFile).slice(1).replace('jpg', 'jpeg')
    return `data:image/${ext};base64,${data.toString('base64')}`
  })

  ipcMain.handle('instance:getScreenshot', async (_event, instanceId: string, fileName: string) => {
    const filePath = path.join(Paths.instances, instanceId, 'minecraft', 'screenshots', fileName)
    if (!fs.existsSync(filePath)) return null
    const data = fs.readFileSync(filePath)
    const ext = path.extname(fileName).slice(1).replace('jpg', 'jpeg')
    return `data:image/${ext};base64,${data.toString('base64')}`
  })

  ipcMain.handle('instance:openFile', async (_event, instanceId: string, subPath: string) => {
    const filePath = path.join(Paths.instances, instanceId, subPath)
    shell.openPath(filePath)
  })

  ipcMain.handle('instance:readLog', async (_event, instanceId: string) => {
    const logPath = path.join(Paths.instances, instanceId, 'minecraft', 'logs', 'latest.log')
    if (!fs.existsSync(logPath)) return ''
    return fs.readFileSync(logPath, 'utf-8')
  })

  ipcMain.handle('instance:watchLog', async (_event, instanceId: string) => {
    const logPath = path.join(Paths.instances, instanceId, 'minecraft', 'logs', 'latest.log')
    if (!fs.existsSync(logPath)) return

    const win = BrowserWindow.getAllWindows().find(w => 
      w.webContents.getURL().includes(`instanceId=${instanceId}`) &&
      w.webContents.getURL().includes('instanceEditor')
    )
    if (!win) return

    const watcher = fs.watch(logPath, () => {
      if (!fs.existsSync(logPath)) return
      const content = fs.readFileSync(logPath, 'utf-8')
      win.webContents.send('instance:logUpdated', content)
    })

    win.on('closed', () => watcher.close())
  })
  

  ipcMain.handle('instance:installModrinthModpack', async (event, versionId: string, instanceName: string, group: string) => {
    const https = await import('https')
    const senderWin = BrowserWindow.fromWebContents(event.sender)
    const sendProgress = (msg: string) => senderWin?.webContents.send('modpack:progress', msg)
    
    // Fetch version info
    sendProgress('Fetching modpack info...')
    const versionData: any = await new Promise((resolve, reject) => {
      https.default.get(
        `https://api.modrinth.com/v2/version/${versionId}`,
        { headers: { 'User-Agent': 'Fernlaunch/1.0' } },
        res => {
          let data = ''
          res.on('data', (chunk: any) => data += chunk)
          res.on('end', () => resolve(JSON.parse(data)))
        }
      ).on('error', reject)
    })

    const mrpackFile = versionData.files.find((f: any) => f.primary) ?? versionData.files[0]
    
    // Download .mrpack
    sendProgress('Downloading modpack...')
    const tempPath = path.join(Paths.java, `temp_${Date.now()}.mrpack`)
    await new Promise<void>((resolve, reject) => {
      const makeRequest = (url: string, hops = 0) => {
        if (hops > 5) return reject(new Error('Too many redirects'))
        https.default.get(url, { headers: { 'User-Agent': 'Fernlaunch/1.0' } }, (res: any) => {
          if ([301, 302, 307, 308].includes(res.statusCode)) return makeRequest(res.headers.location, hops + 1)
          if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
          const file = fs.createWriteStream(tempPath)
          res.pipe(file)
          file.on('finish', () => { file.close(); resolve() })
          file.on('error', reject)
        }).on('error', reject)
      }
      makeRequest(mrpackFile.url)
    })

    // Parse mrpack (it's a zip)
    const zip = new AdmZip(tempPath)
    const indexJson = JSON.parse(zip.readAsText('modrinth.index.json'))
    sendProgress(`Installing ${indexJson.name}...`)
    const mcVersion = indexJson.dependencies['minecraft']
    const fabricVersion = indexJson.dependencies['fabric-loader']
    const quiltVersion = indexJson.dependencies['quilt-loader']
    const forgeVersion = indexJson.dependencies['forge']
    const neoforgeVersion = indexJson.dependencies['neoforge']

    const modLoader = fabricVersion ? 'fabric' : quiltVersion ? 'quilt' : forgeVersion ? 'forge' : neoforgeVersion ? 'neoforge' : 'none'
    const modLoaderVersion = fabricVersion ?? quiltVersion ?? forgeVersion ?? neoforgeVersion ?? ''

    // Create instance
    const instance = instanceManager.create({
      name: instanceName || indexJson.name,
      version: mcVersion,
      modLoader: modLoader as any,
      modLoaderVersion,
      group,
      icon: 'default',
    })

    const modsDir = path.join(Paths.instances, instance.id, 'minecraft', 'mods')
    fs.mkdirSync(modsDir, { recursive: true })

    // Extract overrides folder if exists
    for (const entry of zip.getEntries()) {
      if (entry.entryName.startsWith('overrides/')) {
        const destPath = path.join(Paths.instances, instance.id, 'minecraft', entry.entryName.replace('overrides/', ''))
        if (entry.isDirectory) {
          fs.mkdirSync(destPath, { recursive: true })
        } else {
          fs.mkdirSync(path.dirname(destPath), { recursive: true })
          zip.extractEntryTo(entry, path.dirname(destPath), false, true)
        }
      }
    }

    // Download files
    const manualFiles: { name: string, url?: string }[] = []
  
    for (const file of indexJson.files ?? []) {
      const clientEnv = file.env?.client
      if (clientEnv === 'unsupported') continue

      const destPath = path.join(Paths.instances, instance.id, 'minecraft', file.path)
      fs.mkdirSync(path.dirname(destPath), { recursive: true })
      sendProgress(`Downloading ${path.basename(file.path)}...`)
      if (file.downloads?.length) {
        try {
          await new Promise<void>((resolve, reject) => {
            const makeRequest = (url: string, hops = 0) => {
              if (hops > 5) return reject(new Error('Too many redirects'))
              https.default.get(url, { headers: { 'User-Agent': 'Fernlaunch/1.0' } }, (res: any) => {
                if ([301, 302, 307, 308].includes(res.statusCode)) return makeRequest(res.headers.location, hops + 1)
                if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
                const f = fs.createWriteStream(destPath)
                res.pipe(f)
                f.on('finish', () => { f.close(); resolve() })
                f.on('error', reject)
              }).on('error', reject)
            }
            makeRequest(file.downloads[0])
          })
        } catch {
          manualFiles.push({ name: path.basename(file.path), url: file.downloads[0] })
        }
      } else {
        manualFiles.push({ name: path.basename(file.path) })
      }
    }

    fs.unlinkSync(tempPath)
    BrowserWindow.getAllWindows().forEach(win => win.webContents.send('instances:updated'))

    return { instance, manualFiles }
  })

  ipcMain.handle('open:external', (_event, url: string) => shell.openExternal(url))

  ipcMain.handle('instance:checkManualFiles', async (_event, instanceId: string, fileNames: string[], downloadsPath: string) => {
    const found: string[] = []
    const modsDir = path.join(Paths.instances, instanceId, 'minecraft', 'mods')
    fs.mkdirSync(modsDir, { recursive: true })
    
    for (const fileName of fileNames) {
      const downloadedFile = path.join(downloadsPath, fileName)
      if (fs.existsSync(downloadedFile)) {
        fs.copyFileSync(downloadedFile, path.join(modsDir, fileName))
        found.push(fileName)
      }
    }
    return found
  })

  ipcMain.handle('get:downloadsPath', () => app.getPath('downloads'))

  ipcMain.handle('instance:installCurseForgeModpack', async (event, fileId: number, projectId: number, instanceName: string, group: string) => {
    const senderWin = BrowserWindow.fromWebContents(event.sender)
    const sendProgress = (msg: string) => senderWin?.webContents.send('modpack:progress', msg)

    sendProgress('Fetching modpack info...')
    const apiKey = config.store.services.curseforgeApiKey

    // Get file info
    const fileData: any = await cfRequest(`https://api.curseforge.com/v1/mods/${projectId}/files/${fileId}`, apiKey)
    const file = fileData.data

    sendProgress('Downloading modpack...')
    const tempPath = path.join(Paths.java, `temp_${Date.now()}.zip`)

    if (!file.downloadUrl) throw new Error('This modpack file has no download URL (blocked by CurseForge).')

    await new Promise<void>((resolve, reject) => {
      const makeRequest = (url: string, hops = 0) => {
        if (hops > 5) return reject(new Error('Too many redirects'))
        https.get(url, { headers: { 'User-Agent': 'Fernlaunch/1.0' } }, (res: any) => {
          if ([301, 302, 307, 308].includes(res.statusCode)) return makeRequest(res.headers.location, hops + 1)
          if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
          const f = fs.createWriteStream(tempPath)
          res.pipe(f)
          f.on('finish', () => { f.close(); resolve() })
          f.on('error', reject)
        }).on('error', reject)
      }
      makeRequest(file.downloadUrl)
    })

    // Parse manifest
    const zip = new AdmZip(tempPath)
    const manifest = JSON.parse(zip.readAsText('manifest.json'))

    const mcVersion = manifest.minecraft?.version
    const modLoaderRaw = manifest.minecraft?.modLoaders?.find((l: any) => l.primary)?.id ?? ''
    const modLoader = modLoaderRaw.startsWith('fabric-') ? 'fabric'
      : modLoaderRaw.startsWith('quilt-') ? 'quilt'
      : modLoaderRaw.startsWith('neoforge-') ? 'neoforge'
      : modLoaderRaw.startsWith('forge-') ? 'forge'
      : 'none'
    const modLoaderVersion = modLoaderRaw.split('-').slice(1).join('-')

    // Create instance
    const instance = instanceManager.create({
      name: instanceName || manifest.name,
      version: mcVersion,
      modLoader: modLoader as any,
      modLoaderVersion,
      group,
      icon: 'default',
    })

    const modsDir = path.join(Paths.instances, instance.id, 'minecraft', 'mods')
    fs.mkdirSync(modsDir, { recursive: true })

    // Extract overrides
    for (const entry of zip.getEntries()) {
      if (entry.entryName.startsWith('overrides/')) {
        const destPath = path.join(Paths.instances, instance.id, 'minecraft', entry.entryName.replace('overrides/', ''))
        if (entry.isDirectory) {
          fs.mkdirSync(destPath, { recursive: true })
        } else {
          fs.mkdirSync(path.dirname(destPath), { recursive: true })
          zip.extractEntryTo(entry, path.dirname(destPath), false, true)
        }
      }
    }

    fs.unlinkSync(tempPath)

    // Download mods
    const manualFiles: { name: string, url?: string }[] = []
    const mods = manifest.files ?? []

    for (const mod of mods) {
      if (mod.required === false) continue
      sendProgress(`Fetching mod ${mod.fileID}...`)
      try {
        const modFileData: any = await cfRequest(
          `https://api.curseforge.com/v1/mods/${mod.projectID}/files/${mod.fileID}`,
          apiKey
        )
        const modFile = modFileData.data
        const destPath = path.join(modsDir, modFile.fileName)

        if (modFile.downloadUrl) {
          sendProgress(`Downloading ${modFile.fileName}...`)
          await new Promise<void>((resolve, reject) => {
            const makeRequest = (url: string, hops = 0) => {
              if (hops > 5) return reject(new Error('Too many redirects'))
              https.get(url, { headers: { 'User-Agent': 'Fernlaunch/1.0' } }, (res: any) => {
                if ([301, 302, 307, 308].includes(res.statusCode)) return makeRequest(res.headers.location, hops + 1)
                if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
                const f = fs.createWriteStream(destPath)
                res.pipe(f)
                f.on('finish', () => { f.close(); resolve() })
                f.on('error', reject)
              }).on('error', reject)
            }
            makeRequest(modFile.downloadUrl)
          })
        } else {
          try {
            const projectData: any = await cfRequest(`https://api.curseforge.com/v1/mods/${mod.projectID}`, apiKey)
            const slug = projectData.data?.slug ?? String(mod.projectID)
            const pageUrl = `https://www.curseforge.com/minecraft/mc-mods/${slug}/files/${mod.fileID}`
            manualFiles.push({ name: modFile.fileName, url: pageUrl })
          } catch {
            manualFiles.push({ name: modFile.fileName })
          }
        }
      } catch (e) {
        console.warn(`Failed to get mod ${mod.fileID}:`, e)
        manualFiles.push({ name: `mod-${mod.fileID}.jar` })
      }
    }

    BrowserWindow.getAllWindows().forEach(w => w.webContents.send('instances:updated'))
    return { instance, manualFiles }
  })

  ipcMain.handle('instance:cfModpackSearch', async (_event, query: string, offset: number) => {
    const apiKey = config.store.services.curseforgeApiKey
    if (!apiKey) throw new Error('CurseForge API key not configured.')
    const params = new URLSearchParams({
      gameId: '432',
      classId: '4471',
      searchFilter: query,
      index: String(offset),
      pageSize: '20',
      sortField: '2',
      sortOrder: 'desc',
    })
    return cfRequest(`https://api.curseforge.com/v1/mods/search?${params}`, apiKey)
  })

  ipcMain.handle('instance:cfModpackFiles', async (_event, modId: number) => {
    const apiKey = config.store.services.curseforgeApiKey
    if (!apiKey) throw new Error('CurseForge API key not configured.')
    const params = new URLSearchParams({
      pageSize: '20',
      sortField: '1',
      sortOrder: 'desc',
    })
    return cfRequest(`https://api.curseforge.com/v1/mods/${modId}/files?${params}`, apiKey)
  })
}