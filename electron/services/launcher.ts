import { spawn, ChildProcess } from 'child_process'
import { BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import https from 'https'
import AdmZip from 'adm-zip'
import { Paths } from '../utils/paths'
import { javaManager } from './javaManager'
import { accountManager } from './auth/accounts'
import { instanceManager } from './instanceManager'
import { config } from '../utils/config'
import { BrowserWindow, app } from 'electron'

const activeProcesses = new Map<string, ChildProcess>()
const instanceStartTimes = new Map<string, number>()
const consoleWindows = new Map<string, BrowserWindow>()

export function registerConsoleWindow(instanceId: string, win: BrowserWindow) {
  consoleWindows.set(instanceId, win)
  win.on('closed', () => consoleWindows.delete(instanceId))
}

// ─── HTTP helpers ────────────────────────────────────────────────────────────

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const makeRequest = (currentUrl: string, hops = 0) => {
      if (hops > 5) return reject(new Error('Too many redirects'))
      https.get(currentUrl, res => {
        if ([301, 302, 307, 308].includes(res.statusCode!)) {
          const next = res.headers.location
          if (!next) return reject(new Error('Redirect with no location'))
          return makeRequest(next.startsWith('http') ? next : new URL(next, currentUrl).toString(), hops + 1)
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${currentUrl}`))
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try { resolve(JSON.parse(data)) }
          catch { reject(new Error(`Invalid JSON from ${currentUrl}: ${data.substring(0, 100)}`)) }
        })
      }).on('error', reject)
    }
    makeRequest(url)
  })
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) return resolve()
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    const makeRequest = (currentUrl: string, hops = 0) => {
      if (hops > 5) return reject(new Error('Too many redirects'))
      https.get(currentUrl, res => {
        if ([301, 302, 307, 308].includes(res.statusCode!)) {
          const next = res.headers.location
          if (!next) return reject(new Error('Redirect with no location'))
          return makeRequest(next.startsWith('http') ? next : new URL(next, currentUrl).toString(), hops + 1)
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${currentUrl}`))
        const file = fs.createWriteStream(dest)
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
        file.on('error', err => { fs.unlink(dest, () => {}); reject(err) })
      }).on('error', err => { fs.unlink(dest, () => {}); reject(err) })
    }
    makeRequest(url)
  })
}

// ─── IPC helpers ─────────────────────────────────────────────────────────────

function sendLog(instanceId: string, line: string) {
  consoleWindows.get(instanceId)?.webContents.send('instance:log', { instanceId, line })
}

function sendStatus(instanceId: string, status: string) {
  consoleWindows.get(instanceId)?.webContents.send('instance:status', { instanceId, status })
}

function broadcastToAll(channel: string, data: any) {
  BrowserWindow.getAllWindows().forEach(win => win.webContents.send(channel, data))
}

// ─── Mod loader helpers ───────────────────────────────────────────────────────

async function applyFabric(mcVersion: string, loaderVersion: string, classpath: string[], librariesDir: string): Promise<string> {
  const profile = await fetchJson(`https://meta.fabricmc.net/v2/versions/loader/${mcVersion}/${loaderVersion}/profile/json`)
  for (const lib of profile.libraries) {
    const [groupId, artifactId, version] = lib.name.split(':')
    const group = groupId.replace(/\./g, '/')
    const fileName = `${artifactId}-${version}.jar`
    const libPath = path.join(librariesDir, group, artifactId, version, fileName)
    const url = lib.url
      ? `${lib.url}${group}/${artifactId}/${version}/${fileName}`
      : `https://maven.fabricmc.net/${group}/${artifactId}/${version}/${fileName}`
    await downloadFile(url, libPath)
    classpath.unshift(libPath)
  }
  return profile.mainClass
}

async function applyQuilt(mcVersion: string, loaderVersion: string, classpath: string[], librariesDir: string): Promise<string> {
  const profile = await fetchJson(`https://meta.quiltmc.org/v3/versions/loader/${mcVersion}/${loaderVersion}/profile/json`)
  for (const lib of profile.libraries) {
    const [groupId, artifactId, version] = lib.name.split(':')
    const group = groupId.replace(/\./g, '/')
    const fileName = `${artifactId}-${version}.jar`
    const libPath = path.join(librariesDir, group, artifactId, version, fileName)
    const url = lib.url
      ? `${lib.url}${group}/${artifactId}/${version}/${fileName}`
      : `https://maven.quiltmc.org/repository/release/${group}/${artifactId}/${version}/${fileName}`
    await downloadFile(url, libPath)
    classpath.unshift(libPath)
  }
  return profile.mainClass
}

