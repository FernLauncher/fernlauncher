import { app } from 'electron'
import path from 'path'

const appData = app.getPath('userData')

export const Paths = {
  appData,
  instances: path.join(appData, 'instances'),
  java:      path.join(appData, 'java'),
  icons:     path.join(appData, 'icons'),
  skins:     path.join(appData, 'skins'),
  mods:      path.join(appData, 'mods'),
  logs:      path.join(appData, 'logs'),
  config:    path.join(appData, 'config.json'),
  accounts:  path.join(appData, 'accounts.json'),
}