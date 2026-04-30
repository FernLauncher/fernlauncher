import { BrowserWindow } from 'electron'
import https from 'https'

const CLIENT_ID = '00000000402b5328'
const REDIRECT_URI = 'https://login.live.com/oauth20_desktop.srf'
const AUTH_URL = `https://login.live.com/oauth20_authorize.srf?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=XboxLive.signin%20offline_access`

function httpsPost(url: string, data: string, headers: Record<string, string>): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': headers['Content-Type'] || 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data),
        'Accept': 'application/json',
        ...headers,
      },
    }
    const req = https.request(options, res => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch {
          resolve(body)
        }
      })
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

function httpsGet(url: string, headers: Record<string, string>): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...headers,
      },
    }
    const req = https.request(options, res => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(body))
        } catch {
          resolve(body)
        }
      })
    })
    req.on('error', reject)
    req.end()
  })
}

async function getMicrosoftToken(code: string): Promise<{ access_token: string, refresh_token: string }> {
  const data = new URLSearchParams({
    client_id: CLIENT_ID,
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
  }).toString()

  const result = await httpsPost(
    'https://login.live.com/oauth20_token.srf',
    data,
    { 'Content-Type': 'application/x-www-form-urlencoded' }
  )

  if (!result.access_token) throw new Error('Failed to get Microsoft token: ' + JSON.stringify(result))
  return result
}

async function getXboxToken(msAccessToken: string): Promise<{ token: string, uhs: string }> {
  const body = JSON.stringify({
    Properties: {
      AuthMethod: 'RPS',
      SiteName: 'user.auth.xboxlive.com',
      RpsTicket: `d=${msAccessToken}`,
    },
    RelyingParty: 'http://auth.xboxlive.com',
    TokenType: 'JWT',
  })

  const result = await httpsPost(
    'https://user.auth.xboxlive.com/user/authenticate',
    body,
    { 'Content-Type': 'application/json' }
  )

  if (!result.Token) throw new Error('Failed to get Xbox token: ' + JSON.stringify(result))
  return {
    token: result.Token,
    uhs: result.DisplayClaims.xui[0].uhs,
  }
}

async function getXSTSToken(xboxToken: string): Promise<{ token: string, uhs: string }> {
  const body = JSON.stringify({
    Properties: {
      SandboxId: 'RETAIL',
      UserTokens: [xboxToken],
    },
    RelyingParty: 'rp://api.minecraftservices.com/',
    TokenType: 'JWT',
  })

  const result = await httpsPost(
    'https://xsts.auth.xboxlive.com/xsts/authorize',
    body,
    { 'Content-Type': 'application/json' }
  )

  if (!result.Token) {
    if (result.XErr === 2148916233) throw new Error('No Microsoft account found. Please create one at xbox.com')
    if (result.XErr === 2148916238) throw new Error('This account is a child account. Please add it to a family')
    throw new Error('Failed to get XSTS token: ' + result.XErr)
  }

  return {
    token: result.Token,
    uhs: result.DisplayClaims.xui[0].uhs,
  }
}

async function getMinecraftToken(xstsToken: string, uhs: string): Promise<string> {
  const body = JSON.stringify({
    identityToken: `XBL3.0 x=${uhs};${xstsToken}`,
  })

  const result = await httpsPost(
    'https://api.minecraftservices.com/authentication/login_with_xbox',
    body,
    { 'Content-Type': 'application/json' }
  )

  if (!result.access_token) throw new Error('Failed to get Minecraft token')
  return result.access_token
}

async function getMinecraftProfile(mcToken: string): Promise<{ id: string, name: string }> {
  const result = await httpsGet(
    'https://api.minecraftservices.com/minecraft/profile',
    { Authorization: `Bearer ${mcToken}` }
  )

  if (!result.id) throw new Error('Failed to get Minecraft profile. Do you own Minecraft?')
  return { id: result.id, name: result.name }
}

export async function loginWithMicrosoft(): Promise<Account> {
  return new Promise((resolve, reject) => {
    const win = new BrowserWindow({
      width: 500,
      height: 650,
      title: 'Sign in with Microsoft',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    })

    win.setMenuBarVisibility(false)
    win.loadURL(AUTH_URL)

    let handled = false

    const handleUrl = async (url: string) => {
      if (!url.startsWith(REDIRECT_URI)) return
      if (handled) return
      handled = true

      const urlObj = new URL(url)
      const code = urlObj.searchParams.get('code')
      const error = urlObj.searchParams.get('error')

      if (error) {
        win.close()
        reject(new Error('Microsoft auth error: ' + error))
        return
      }

      if (!code) return

      win.close()

      try {
        const msTokens = await getMicrosoftToken(code)
        const xboxToken = await getXboxToken(msTokens.access_token)
        const xstsToken = await getXSTSToken(xboxToken.token)
        const mcToken = await getMinecraftToken(xstsToken.token, xstsToken.uhs)
        const profile = await getMinecraftProfile(mcToken)

        const account: Account = {
          id: profile.id,
          username: profile.id,
          minecraftUsername: profile.name,
          type: 'msa',
          status: 'ready',
          isActive: true,
          accessToken: mcToken,
          refreshToken: msTokens.refresh_token,
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        }

        resolve(account)
      } catch (err) {
        reject(err)
      }
    }

    win.webContents.on('will-redirect', (_, url) => handleUrl(url))
    win.webContents.on('will-navigate', (_, url) => handleUrl(url))

    win.on('closed', () => {
      if (!handled) reject(new Error('Login window was closed'))
    })
  })
}

export async function refreshMicrosoftToken(refreshToken: string): Promise<Partial<Account>> {
  const data = new URLSearchParams({
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    redirect_uri: REDIRECT_URI,
  }).toString()

  const msTokens = await httpsPost(
    'https://login.live.com/oauth20_token.srf',
    data,
    { 'Content-Type': 'application/x-www-form-urlencoded' }
  )

  const xboxToken = await getXboxToken(msTokens.access_token)
  const xstsToken = await getXSTSToken(xboxToken.token)
  const mcToken = await getMinecraftToken(xstsToken.token, xstsToken.uhs)

  return {
    accessToken: mcToken,
    refreshToken: msTokens.refresh_token,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    status: 'ready',
  }
}