function ensureFakeLauncherProfiles(mcDir: string) {
  const profilesPath = path.join(mcDir, 'launcher_profiles.json')
  if (!fs.existsSync(profilesPath)) {
    fs.writeFileSync(profilesPath, JSON.stringify({
      profiles: {},
      selectedProfile: null,
      clientToken: 'fernlaunch',
      authenticationDatabase: {},
      launcherVersion: { name: '2.0', format: 21 },
    }, null, 2))
  }
}

function runInstaller(javaPath: string, installerPath: string, mcDir: string, label: string, args?: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const installerArgs = args ?? ['-jar', installerPath, '--installClient', mcDir]
    const proc = spawn(javaPath, installerArgs, { cwd: mcDir })
    proc.stdout?.on('data', (d: Buffer) => console.log(`[${label}]`, d.toString().trim()))
    proc.stderr?.on('data', (d: Buffer) => console.log(`[${label}]`, d.toString().trim()))
    proc.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`${label} exited with code ${code}`))
    })
    proc.on('error', reject)
  })
}

interface NeoForgeResult {
  mainClass: string
  gameArgs: string[]
  jvmArgs: string[]
  neoClasspath: string[]
}

async function applyNeoForge(
  mcVersion: string,
  loaderVersion: string,
  librariesDir: string,
  javaPath: string
): Promise<NeoForgeResult> {
  const mcDir = path.join(librariesDir, '..')
  const mavenBase = 'https://maven.neoforged.net/releases'
  const installerPath = path.join(librariesDir, 'net/neoforged/neoforge', loaderVersion, `neoforge-${loaderVersion}-installer.jar`)
  const versionJsonPath = path.join(mcDir, 'versions', `neoforge-${loaderVersion}`, `neoforge-${loaderVersion}.json`)

  

  // Download installer
  await downloadFile(`${mavenBase}/net/neoforged/neoforge/${loaderVersion}/neoforge-${loaderVersion}-installer.jar`, installerPath)

  // Copy vanilla client where installer expects it
  const vanillaSrc = path.join(mcDir, 'versions', mcVersion, `${mcVersion}.jar`)
  const vanillaDest = path.join(librariesDir, 'net/minecraft/client', mcVersion, `client-${mcVersion}.jar`)
  if (fs.existsSync(vanillaSrc) && !fs.existsSync(vanillaDest)) {
    fs.mkdirSync(path.dirname(vanillaDest), { recursive: true })
    fs.copyFileSync(vanillaSrc, vanillaDest)
  }

  // Run installer if not already done
  if (!fs.existsSync(versionJsonPath)) {
    ensureFakeLauncherProfiles(mcDir)
    await runInstaller(javaPath, installerPath, mcDir, 'NeoForge Installer')
  }

  const versionProfile = JSON.parse(fs.readFileSync(versionJsonPath, 'utf-8'))

  // Build NeoForge classpath
  const neoClasspath: string[] = []

  // Add NeoForge libraries
  for (const lib of versionProfile.libraries ?? []) {
    if (!lib.downloads?.artifact) continue
    const artifact = lib.downloads.artifact
    const libPath = path.join(librariesDir, artifact.path)
    await downloadFile(artifact.url, libPath)
    if (fs.existsSync(libPath)) neoClasspath.push(libPath)
  }

  const patchedClient = path.join(librariesDir, 'net/neoforged/minecraft-client-patched', loaderVersion, `minecraft-client-patched-${loaderVersion}.jar`)
    if (fs.existsSync(patchedClient)) {
    const pzip = new AdmZip(patchedClient)
    const hasUndashedUuid = pzip.getEntries().some(e => e.entryName.includes('UndashedUuid'))
    const hasGameProfile = pzip.getEntries().some(e => e.entryName.includes('GameProfile'))
    console.log('[Patched client] UndashedUuid:', hasUndashedUuid, '| GameProfile:', hasGameProfile)
    console.log('[Patched client] authlib entries:', pzip.getEntries().filter(e => e.entryName.includes('mojang/authlib') || e.entryName.includes('mojang/util')).map(e => e.entryName).slice(0, 10))
    }

    const uzip = new AdmZip(path.join(librariesDir, 'net/neoforged/neoforge', loaderVersion, `neoforge-${loaderVersion}-universal.jar`))
const metaInf = uzip.getEntries().filter(e => e.entryName.startsWith('META-INF') || e.entryName.includes('authlib') || e.entryName.includes('MANIFEST'))
console.log('[Universal JAR entries]', metaInf.map(e => e.entryName))
const manifest = uzip.readAsText('META-INF/MANIFEST.MF')
console.log('[Universal MANIFEST]', manifest)

  // Extract and add authlib from installer if present
  const zip = new AdmZip(installerPath)
  for (const entry of zip.getEntries()) {
    console.log('[Installer entry]', entry.entryName)
    if (entry.entryName.includes('authlib') && entry.entryName.endsWith('.jar')) {
      const authlibPath = path.join(librariesDir, entry.entryName.replace('maven/', ''))
      if (!fs.existsSync(authlibPath)) {
        fs.mkdirSync(path.dirname(authlibPath), { recursive: true })
        zip.extractEntryTo(entry, path.dirname(authlibPath), false, true)
      }
      if (!neoClasspath.includes(authlibPath)) neoClasspath.unshift(authlibPath)
      break
    }
  }

  return {
    mainClass: versionProfile.mainClass ?? 'net.neoforged.fml.startup.Client',
    gameArgs: (versionProfile.arguments?.game ?? []).filter((a: any) => typeof a === 'string'),
    jvmArgs: (versionProfile.arguments?.jvm ?? []).filter((a: any) => typeof a === 'string'),
    neoClasspath,
  }
}

