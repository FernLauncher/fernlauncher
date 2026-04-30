import fs from 'fs'
import path from 'path'
import { Paths } from '../utils/paths'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function readInstance(instancePath: string): Instance | null {
  try {
    const jsonPath = path.join(instancePath, 'instance.json')
    if (!fs.existsSync(jsonPath)) return null
    const raw = fs.readFileSync(jsonPath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeInstance(instance: Instance) {
  const instancePath = path.join(Paths.instances, instance.id)
  if (!fs.existsSync(instancePath)) {
    fs.mkdirSync(instancePath, { recursive: true })
  }
  fs.writeFileSync(
    path.join(instancePath, 'instance.json'),
    JSON.stringify(instance, null, 2)
  )
}

export const instanceManager = {
  getAll(): Instance[] {
    if (!fs.existsSync(Paths.instances)) return []
    const dirs = fs.readdirSync(Paths.instances)
    const instances: Instance[] = []
    for (const dir of dirs) {
      const fullPath = path.join(Paths.instances, dir)
      if (!fs.statSync(fullPath).isDirectory()) continue
      const instance = readInstance(fullPath)
      if (instance) instances.push(instance)
    }
    return instances
  },

  create(data: CreateInstanceData): Instance {
    const id = generateId()
    const instance: Instance = {
      id,
      name: data.name,
      version: data.version,
      modLoader: data.modLoader,
      modLoaderVersion: data.modLoaderVersion,
      icon: data.icon || 'default',
      group: data.group || '',
      lastPlayed: null,
      totalPlayTime: 0,
      createdAt: new Date().toISOString(),
    }
    const instancePath = path.join(Paths.instances, id)
    fs.mkdirSync(path.join(instancePath, 'minecraft'), { recursive: true })
    writeInstance(instance)
    return instance
  },

  delete(id: string): void {
    const instancePath = path.join(Paths.instances, id)
    if (fs.existsSync(instancePath)) {
      fs.rmSync(instancePath, { recursive: true, force: true })
    }
  },

  copy(id: string): Instance {
    const instancePath = path.join(Paths.instances, id)
    const original = readInstance(instancePath)
    if (!original) throw new Error(`Instance ${id} not found`)
    const newId = generateId()
    const newInstance: Instance = {
      ...original,
      id: newId,
      name: original.name + ' (Copy)',
      lastPlayed: null,
      totalPlayTime: 0,
      createdAt: new Date().toISOString(),
    }
    const newPath = path.join(Paths.instances, newId)
    fs.mkdirSync(path.join(newPath, 'minecraft'), { recursive: true })
    writeInstance(newInstance)
    return newInstance
  },

  launch(id: string): void {
    // placeholder — we'll implement this properly when we get to java/auth
    console.log(`Launching instance ${id}`)
  },

  updatePlayTime(id: string, secondsPlayed: number): void {
    const instancePath = path.join(Paths.instances, id)
    const instance = readInstance(instancePath)
    if (!instance) return
    instance.lastPlayed = new Date().toISOString()
    instance.totalPlayTime += secondsPlayed
    writeInstance(instance)
  },

  update(instance: Instance): void {
    writeInstance(instance)
  },
}