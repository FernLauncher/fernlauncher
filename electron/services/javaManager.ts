import fs from 'fs'
import path from 'path'
import https from 'https'
import { execSync } from 'child_process'
import { Paths } from '../utils/paths'
import AdmZip from 'adm-zip'

const COMMON_JAVA_PATHS_WIN = [
  'C:\\Program Files\\Java',
  'C:\\Program Files (x86)\\Java',
  'C:\\Program Files\\Eclipse Adoptium',
  'C:\\Program Files\\Microsoft',
  'C:\\Program Files\\Zulu',
  'C:\\Program Files\\BellSoft',
  'C:\\Program Files\\Amazon Corretto',
  'C:\\Program Files (x86)\\Common Files\\Oracle\\Java',
  'C:\\Program Files\\Common Files\\Oracle\\Java',
  process.env.APPDATA ? path.join(process.env.APPDATA, 'PrismLauncher\\java') : '',
  process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Packages') : '',
  Paths.java,
]

const COMMON_JAVA_PATHS_MAC = [
  '/Library/Java/JavaVirtualMachines',
  '/usr/local/opt',
]

const COMMON_JAVA_PATHS_LINUX = [
  '/usr/lib/jvm',
  '/usr/java',
]

// Adoptium API for downloading Java
const ADOPTIUM_API = 'https://api.adoptium.net/v3'

function getJavaVersion(javaBin: string): string | null {
  try {
    const output = execSync(`"${javaBin}" -version 2>&1`, {
      timeout: 5000,
      stdio: 'pipe',
    }).toString()
    const match = output.match(/version "([^"]+)"/)
    if (match) return match[1]
    return null
  } catch (e: any) {
    const output = e.stderr?.toString() ?? e.stdout?.toString() ?? ''
    const match = output.match(/version "([^"]+)"/)
    return match ? match[1] : null
  }
}

function getArchitecture(javaBin: string): string {
  try {
    const output = execSync(`"${javaBin}" -XshowSettings:all -version 2>&1`, { timeout: 5000 }).toString()
    if (output.includes('amd64') || output.includes('x86_64')) return 'amd64'
    if (output.includes('aarch64') || output.includes('arm64')) return 'arm64'
    if (output.includes('x86')) return 'x86'
    return 'amd64'
  } catch {
    return 'amd64'
  }
}

function findJavaInDir(dir: string): JavaInstall[] {
  const installs: JavaInstall[] = []
  if (!dir || !fs.existsSync(dir)) return installs

  try {
    const entries = fs.readdirSync(dir)
    for (const entry of entries) {
      const entryPath = path.join(dir, entry)
      if (!fs.statSync(entryPath).isDirectory()) continue

      const candidates = [
        path.join(entryPath, 'bin', 'javaw.exe'),
        path.join(entryPath, 'bin', 'java'),
        path.join(entryPath, 'jre', 'bin', 'javaw.exe'),
        path.join(entryPath, 'jre', 'bin', 'java'),
        path.join(entryPath, 'Contents', 'Home', 'bin', 'java'),
      ]

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          const version = getJavaVersion(candidate)
          if (version) {
            installs.push({
              version,
              architecture: getArchitecture(candidate),
              path: candidate,
              isDefault: false,
            })
            break
          }
        }
      }
    }
  } catch {
    // skip unreadable dirs
  }

  return installs
}

function getRequiredJavaMajor(mcVersion: string): number {
  const parts = mcVersion.split('.')
  const minor = parseInt(parts[1] ?? '0')
  const patch = parseInt(parts[2] ?? '0')
  if (minor >= 21) return 21
  if (minor >= 18) return 17
  if (minor >= 17) return 17
  return 8
}

function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Fernlaunch/1.0' } }, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch { reject(new Error(`Invalid JSON from ${url}`)) }
      })
    }).on('error', reject)
  })
}