async function applyForge(
  mcVersion: string,
  loaderVersion: string,
  classpath: string[],
  librariesDir: string,
  javaPath: string
): Promise<{ mainClass: string, gameArgs: string[], jvmArgs: string[] }> {
  const mcDir = path.join(librariesDir, '..')
  const fullVersion = loaderVersion.includes(mcVersion) ? loaderVersion : `${mcVersion}-${loaderVersion}`
  const mavenBase = 'https://maven.minecraftforge.net'
  const installerPath = path.join(librariesDir, 'net/minecraftforge/forge', fullVersion, `forge-${fullVersion}-installer.jar`)
  const versionsDir = path.join(mcDir, 'versions')

  await downloadFile(`${mavenBase}/net/minecraftforge/forge/${fullVersion}/forge-${fullVersion}-installer.jar`, installerPath)

  ensureFakeLauncherProfiles(mcDir)
  if (!fs.existsSync(versionsDir)) fs.mkdirSync(versionsDir, { recursive: true })

  const forgeVersion = loaderVersion.split('-').pop()!
  const findForgeDir = () => fs.readdirSync(versionsDir)
    .find(d => d.toLowerCase().includes('forge') && d.includes(forgeVersion))

  let versionId = findForgeDir()

  const zip = new AdmZip(installerPath)
  const isOldInstaller = zip.getEntries().some(e => e.entryName.includes('SimpleInstaller'))

  if (!versionId) {
    if (isOldInstaller) {
      const installProfile = JSON.parse(zip.readAsText('install_profile.json'))
      const versionJson = installProfile.versionInfo
      const forgeVersionId = versionJson.id as string

      const forgeVersionDir = path.join(versionsDir, forgeVersionId)
      fs.mkdirSync(forgeVersionDir, { recursive: true })
      fs.writeFileSync(path.join(forgeVersionDir, `${forgeVersionId}.json`), JSON.stringify(versionJson, null, 2))

      for (const entry of zip.getEntries()) {
        if (!entry.entryName.startsWith('maven/')) continue
        const dest = path.join(librariesDir, entry.entryName.replace('maven/', ''))
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(path.dirname(dest), { recursive: true })
          zip.extractEntryTo(entry, path.dirname(dest), false, true)
        }
      }

      for (const lib of versionJson.libraries ?? []) {
        if (lib.clientreq === false) continue
        const parts = lib.name.split(':')
        const group = parts[0].replace(/\./g, '/')
        const artifact = parts[1]
        const version = parts[2]
        const fileName = `${artifact}-${version}.jar`
        const libPath = path.join(librariesDir, group, artifact, version, fileName)
        if (!fs.existsSync(libPath)) {
          const baseUrl = lib.url ?? 'https://libraries.minecraft.net/'
          try {
            await downloadFile(`${baseUrl}${group}/${artifact}/${version}/${fileName}`, libPath)
          } catch {
            try {
              await downloadFile(`${mavenBase}/${group}/${artifact}/${version}/${fileName}`, libPath)
            } catch {
              console.warn(`[Forge] Could not download library: ${lib.name}`)
            }
          }
        }
      }

      versionId = findForgeDir()
    } else {
      await runInstaller(javaPath, installerPath, mcDir, 'Forge Installer')
      versionId = findForgeDir()
    }
  }

  if (!versionId) throw new Error('Could not find Forge version directory after installation')

  const versionJsonPath = path.join(versionsDir, versionId, `${versionId}.json`)
  const versionProfile = JSON.parse(fs.readFileSync(versionJsonPath, 'utf-8'))

  // Add libraries to classpath — old and new format differ
