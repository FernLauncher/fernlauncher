"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  // config
  getConfig: () => electron.ipcRenderer.invoke("config:get"),
  setConfig: (key, value) => electron.ipcRenderer.invoke("config:set", key, value),
  // first launch
  completeFirstLaunch: () => electron.ipcRenderer.send("first-launch-complete"),
  // instances
  getInstances: () => electron.ipcRenderer.invoke("instances:get"),
  getVersions: () => electron.ipcRenderer.invoke("versions:get"),
  getFabricVersions: (mcVersion) => electron.ipcRenderer.invoke("versions:fabric", mcVersion),
  getQuiltVersions: (mcVersion) => electron.ipcRenderer.invoke("versions:quilt", mcVersion),
  getNeoForgeVersions: (mcVersion) => electron.ipcRenderer.invoke("versions:neoforge", mcVersion),
  getForgeVersions: (mcVersion) => electron.ipcRenderer.invoke("versions:forge", mcVersion),
  openNewInstance: () => electron.ipcRenderer.invoke("window:newInstance"),
  createInstance: (data) => electron.ipcRenderer.invoke("instances:create", data),
  deleteInstance: (id) => electron.ipcRenderer.invoke("instances:delete", id),
  copyInstance: (id) => electron.ipcRenderer.invoke("instances:copy", id),
  launchInstance: (id) => electron.ipcRenderer.invoke("instances:launch", id),
  killInstance: (id) => electron.ipcRenderer.invoke("instances:kill", id),
  isInstanceRunning: (id) => electron.ipcRenderer.invoke("instances:isRunning", id),
  openConsole: (instanceId) => electron.ipcRenderer.invoke("window:console", instanceId),
  openInstanceEditor: (instanceId) => electron.ipcRenderer.invoke("instance:openEditor", instanceId),
  listInstanceFolder: (instanceId, subPath) => electron.ipcRenderer.invoke("instance:listFolder", instanceId, subPath),
  openInstanceFolder: (instanceId, subPath) => electron.ipcRenderer.invoke("instance:openFolder", instanceId, subPath),
  updateInstance: (instance) => electron.ipcRenderer.invoke("instances:update", instance),
  downloadMod: (instanceId, downloadUrl, fileName) => electron.ipcRenderer.invoke("instance:downloadMod", instanceId, downloadUrl, fileName),
  deleteInstanceFile: (instanceId, subPath) => electron.ipcRenderer.invoke("instance:deleteFile", instanceId, subPath),
  curseforgeSearch: (query, mcVersion, loader, classId, offset) => electron.ipcRenderer.invoke("instance:curseforgeSearch", query, mcVersion, loader, classId, offset),
  curseforgeGetFiles: (modId, mcVersion, loader) => electron.ipcRenderer.invoke("instance:curseforgeGetFiles", modId, mcVersion, loader),
  getServers: (instanceId) => electron.ipcRenderer.invoke("instance:getServers", instanceId),
  addServer: (instanceId, name, ip) => electron.ipcRenderer.invoke("instance:addServer", instanceId, name, ip),
  removeServer: (instanceId, index) => electron.ipcRenderer.invoke("instance:removeServer", instanceId, index),
  downloadFile: (instanceId, downloadUrl, fileName, subFolder) => electron.ipcRenderer.invoke("instance:downloadFile", instanceId, downloadUrl, fileName, subFolder),
  createShortcut: (instanceId) => electron.ipcRenderer.invoke("instance:createShortcut", instanceId),
  exportInstance: (instanceId) => electron.ipcRenderer.invoke("instance:export", instanceId),
  importInstance: (filePath) => electron.ipcRenderer.invoke("instance:import", filePath),
  openFileDialog: (options) => electron.ipcRenderer.invoke("dialog:openFile", options),
  setInstanceIcon: (instanceId) => electron.ipcRenderer.invoke("instance:setIcon", instanceId),
  getInstanceIconPath: (instanceId, iconFile) => electron.ipcRenderer.invoke("instance:getIconPath", instanceId, iconFile),
  getInstanceIconData: (instanceId, iconFile) => electron.ipcRenderer.invoke("instance:getIconData", instanceId, iconFile),
  getScreenshot: (instanceId, fileName) => electron.ipcRenderer.invoke("instance:getScreenshot", instanceId, fileName),
  openFile: (instanceId, subPath) => electron.ipcRenderer.invoke("instance:openFile", instanceId, subPath),
  readLog: (instanceId) => electron.ipcRenderer.invoke("instance:readLog", instanceId),
  watchLog: (instanceId) => electron.ipcRenderer.invoke("instance:watchLog", instanceId),
  installModrinthModpack: (versionId, instanceName, group) => electron.ipcRenderer.invoke("instance:installModrinthModpack", versionId, instanceName, group),
  openExternalUrl: (url) => electron.ipcRenderer.invoke("open:external", url),
  checkManualFiles: (instanceId, fileNames, downloadsPath) => electron.ipcRenderer.invoke("instance:checkManualFiles", instanceId, fileNames, downloadsPath),
  getDownloadsPath: () => electron.ipcRenderer.invoke("get:downloadsPath"),
  onModpackProgress: (callback) => electron.ipcRenderer.on("modpack:progress", (_e, msg) => callback(msg)),
  installCurseForgeModpack: (fileId, projectId, instanceName, group) => electron.ipcRenderer.invoke("instance:installCurseForgeModpack", fileId, projectId, instanceName, group),
  cfModpackSearch: (query, offset) => electron.ipcRenderer.invoke("instance:cfModpackSearch", query, offset),
  cfModpackFiles: (modId) => electron.ipcRenderer.invoke("instance:cfModpackFiles", modId),
  openLauncherFolder: (key) => electron.ipcRenderer.invoke("launcher:openFolder", key),
  clearMetadataCache: () => electron.ipcRenderer.invoke("launcher:clearMetadataCache"),
  openAbout: () => electron.ipcRenderer.invoke("launcher:openAbout"),
  onUpdateAvailable: (cb) => electron.ipcRenderer.on("update:available", cb),
  onUpdateDownloaded: (cb) => electron.ipcRenderer.on("update:downloaded", cb),
  installUpdate: () => electron.ipcRenderer.invoke("update:install"),
  // settings
  openSettings: () => electron.ipcRenderer.invoke("window:settings"),
  // java
  detectJava: () => electron.ipcRenderer.invoke("java:detect"),
  browseJava: () => electron.ipcRenderer.invoke("java:browse"),
  downloadJava: (version) => electron.ipcRenderer.invoke("java:download", version),
  getJavaInstalls: () => electron.ipcRenderer.invoke("java:installs"),
  getMojangJavaVersions: () => electron.ipcRenderer.invoke("java:mojangVersions"),
  downloadMojangJava: (component) => electron.ipcRenderer.invoke("java:downloadMojang", component),
  // accounts
  addMicrosoftAccount: () => electron.ipcRenderer.invoke("accounts:addMicrosoft"),
  removeAccount: (id) => electron.ipcRenderer.invoke("accounts:remove", id),
  getAccounts: () => electron.ipcRenderer.invoke("accounts:get"),
  setActiveAccount: (id) => electron.ipcRenderer.invoke("accounts:setActive", id),
  refreshAccount: (id) => electron.ipcRenderer.invoke("accounts:refresh", id),
  // on events (main -> renderer)
  on: (channel, callback) => {
    electron.ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  },
  off: (channel, callback) => {
    electron.ipcRenderer.off(channel, (_event, ...args) => callback(...args));
  }
});
