export {}

import { AppConfig } from './config'

declare global {
  interface Window {
    electron: {
      getConfig: () => Promise<AppConfig>
      setConfig: (key: string, value: unknown) => Promise<void>
      completeFirstLaunch: () => void
      getInstances: () => Promise<Instance[]>
      createInstance: (data: CreateInstanceData) => Promise<Instance>
      deleteInstance: (id: string) => Promise<void>
      copyInstance: (id: string) => Promise<Instance>
      launchInstance: (id: string) => Promise<void>
      detectJava: () => Promise<JavaInstall[]>
      downloadJava: (version: string) => Promise<void>
      getJavaInstalls: () => Promise<JavaInstall[]>
      addMicrosoftAccount: () => Promise<Account>
      removeAccount: (id: string) => Promise<void>
      getAccounts: () => Promise<Account[]>
      setActiveAccount: (id: string) => Promise<void>
      refreshAccount: (id: string) => Promise<void>
      getVersions: () => Promise<MinecraftVersion[]>
      getFabricVersions: (mcVersion: string) => Promise<ModLoaderVersion[]>
      getQuiltVersions: (mcVersion: string) => Promise<ModLoaderVersion[]>
      getNeoForgeVersions: (mcVersion: string) => Promise<ModLoaderVersion[]>
      getForgeVersions: (mcVersion: string) => Promise<ModLoaderVersion[]>
      openNewInstance: () => Promise<void>
      openSettings: () => Promise<void>
      browseJava: () => Promise<string | null>
      getMojangJavaVersions: () => Promise<MojangJavaVersion[]>
      downloadMojangJava: (component: string) => Promise<void>
      killInstance: (id: string) => Promise<void>
      isInstanceRunning: (id: string) => Promise<boolean>
      openConsole: (instanceId: string) => Promise<void>
      openInstanceEditor: (instanceId: string) => Promise<void>
      listInstanceFolder: (instanceId: string, subPath: string) => Promise<string[]>
      openInstanceFolder: (instanceId: string, subPath: string) => Promise<void>
      updateInstance: (instance: Instance) => Promise<void>
      downloadMod: (instanceId: string, downloadUrl: string, fileName: string) => Promise<string>
      deleteInstanceFile: (instanceId: string, subPath: string) => Promise<void>
      curseforgeSearch: (query: string, mcVersion: string, loader: string, classId: number, offset: number) => Promise<any>
      curseforgeGetFiles: (modId: number, mcVersion: string, loader: string) => Promise<any>
      downloadFile: (instanceId: string, downloadUrl: string, fileName: string, subFolder: string) => Promise<string>
      getServers: (instanceId: string) => Promise<{ name: string, ip: string, icon: string }[]>
      addServer: (instanceId: string, name: string, ip: string) => Promise<void>
      removeServer: (instanceId: string, index: number) => Promise<void>
      createShortcut: (instanceId: string) => Promise<void>
      exportInstance: (instanceId: string) => Promise<void>
      importInstance: (filePath: string) => Promise<void>
      setInstanceIcon: (instanceId: string) => Promise<string | null>
      getInstanceIconPath: (instanceId: string, iconFile: string) => Promise<string>
      getInstanceIconData: (instanceId: string, iconFile: string) => Promise<string | null>
      getScreenshot: (instanceId: string, fileName: string) => Promise<string | null>
      openFile: (instanceId: string, subPath: string) => Promise<void>
      readLog: (instanceId: string) => Promise<string>
      watchLog: (instanceId: string) => Promise<void>
      installModrinthModpack: (versionId: string, instanceName: string, group: string) => Promise<{ instance: Instance, manualFiles: { name: string, url?: string }[] }>
      openExternalUrl: (url: string) => Promise<void>
      checkManualFiles: (instanceId: string, fileNames: string[], downloadsPath: string) => Promise<string[]>
      getDownloadsPath: () => Promise<string>
      onModpackProgress: (callback: (msg: string) => void) => void
      installCurseForgeModpack: (fileId: number, projectId: number, instanceName: string, group: string) => Promise<{ instance: Instance, manualFiles: { name: string, url?: string }[] }>
      cfModpackSearch: (query: string, offset: number) => Promise<any>
      cfModpackFiles: (modId: number) => Promise<any>
      openLauncherFolder: (key: string) => Promise<void>
      clearMetadataCache: () => Promise<void>
      openAbout: () => Promise<void>
      onUpdateAvailable: (cb: () => void) => void
      onUpdateDownloaded: (cb: () => void) => void
      installUpdate: () => Promise<void>
      java:downloadProgress
      on: (channel: string, callback: (...args: unknown[]) => void) => void
      off: (channel: string, callback: (...args: unknown[]) => void) => void
    }
  }

  interface Instance {
    id: string
    name: string
    version: string
    modLoader: 'none' | 'fabric' | 'forge' | 'neoforge' | 'quilt' | 'liteloader'
    modLoaderVersion: string
    icon: string
    group: string
    lastPlayed: string | null
    totalPlayTime: number
    createdAt: string
    javaPath?: string
    minMemory?: number
    maxMemory?: number
    jvmArgs?: string
    windowWidth?: number
    windowHeight?: number
    notes?: string
  }

  interface CreateInstanceData {
    name: string
    version: string
    modLoader: Instance['modLoader']
    modLoaderVersion: string
    group: string
    icon: string
  }

  interface JavaInstall {
    version: string
    architecture: string
    path: string
    isDefault: boolean
  }

  interface Account {
    id: string
    username: string
    minecraftUsername: string
    type: 'msa' | 'offline'
    status: 'ready' | 'errored' | 'refreshing'
    isActive: boolean
    accessToken: string
    refreshToken: string
    expiresAt: string
  }

  interface MinecraftVersion {
    id: string
    type: 'release' | 'snapshot' | 'old_beta' | 'old_alpha'
    releaseTime: string
  }

  interface ModLoaderVersion {
    version: string
    stable: boolean
  }

  interface MojangJavaVersion {
  component: string
  majorVersion: number
  version: string
  released: string
  type: string
  }
}