function downloadFile(url: string, dest: string, onProgress?: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    const makeRequest = (currentUrl: string, hops = 0) => {
      if (hops > 5) return reject(new Error('Too many redirects'))
      https.get(currentUrl, { headers: { 'User-Agent': 'Fernlaunch/1.0' } }, res => {
        if ([301, 302, 307, 308].includes(res.statusCode!)) {
          const next = res.headers.location!
          return makeRequest(next.startsWith('http') ? next : new URL(next, currentUrl).toString(), hops + 1)
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`))
        const total = parseInt(res.headers['content-length'] ?? '0')
        let downloaded = 0
        const file = fs.createWriteStream(dest)
        res.on('data', chunk => {
          downloaded += chunk.length
          if (total && onProgress) onProgress(Math.round(downloaded / total * 100))
        })
        res.pipe(file)
        file.on('finish', () => { file.close(); resolve() })
        file.on('error', err => { fs.unlink(dest, () => {}); reject(err) })
      }).on('error', reject)
    }
    makeRequest(url)
  })
}

async function autoDownloadJava(majorVersion: number, onProgress?: (msg: string) => void): Promise<string | null> {
  try {
    const os = process.platform === 'win32' ? 'windows' : process.platform === 'darwin' ? 'mac' : 'linux'
    const arch = process.arch === 'arm64' ? 'aarch64' : 'x64'
    const imageType = 'jdk'

    onProgress?.(`Fetching Java ${majorVersion} info...`)
    const releases = await fetchJson(
      `${ADOPTIUM_API}/assets/latest/${majorVersion}/hotspot?architecture=${arch}&image_type=${imageType}&os=${os}&vendor=eclipse`
    )

    if (!releases?.length) {
      onProgress?.(`No Java ${majorVersion} release found`)
      return null
    }

    const release = releases[0]
    const binary = release.binary
    const pkg = binary.package
    const downloadUrl = pkg.link
    const fileName = pkg.name
    const destDir = path.join(Paths.java, `java-${majorVersion}`)
    const destFile = path.join(destDir, fileName)

    fs.mkdirSync(destDir, { recursive: true })

    onProgress?.(`Downloading Java ${majorVersion}...`)
    await downloadFile(downloadUrl, destFile, pct => {
      onProgress?.(`Downloading Java ${majorVersion}: ${pct}%`)
    })

    // Extract
    onProgress?.(`Extracting Java ${majorVersion}...`)
    if (fileName.endsWith('.zip')) {
      const zip = new AdmZip(destFile)
      zip.extractAllTo(destDir, true)
    } else if (fileName.endsWith('.tar.gz')) {
      const { execSync } = await import('child_process')
      execSync(`tar -xzf "${destFile}" -C "${destDir}"`)
    }

    fs.unlinkSync(destFile)

    // Find the java binary in extracted dir
    const extracted = findJavaInDir(destDir)
    if (extracted.length > 0) {
      onProgress?.(`Java ${majorVersion} installed!`)
      return extracted[0].path
    }

    return null
  } catch (e) {
    onProgress?.(`Failed to auto-download Java ${majorVersion}: ${e}`)
    return null
  }
}

export const javaManager = {
  detect(): JavaInstall[] {
    const platform = process.platform
    const searchPaths = platform === 'win32'
      ? COMMON_JAVA_PATHS_WIN
      : platform === 'darwin'
        ? COMMON_JAVA_PATHS_MAC
        : COMMON_JAVA_PATHS_LINUX

    const found: JavaInstall[] = []
    const seen = new Set<string>()

    for (const searchPath of searchPaths) {
      const installs = findJavaInDir(searchPath)
      for (const install of installs) {
        if (!seen.has(install.path)) {
          seen.add(install.path)
          found.push(install)
        }
      }
    }

    found.sort((a, b) => {
      const aMajor = parseInt(a.version.split('.')[0])
      const bMajor = parseInt(b.version.split('.')[0])
      return bMajor - aMajor
    })

    if (found.length > 0) found[0].isDefault = true
    return found
  },

  getInstalled(): JavaInstall[] {
    const fernJavaDir = Paths.java
    if (!fs.existsSync(fernJavaDir)) return []
    return findJavaInDir(fernJavaDir)
  },

  async getJavaForVersion(mcVersion: string, onProgress?: (msg: string) => void): Promise<string | null> {
    const requiredMajor = getRequiredJavaMajor(mcVersion)

    const installed = this.getInstalled()
    const detected = this.detect()
    const all = [...installed, ...detected]

    const match = all.find(j => {
      const raw = j.version
      const major = raw.startsWith('1.') ? parseInt(raw.split('.')[1]) : parseInt(raw.split('.')[0])
      return major === requiredMajor
    })
console.log('[Java] Required major:', requiredMajor, '| All versions:', all.map(j => j.version))
    if (match) return match.path
    

    // Auto-download the required Java version
    onProgress?.(`Java ${requiredMajor} not found, downloading automatically...`)
    return autoDownloadJava(requiredMajor, onProgress)
  },
}