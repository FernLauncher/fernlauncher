import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  // config
  getConfig: () => ipcRenderer.invoke('config:get'),
  setConfig: (key: string, value: unknown) => ipcRenderer.invoke('config:set', key, value),

  // first launch
  completeFirstLaunch: () => ipcRenderer.send('first-launch-complete'),

  // instances
  getInstances: () => ipcRenderer.invoke('instances:get'),
  getVersions: () => ipcRenderer.invoke('versions:get'),
  getFabricVersions: (mcVersion: string) => ipcRenderer.invoke('versions:fabric', mcVersion),
  getQuiltVersions: (mcVersion: string) => ipcRenderer.invoke('versions:quilt', mcVersion),
  getNeoForgeVersions: (mcVersion: string) => ipcRenderer.invoke('versions:neoforge', mcVersion),
  getForgeVersions: (mcVersion: string) => ipcRenderer.invoke('versions:forge', mcVersion),
  openNewInstance: () => ipcRenderer.invoke('window:newInstance'),
  createInstance: (data: unknown) => ipcRenderer.invoke('instances:create', data),
  deleteInstance: (id: string) => ipcRenderer.invoke('instances:delete', id),
  copyInstance: (id: string) => ipcRenderer.invoke('instances:copy', id),
  launchInstance: (id: string) => ipcRenderer.invoke('instances:launch', id),
  killInstance: (id: string) => ipcRenderer.invoke('instances:kill', id),
  isInstanceRunning: (id: string) => ipcRenderer.invoke('instances:isRunning', id),
  openConsole: (instanceId: string) => ipcRenderer.invoke('window:console', instanceId),
  openInstanceEditor: (instanceId: string) => ipcRenderer.invoke('instance:openEditor', instanceId),
  listInstanceFolder: (instanceId: string, subPath: string) => ipcRenderer.invoke('instance:listFolder', instanceId, subPath),
  openInstanceFolder: (instanceId: string, subPath: string) => ipcRenderer.invoke('instance:openFolder', instanceId, subPath),
  updateInstance: (instance: Instance) => ipcRenderer.invoke('instances:update', instance),
  downloadMod: (instanceId: string, downloadUrl: string, fileName: string) => ipcRenderer.invoke('instance:downloadMod', instanceId, downloadUrl, fileName),
  deleteInstanceFile: (instanceId: string, subPath: string) => ipcRenderer.invoke('instance:deleteFile', instanceId, subPath),
  curseforgeSearch: (query: string, mcVersion: string, loader: string, classId: number, offset: number) => ipcRenderer.invoke('instance:curseforgeSearch', query, mcVersion, loader, classId, offset),
  curseforgeGetFiles: (modId: number, mcVersion: string, loader: string) => ipcRenderer.invoke('instance:curseforgeGetFiles', modId, mcVersion, loader),
  getServers: (instanceId: string) => ipcRenderer.invoke('instance:getServers', instanceId),
  addServer: (instanceId: string, name: string, ip: string) => ipcRenderer.invoke('instance:addServer', instanceId, name, ip),
  removeServer: (instanceId: string, index: number) => ipcRenderer.invoke('instance:removeServer', instanceId, index),
  downloadFile: (instanceId: string, downloadUrl: string, fileName: string, subFolder: string) => ipcRenderer.invoke('instance:downloadFile', instanceId, downloadUrl, fileName, subFolder),
  createShortcut: (instanceId: string) => ipcRenderer.invoke('instance:createShortcut', instanceId),
  exportInstance: (instanceId: string) => ipcRenderer.invoke('instance:export', instanceId),
  importInstance: (filePath: string) => ipcRenderer.invoke('instance:import', filePath),
  openFileDialog: (options: any) => ipcRenderer.invoke('dialog:openFile', options),
  setInstanceIcon: (instanceId: string) => ipcRenderer.invoke('instance:setIcon', instanceId),
  getInstanceIconPath: (instanceId: string, iconFile: string) => ipcRenderer.invoke('instance:getIconPath', instanceId, iconFile),
  getInstanceIconData: (instanceId: string, iconFile: string) => ipcRenderer.invoke('instance:getIconData', instanceId, iconFile),
  getScreenshot: (instanceId: string, fileName: string) => ipcRenderer.invoke('instance:getScreenshot', instanceId, fileName),
  openFile: (instanceId: string, subPath: string) => ipcRenderer.invoke('instance:openFile', instanceId, subPath),
  readLog: (instanceId: string) => ipcRenderer.invoke('instance:readLog', instanceId),
  watchLog: (instanceId: string) => ipcRenderer.invoke('instance:watchLog', instanceId),
  installModrinthModpack: (versionId: string, instanceName: string, group: string) => ipcRenderer.invoke('instance:installModrinthModpack', versionId, instanceName, group),
  openExternalUrl: (url: string) => ipcRenderer.invoke('open:external', url),
  checkManualFiles: (instanceId: string, fileNames: string[], downloadsPath: string) => ipcRenderer.invoke('instance:checkManualFiles', instanceId, fileNames, downloadsPath),
  getDownloadsPath: () => ipcRenderer.invoke('get:downloadsPath'),
  onModpackProgress: (callback: (msg: string) => void) => ipcRenderer.on('modpack:progress', (_e, msg) => callback(msg)),
  installCurseForgeModpack: (fileId: number, projectId: number, instanceName: string, group: string) => ipcRenderer.invoke('instance:installCurseForgeModpack', fileId, projectId, instanceName, group),
  cfModpackSearch: (query: string, offset: number) => ipcRenderer.invoke('instance:cfModpackSearch', query, offset),
  cfModpackFiles: (modId: number) => ipcRenderer.invoke('instance:cfModpackFiles', modId),
  openLauncherFolder: (key: string) => ipcRenderer.invoke('launcher:openFolder', key),
  clearMetadataCache: () => ipcRenderer.invoke('launcher:clearMetadataCache'),
  openAbout: () => ipcRenderer.invoke('launcher:openAbout'),
  onUpdateAvailable: (cb: () => void) => ipcRenderer.on('update:available', cb),
  onUpdateDownloaded: (cb: () => void) => ipcRenderer.on('update:downloaded', cb),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  onUpdateProgress: (cb: (percent: number) => void) => ipcRenderer.on('update:progress', (_e, percent) => cb(percent)),
  addOfflineAccount: (username: string) => ipcRenderer.invoke('accounts:addOffline', username),

  // settings
  openSettings: () => ipcRenderer.invoke('window:settings'),

  // java
  detectJava: () => ipcRenderer.invoke('java:detect'),
  browseJava: () => ipcRenderer.invoke('java:browse'),
  downloadJava: (version: string) => ipcRenderer.invoke('java:download', version),
  getJavaInstalls: () => ipcRenderer.invoke('java:installs'),
  getMojangJavaVersions: () => ipcRenderer.invoke('java:mojangVersions'),
  downloadMojangJava: (component: string) => ipcRenderer.invoke('java:downloadMojang', component),

  // accounts
  addMicrosoftAccount: () => ipcRenderer.invoke('accounts:addMicrosoft'),
  removeAccount: (id: string) => ipcRenderer.invoke('accounts:remove', id),
  getAccounts: () => ipcRenderer.invoke('accounts:get'),
  setActiveAccount: (id: string) => ipcRenderer.invoke('accounts:setActive', id),
  refreshAccount: (id: string) => ipcRenderer.invoke('accounts:refresh', id),

  // on events (main -> renderer)
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args))
  },
  off: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.off(channel, (_event, ...args) => callback(...args))
  },
})