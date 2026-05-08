import { session } from 'electron'
import { config } from './config'

export async function applyProxy() {
  const proxyConfig = config.get('proxy')
  
  if (proxyConfig.type === 'none') {
    await session.defaultSession.setProxy({ mode: 'direct' })
  } else if (proxyConfig.type === 'http' || proxyConfig.type === 'socks5') {
    await session.defaultSession.setProxy({
      proxyRules: `${proxyConfig.type}://${proxyConfig.address}:${proxyConfig.port}`,
    })
  }
}