if (isOldInstaller) {
  for (const lib of versionProfile.libraries ?? []) {
    const parts = lib.name.split(':')
    const group = parts[0].replace(/\./g, '/')
    const artifact = parts[1]
    const version = parts[2]
    const isForgeLib = group.includes('minecraftforge') && artifact === 'forge'
    const jarName = isForgeLib ? `${artifact}-${version}-universal.jar` : `${artifact}-${version}.jar`
    const libPath = path.join(librariesDir, group, artifact, version, jarName)

    if (!fs.existsSync(libPath) && !isForgeLib) {
      const urls = [
        lib.url ? `${lib.url}${group}/${artifact}/${version}/${jarName}` : null,
        `https://libraries.minecraft.net/${group}/${artifact}/${version}/${jarName}`,
        `https://maven.minecraftforge.net/${group}/${artifact}/${version}/${jarName}`,
      ].filter(Boolean) as string[]

      for (const url of urls) {
        try {
          await downloadFile(url, libPath)
          break
        } catch (e) {
          console.warn(`[Forge] Failed: ${url}`)
        }
      }
    }

    if (fs.existsSync(libPath)) classpath.unshift(libPath)
    else console.warn(`[Forge] Missing lib: ${lib.name}`)
  }
}
  console.log('[Forge versionProfile libs]', JSON.stringify(versionProfile.libraries?.slice(0, 3), null, 2))

  return {
    mainClass: versionProfile.mainClass ?? 'net.minecraftforge.bootstrap.ForgeBootstrap',
    gameArgs: versionProfile.arguments?.game
      ? (versionProfile.arguments.game).filter((a: any) => typeof a === 'string')
      : (versionProfile.minecraftArguments?.split(' ') ?? []),
    jvmArgs: (versionProfile.arguments?.jvm ?? []).filter((a: any) => typeof a === 'string'),
  }
}

// ─── OS helper ───────────────────────────────────────────────────────────────

function currentOs() {
  return process.platform === 'win32' ? 'windows' : process.platform === 'darwin' ? 'osx' : 'linux'
}

function replaceVars(args: string[], vars: Record<string, string>): string[] {
  return args.map(arg => {
    for (const [k, v] of Object.entries(vars)) {
      arg = arg.replace(new RegExp(`\\$\\{${k}\\}`, 'g'), v)
    }
    return arg
  })
}

// ─── Main launch function ─────────────────────────────────────────────────────

