export interface AppConfig {
  firstLaunch: boolean
  language: string
  theme: 'dark' | 'light' | 'system'
  appearance: {
    iconTheme: string
    catPack: string
    consoleFont: string
    consoleFontSize: number
    catOpacity: number
    catScaling: 'fit' | 'fill' | 'stretch'
  }
  minecraft: {
    startMaximized: boolean
    windowWidth: number
    windowHeight: number
    hideOnLaunch: boolean
    quitOnClose: boolean
    showConsoleOnLaunch: boolean
    showConsoleOnCrash: boolean
    hideConsoleOnExit: boolean
    showPlayTime: boolean
    recordPlayTime: boolean
    showTotalPlayTime: boolean
    showDurationsInHours: boolean
  }
  java: {
    executable: string
    skipCompatChecks: boolean
    skipSetupPrompt: boolean
    autoDetect: boolean
    autoDownload: boolean
    minMemory: number
    maxMemory: number
    permGen: number
    jvmArgs: string
  }
  proxy: {
    type: 'system' | 'none' | 'socks5' | 'http'
    address: string
    port: number
    username: string
    password: string
  }
  services: {
    pasteService: string
    pasteBaseUrl: string
    metaServer: string
    assetsServer: string
    userAgent: string
    microsoftApiKey: string
    modrinthApiKey: string
    curseforgeApiKey: string
    technicApiKey: string
  }
  tools: {
    textEditor: string
    mcedit: string
    jprofiler: string
    visualvm: string
  }
  instanceSorting: 'name' | 'lastLaunched'
  instanceRenaming: 'ask' | 'always' | 'never'
  checkUpdates: boolean
  updateInterval: string
  folders: {
    instances: string
    mods: string
    icons: string
    java: string
    skins: string
    downloads: string
  }
}

export const defaults: AppConfig = {
  firstLaunch: true,
  language: 'en',
  theme: 'dark',
  appearance: {
    iconTheme: 'Simple (Colored)',
    catPack: 'Rory ID 11',
    consoleFont: 'DejaVu Sans',
    consoleFontSize: 10,
    catOpacity: 75,
    catScaling: 'fit',
  },
  minecraft: {
    startMaximized: false,
    windowWidth: 854,
    windowHeight: 480,
    hideOnLaunch: false,
    quitOnClose: false,
    showConsoleOnLaunch: false,
    showConsoleOnCrash: true,
    hideConsoleOnExit: false,
    showPlayTime: true,
    recordPlayTime: true,
    showTotalPlayTime: true,
    showDurationsInHours: false,
  },
  java: {
    executable: '',
    skipCompatChecks: false,
    skipSetupPrompt: false,
    autoDetect: true,
    autoDownload: true,
    minMemory: 512,
    maxMemory: 8096,
    permGen: 128,
    jvmArgs: '',
  },
  proxy: {
    type: 'none',
    address: '127.0.0.1',
    port: 8080,
    username: '',
    password: '',
  },
  services: {
    pasteService: 'mclo.gs',
    pasteBaseUrl: 'https://api.mclo.gs',
    metaServer: 'https://launchermeta.mojang.com/mc/game/version_manifest_v2.json',
    assetsServer: 'https://resources.download.minecraft.net/',
    userAgent: '',
    microsoftApiKey: '',
    modrinthApiKey: '',
    curseforgeApiKey: '$2a$10$Qm5Sp4EH9TXayzBgIgMZ3e0UoMO.nVKTxz6R.BHm57BzqHWv3zNRy',
    technicApiKey: '',
  },
  tools: {
    textEditor: '',
    mcedit: '',
    jprofiler: '',
    visualvm: '',
  },
  instanceSorting: 'name',
  instanceRenaming: 'ask',
  checkUpdates: false,
  updateInterval: 'Every 24 hours',
  folders: {
    instances: 'instances',
    mods: 'mods',
    icons: 'icons',
    java: 'java',
    skins: 'skins',
    downloads: '',
  },
}