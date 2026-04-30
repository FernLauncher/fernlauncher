import { ipcMain } from 'electron'
import https from 'https'

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

export function registerVersionHandlers() {
  ipcMain.handle('versions:get', async () => {
    const manifest = await fetchJson(
      'https://launchermeta.mojang.com/mc/game/version_manifest_v2.json'
    )
    return manifest.versions.map((v: any) => ({
      id: v.id,
      type: v.type,
      releaseTime: v.releaseTime,
    }))
  })

  ipcMain.handle('versions:fabric', async (_event, mcVersion: string) => {
    try {
      const loaders = await fetchJson(
        `https://meta.fabricmc.net/v2/versions/loader/${mcVersion}`
      )
      return loaders.map((l: any) => ({
        version: l.loader.version,
        stable: l.loader.stable,
      }))
    } catch {
      return []
    }
  })

  ipcMain.handle('versions:quilt', async (_event, mcVersion: string) => {
    try {
      const loaders = await fetchJson(
        `https://meta.quiltmc.org/v3/versions/loader/${mcVersion}`
      )
      return loaders.map((l: any) => ({
        version: l.loader.version,
        stable: true,
      }))
    } catch {
      return []
    }
  })

  ipcMain.handle('versions:neoforge', async (_event, mcVersion: string) => {
  try {
    const data = await fetchJson(
      'https://maven.neoforged.net/api/maven/versions/releases/net/neoforged/neoforge'
    )
    const versions = data.versions as string[]
    const parts = mcVersion.split('.') // e.g. ['1', '21'] or ['1', '21', '1']
    const major = parts[1]             // '21'
    const patch = parts[2] ?? '0'     // '0' for 1.21, '1' for 1.21.1, '11' for 1.21.11

    const filtered = versions.filter((v: string) => {
      // NeoForge versions are like 21.0.x (for 1.21), 21.1.x (for 1.21.1), 21.11.x (for 1.21.11)
      const prefix = patch === '0' ? `${major}.0.` : `${major}.${patch}.`
      return v.startsWith(prefix)
    })

    return filtered.reverse().map((v: string) => ({
      version: v,
      stable: true,
    }))
  } catch {
    return []
  }
})

  ipcMain.handle('versions:forge', async (_event, mcVersion: string) => {
    try {
      const data = await fetchJson(
        'https://files.minecraftforge.net/net/minecraftforge/forge/maven-metadata.json'
      )
      const versions: string[] = data[mcVersion] ?? []
      return versions.reverse().map((v: string) => ({
        version: v,
        stable: true,
      }))
    } catch {
      return []
    }
  })
}