export async function launchInstance(instanceId: string): Promise<void> {
  if (activeProcesses.has(instanceId)) throw new Error('Instance is already running!')

  const instancePath = path.join(Paths.instances, instanceId)
  const instanceJson = path.join(instancePath, 'instance.json')
  if (!fs.existsSync(instanceJson)) throw new Error('Instance not found')

  const instance: Instance = JSON.parse(fs.readFileSync(instanceJson, 'utf-8'))
  const mcDir = path.join(instancePath, 'minecraft')
  const cfg = config.store
  const account = accountManager.getActive()
  if (!account) throw new Error('No active account. Please log in first.')

  sendStatus(instanceId, 'downloading')
  sendLog(instanceId, '🌿 Fernlaunch starting...')
  sendLog(instanceId, `Launching ${instance.name} (${instance.version})`)

  // 1. Fetch version manifest
  sendLog(instanceId, 'Fetching version manifest...')
  const manifest = await fetchJson('https://launchermeta.mojang.com/mc/game/version_manifest_v2.json')
  const versionEntry = manifest.versions.find((v: any) => v.id === instance.version)
  if (!versionEntry) throw new Error(`Version ${instance.version} not found in manifest`)
  const versionJson = await fetchJson(versionEntry.url)

  const versionsDir = path.join(Paths.appData, 'versions', instance.version)
  fs.mkdirSync(versionsDir, { recursive: true })

  // 2. Download client JAR
  sendLog(instanceId, 'Downloading Minecraft client...')
  const clientJar = path.join(versionsDir, `${instance.version}.jar`)
  await downloadFile(versionJson.downloads.client.url, clientJar)

  // 3. Download vanilla libraries
  sendLog(instanceId, 'Downloading libraries...')
  const librariesDir = path.join(Paths.appData, 'libraries')
  const vanillaClasspath: string[] = []
  const os = currentOs()
  const isModded = instance.modLoader === 'neoforge' || instance.modLoader === 'forge'

  for (const lib of versionJson.libraries) {
    if (lib.rules) {
      const allowed = lib.rules.every((rule: any) => {
        const ruleOs = rule.os?.name
        if (!ruleOs) return rule.action === 'allow'
        return rule.action === 'allow' ? ruleOs === os : ruleOs !== os
      })
      if (!allowed) continue
    }
    const artifact = lib.downloads?.artifact
    if (!artifact) continue
    if (isModded && lib.name?.includes('log4j-slf4j')) continue
    const libPath = path.join(librariesDir, artifact.path)
    await downloadFile(artifact.url, libPath)
    vanillaClasspath.push(libPath)
  }
  // Only add vanilla client jar for non-NeoForge instances
if (instance.modLoader !== 'neoforge') {
  vanillaClasspath.push(clientJar)
}

  // 4. Find Java
  sendLog(instanceId, 'Finding Java...')
  const requiredJavaMajor = (() => {
    const minor = parseInt(instance.version.split('.')[1] ?? '0')
    if (minor >= 21) return 21
    if (minor >= 17) return 17
    return 8
  })()

    function getJavaMajor(binPath: string): number {
    try {
      const out = execSync(`"${binPath}" -version 2>&1`, { timeout: 5000 }).toString()
      const match = out.match(/version "([^"]+)"/)
      if (!match) return 0
      const v = match[1]
      return v.startsWith('1.') ? parseInt(v.split('.')[1]) : parseInt(v.split('.')[0])
    } catch { return 0 }
  }

  let javaPath = cfg.java.executable
  if (javaPath && fs.existsSync(javaPath)) {
    const major = getJavaMajor(javaPath)
    sendLog(instanceId, `Configured Java version: ${major}, required: ${requiredJavaMajor}`)
    if (major !== requiredJavaMajor) {
      sendLog(instanceId, `Finding Java ${requiredJavaMajor}...`)
      javaPath = await javaManager.getJavaForVersion(instance.version, msg => sendLog(instanceId, msg)) ?? ''
    }
  } else {
    javaPath = await javaManager.getJavaForVersion(instance.version, msg => sendLog(instanceId, msg)) ?? ''
  }

  if (!javaPath || !fs.existsSync(javaPath)) {
    throw new Error(`No Java ${requiredJavaMajor} found. Please install it in Settings → Java.`)
  }

  // 5. Apply mod loader
  let mainClass = versionJson.mainClass
  let neoForgeGameArgs: string[] = []
  let neoForgeJvmArgs: string[] = []
  let neoClasspath: string[] = []
  let forgeGameArgs: string[] = []
  let forgeJvmArgs: string[] = []

  if (instance.modLoader === 'fabric' && instance.modLoaderVersion) {
    sendLog(instanceId, 'Applying Fabric loader...')
    mainClass = await applyFabric(instance.version, instance.modLoaderVersion, vanillaClasspath, librariesDir)
    sendLog(instanceId, `Fabric main class: ${mainClass}`)
  } else if (instance.modLoader === 'quilt' && instance.modLoaderVersion) {
    sendLog(instanceId, 'Applying Quilt loader...')
    mainClass = await applyQuilt(instance.version, instance.modLoaderVersion, vanillaClasspath, librariesDir)
    sendLog(instanceId, `Quilt main class: ${mainClass}`)
  } else if (instance.modLoader === 'neoforge' && instance.modLoaderVersion) {
    sendLog(instanceId, 'Applying NeoForge loader...')
    const result = await applyNeoForge(instance.version, instance.modLoaderVersion, librariesDir, javaPath)
    mainClass = result.mainClass
    neoForgeGameArgs = result.gameArgs
    neoForgeJvmArgs = result.jvmArgs
    neoClasspath = result.neoClasspath
    sendLog(instanceId, `NeoForge main class: ${mainClass}`)
  } else if (instance.modLoader === 'forge' && instance.modLoaderVersion) {
    sendLog(instanceId, 'Applying Forge loader...')
    const result = await applyForge(instance.version, instance.modLoaderVersion, vanillaClasspath, librariesDir, javaPath)
    mainClass = result.mainClass
    forgeGameArgs = result.gameArgs
    forgeJvmArgs = result.jvmArgs
    sendLog(instanceId, `Forge main class: ${mainClass}`)

    console.log('[Old Forge] gameArgs:', result.gameArgs)
    console.log('[Old Forge] jvmArgs:', result.jvmArgs)
  }

  // Deduplicate classpath — NeoForge first, then vanilla, no duplicates
