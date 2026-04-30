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
  createInstance: (data) => electron.ipcRenderer.invoke("instances:create", data),
  deleteInstance: (id) => electron.ipcRenderer.invoke("instances:delete", id),
  copyInstance: (id) => electron.ipcRenderer.invoke("instances:copy", id),
  launchInstance: (id) => electron.ipcRenderer.invoke("instances:launch", id),
  // java
  detectJava: () => electron.ipcRenderer.invoke("java:detect"),
  downloadJava: (version) => electron.ipcRenderer.invoke("java:download", version),
  getJavaInstalls: () => electron.ipcRenderer.invoke("java:installs"),
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
