import Store from 'electron-store'
import { AppConfig, defaults } from '../../src/types/config'

export type { AppConfig }
export { defaults }

export const config = new Store<AppConfig>({
  defaults,
  name: 'config',
})