const seen = new Set<string>()
const classpath: string[] = []
for (const jar of [...neoClasspath, ...vanillaClasspath]) {
  const key = path.basename(jar)
  if (!seen.has(key)) {
    seen.add(key)
    classpath.push(jar)
  }
}

  // 6. Download assets
  sendLog(instanceId, 'Downloading assets...')
  const assetsDir = path.join(Paths.appData, 'assets')
  const indexesDir = path.join(assetsDir, 'indexes')
  const objectsDir = path.join(assetsDir, 'objects')
  fs.mkdirSync(indexesDir, { recursive: true })
  fs.mkdirSync(objectsDir, { recursive: true })

  const assetIndex = versionJson.assetIndex
  const assetIndexPath = path.join(indexesDir, `${assetIndex.id}.json`)
  await downloadFile(assetIndex.url, assetIndexPath)

  const assetObjects = Object.entries(JSON.parse(fs.readFileSync(assetIndexPath, 'utf-8')).objects) as [string, any][]
  let downloadedAssets = 0
  const CONCURRENCY = 64

  for (let i = 0; i < assetObjects.length; i += CONCURRENCY) {
    await Promise.all(assetObjects.slice(i, i + CONCURRENCY).map(async ([, obj]) => {
      const hash = obj.hash
      const prefix = hash.substring(0, 2)
      const assetPath = path.join(objectsDir, prefix, hash)
      if (!fs.existsSync(assetPath)) {
        await downloadFile(`https://resources.download.minecraft.net/${prefix}/${hash}`, assetPath)
      }
      downloadedAssets++
      const percent = Math.round((downloadedAssets / assetObjects.length) * 100)
      if (downloadedAssets % 50 === 0 || downloadedAssets === assetObjects.length) {
        sendLog(instanceId, `Assets: ${downloadedAssets}/${assetObjects.length} (${percent}%)`)
      }
    }))
  }

  // 7. Build launch arguments
  sendLog(instanceId, 'Building launch arguments...')

  const nativesDir = path.join(versionsDir, 'natives')
  fs.mkdirSync(nativesDir, { recursive: true })
  fs.mkdirSync(mcDir, { recursive: true })

  // Extract natives from library JARs for old Minecraft versions
  const minor = parseInt(instance.version.split('.')[1] ?? '0')
  if (minor <= 12) {
  const os = process.platform === 'win32' ? 'windows' : process.platform === 'darwin' ? 'osx' : 'linux'
  for (const lib of versionJson.libraries) {
    if (!lib.natives?.[os]) continue
    if (lib.rules) {
      const allowed = lib.rules.every((rule: any) => {
        const ruleOs = rule.os?.name
        if (!ruleOs) return rule.action === 'allow'
        return rule.action === 'allow' ? ruleOs === os : ruleOs !== os
      })
      if (!allowed) continue
    }
    const classifier = lib.natives[os].replace('${arch}', '64')
    const nativeJarInfo = lib.downloads?.classifiers?.[classifier]
    if (!nativeJarInfo) continue

    const nativeJar = path.join(librariesDir, nativeJarInfo.path)
    await downloadFile(nativeJarInfo.url, nativeJar)

    if (fs.existsSync(nativeJar)) {
      const zip = new AdmZip(nativeJar)
      zip.getEntries().forEach(entry => {
        if (!entry.isDirectory && (
          entry.entryName.endsWith('.dll') ||
          entry.entryName.endsWith('.so') ||
          entry.entryName.endsWith('.dylib')
        )) {
          zip.extractEntryTo(entry, nativesDir, false, true)
        }
      })
      console.log('[Natives] Extracted from', nativeJarInfo.path)
    }
  }
  console.log('[Natives] dir after extraction:', fs.readdirSync(nativesDir))
}

  console.log('[Natives] dir contents:', fs.readdirSync(nativesDir))
  console.log('[Natives] lwjgl native jars:', versionJson.libraries
  .filter((l: any) => l.natives)
  .map((l: any) => l.name))

  const sep = process.platform === 'win32' ? ';' : ':'
  const classpathStr = classpath.join(sep)

  const jvmVars: Record<string, string> = {
    natives_directory: nativesDir,
    launcher_name: 'Fernlaunch',
    launcher_version: '1.0.0',
    classpath: classpathStr,
    library_directory: librariesDir,
    classpath_separator: sep,
  }

  const gameVars: Record<string, string> = {
    auth_player_name: account.minecraftUsername,
    version_name: instance.version,
    game_directory: mcDir,
    assets_root: assetsDir,
    assets_index_name: assetIndex.id,
    auth_uuid: account.id,
    auth_access_token: account.accessToken,
    clientid: '00000000402b5328',
    auth_xuid: '',
    user_type: 'msa',
    version_type: versionJson.type,
    user_properties: '{}',  // add this
  }

  const jvmArgs: string[] = []
  if (versionJson.arguments?.jvm) {
    for (const arg of versionJson.arguments.jvm) {
      if (typeof arg === 'string') {
        jvmArgs.push(arg)
      } else if (arg.rules) {
        const allowed = arg.rules.every((rule: any) => {
          const ruleOs = rule.os?.name
          if (!ruleOs) return rule.action === 'allow'
          return rule.action === 'allow' ? ruleOs === os : ruleOs !== os
        })
        if (allowed) jvmArgs.push(...(Array.isArray(arg.value) ? arg.value : [arg.value]))
      }
    }
  } else {
    jvmArgs.push(`-Djava.library.path=${nativesDir}`, '-cp', classpathStr)
  }

  const gameArgs: string[] = []
  if (versionJson.arguments?.game) {
    for (const arg of versionJson.arguments.game) {
      if (typeof arg === 'string') gameArgs.push(arg)
    }
  } else if (versionJson.minecraftArguments) {
    gameArgs.push(...versionJson.minecraftArguments.split(' '))
  }
  sendLog(instanceId, `Memory: ${instance.minMemory ?? cfg.java.minMemory}m - ${instance.maxMemory ?? cfg.java.maxMemory}m`)

  const memArgs = [
    `-Xms${instance.minMemory ?? cfg.java.minMemory}m`,
    `-Xmx${instance.maxMemory ?? cfg.java.maxMemory}m`,
  ]

  const extraJvmArgs = (instance.jvmArgs ?? cfg.java.jvmArgs)
    ? (instance.jvmArgs ?? cfg.java.jvmArgs).split(' ').filter(Boolean)
    : []

    const winWidth = instance.windowWidth ?? cfg.minecraft.windowWidth
    const winHeight = instance.windowHeight ?? cfg.minecraft.windowHeight

    const windowArgs = cfg.minecraft.startMaximized
      ? ['--fullscreen']
      : ['--width', String(winWidth), '--height', String(winHeight)]

    const finalArgs = [
      
      ...memArgs,
      ...extraJvmArgs,
      `-DlibraryDirectory=${librariesDir}`,
      ...replaceVars(neoForgeJvmArgs, jvmVars),
      ...replaceVars(forgeJvmArgs, jvmVars),
      ...replaceVars(jvmArgs, jvmVars),
      mainClass,
      // For old Forge, forgeGameArgs already contains all game args including --tweakClass
      // For new Forge/NeoForge, use vanilla gameArgs + mod loader args
      ...(forgeGameArgs.length > 0 && forgeGameArgs.includes('--tweakClass')
        ? replaceVars(forgeGameArgs, gameVars)
        : [...replaceVars(gameArgs, gameVars), ...neoForgeGameArgs, ...forgeGameArgs]
      ),
      ...windowArgs,
    ]

  // 8. Spawn process
  sendLog(instanceId, 'Launching Minecraft!')
  sendStatus(instanceId, 'launching')

  const proc = spawn(javaPath, finalArgs, {
    cwd: mcDir,
    env: { ...process.env },
  })

  activeProcesses.set(instanceId, proc)

  proc.stdout?.on('data', (data: Buffer) => {
    data.toString().split('\n').filter(l => l.trim()).forEach(line => sendLog(instanceId, line))
  })

  proc.stderr?.on('data', (data: Buffer) => {
    data.toString().split('\n').filter(l => l.trim()).forEach(line => sendLog(instanceId, line))
  })

  proc.on('spawn', () => {
    instanceStartTimes.set(instanceId, Date.now())
    sendStatus(instanceId, 'running')
    sendLog(instanceId, '✓ Minecraft process started')
    if (cfg.minecraft.hideOnLaunch) {
      BrowserWindow.getAllWindows()
        .filter(w => !w.webContents.getURL().includes('console'))
        .forEach(w => w.hide())
    }
  })

  proc.on('close', code => {
    activeProcesses.delete(instanceId)
    // Track playtime

      if (cfg.minecraft.recordPlayTime) {
        const endTime = Date.now()
        const startTime = instanceStartTimes.get(instanceId)
        if (startTime) {
          const secondsPlayed = Math.floor((endTime - startTime) / 1000)
          instanceManager.updatePlayTime(instanceId, secondsPlayed)
        }
      }
      instanceStartTimes.delete(instanceId)

      // Show launcher again if it was hidden
      if (cfg.minecraft.hideOnLaunch) {
        BrowserWindow.getAllWindows()
          .filter(w => !w.webContents.getURL().includes('console'))
          .forEach(w => w.show())
      }

      // Hide console on exit
      if (cfg.minecraft.hideConsoleOnExit && code === 0) {
        BrowserWindow.getAllWindows()
          .find(w => w.webContents.getURL().includes('console'))
          ?.hide()
      }

      // Quit launcher on close
      if (cfg.minecraft.quitOnClose) {
        app.quit()
        return
      }

      if (code !== 0 && cfg.minecraft.showConsoleOnCrash) {
      // Find the console window and show it
      const consoleWin = BrowserWindow.getAllWindows()
        .find(w => w.webContents.getURL().includes(`instanceId=${instanceId}`))
      if (consoleWin) consoleWin.show()
      else {
        // Open a new console window
        broadcastToAll('open-console', { instanceId })
      }
    }

      broadcastToAll('instances:updated', {})
    })
    proc.on('error', err => {
      activeProcesses.delete(instanceId)
      sendStatus(instanceId, 'crashed')
      sendLog(instanceId, `Failed to start: ${err.message}`)
    })
  }

export function killInstance(instanceId: string): void {
  const proc = activeProcesses.get(instanceId)
  if (proc) {
    proc.kill()
    activeProcesses.delete(instanceId)
  }
}

export function isInstanceRunning(instanceId: string): boolean {
  return activeProcesses.has(instanceId)
}