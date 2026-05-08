import { Client } from '@xhayper/discord-rpc'
import { config } from '../utils/config'

const CLIENT_ID = '1502041454829375651' // We'll create this on Discord Dev Portal

let client: Client | null = null
let connected = false

export async function initDiscordRpc() {
  if (!config.store.discordRpc) return
  try {
    client = new Client({ 
    clientId: CLIENT_ID,
    transport: { type: 'ipc' }
    })

    client.on('ready', () => {
    connected = true
    console.log('[Discord RPC] Connected')
    setIdleActivity()
    })

    await client.login()
  } catch (e) {
    console.log('[Discord RPC] Failed to connect:', e)
    client = null
    connected = false
  }
}

export function setDiscordActivity(instanceName: string, mcVersion: string, modLoader: string) {
  if (!client || !connected) return
  try {
    client.user?.setActivity({
      details: `Playing ${instanceName}`,
      state: `${mcVersion}${modLoader !== 'none' ? ` • ${modLoader}` : ''}`.trim(),
      startTimestamp: new Date(),
      largeImageKey: 'fernlauncher',
      largeImageText: 'Fernlauncher',
      instance: false,
    })
  } catch (e) {
    console.log('[Discord RPC] Failed to set activity:', e)
  }
}

export function clearDiscordActivity() {
  if (!client || !connected) return
  try {
    client.user?.clearActivity()
  } catch (e) {
    console.log('[Discord RPC] Failed to clear activity:', e)
  }
}

export function destroyDiscordRpc() {
  if (client) {
    client.destroy()
    client = null
    connected = false
  }
}

export function setIdleActivity() {
  if (!client || !connected) return
  try {
    client.user?.setActivity({
      details: 'In the launcher',
      largeImageKey: 'fernlauncher',
      largeImageText: 'Fernlauncher',
      instance: false,
    })
  } catch (e) {
    console.log('[Discord RPC] Failed to set idle activity:', e)
  }
}