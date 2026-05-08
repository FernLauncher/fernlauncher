import { useInstanceStore } from '../../store/instanceStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useI18n } from '../../hooks/useI18n'
import { useState, useEffect, useRef } from 'react'
import styles from './InstanceGrid.module.css'

function InstanceIcon({ instance }: { instance: Instance }) {
  const [iconSrc, setIconSrc] = useState<string | null>(null)
  const instanceRef = useRef(instance)
  useEffect(() => { instanceRef.current = instance }, [instance])

  useEffect(() => {
    const loadIcon = () => {
      const inst = instanceRef.current
      if (inst.icon && inst.icon !== 'default') {
        window.electron.getInstanceIconData(inst.id, inst.icon).then(p => setIconSrc(p))
      } else {
        setIconSrc(null)
      }
    }

    loadIcon()
    window.electron.on('instances:updated', loadIcon)
    return () => window.electron.off('instances:updated', loadIcon)
  }, [])

  return (
    <div className={styles.icon}>
      {iconSrc
        ? <img src={iconSrc} className={styles.iconImg} alt="" />
        : <div className={styles.iconInner} />
      }
    </div>
  )
}

function InstanceCard({ instance, isRenaming, onRenameComplete }: {
  instance: Instance
  isRenaming?: boolean
  onRenameComplete?: () => void
}) {
  const { selectedId, select } = useInstanceStore()
  const isSelected = selectedId === instance.id
  const [newName, setNewName] = useState(instance.name)

  useEffect(() => {
    if (isRenaming) setNewName(instance.name)
  }, [isRenaming, instance.name])

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    select(instance.id)
    window.electron.showInstanceContextMenu(instance.id)
  }

  const handleRename = async () => {
    if (newName.trim() && newName !== instance.name) {
      await window.electron.updateInstance({ ...instance, name: newName.trim() })
    }
    onRenameComplete?.()
  }

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={() => select(instance.id)}
      onDoubleClick={() => window.electron.launchInstance(instance.id)}
      onContextMenu={handleContextMenu}
    >
      <InstanceIcon instance={instance} />
      {isRenaming ? (
        <input
          className={styles.renameInput}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={e => {
            if (e.key === 'Enter') handleRename()
            if (e.key === 'Escape') onRenameComplete?.()
          }}
          autoFocus
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span className={styles.name}>{instance.name}</span>
      )}
      {instance.modLoader !== 'none' && (
        <span className={styles.loader}>{instance.modLoader}</span>
      )}
    </div>
  )
}

function InstanceGrid() {
  const { t } = useI18n()
  const { instances, remove } = useInstanceStore()
  const { config } = useSettingsStore()
  const [renamingId, setRenamingId] = useState<string | null>(null)

  const removeRef = useRef(remove)
  useEffect(() => { removeRef.current = remove }, [remove])

  useEffect(() => {
    const handler = async ({ action, instanceId }: { action: string, instanceId: string }) => {
      switch (action) {
        case 'launch': window.electron.launchInstance(instanceId); break
        case 'kill': window.electron.killInstance(instanceId); break
        case 'edit': window.electron.openInstanceEditor(instanceId); break
        case 'folder': window.electron.openInstanceFolder(instanceId, 'minecraft'); break
        case 'export': window.electron.exportInstance(instanceId); break
        case 'copy': window.electron.copyInstance(instanceId); break
        case 'shortcut': window.electron.createShortcut(instanceId); break
        case 'changeIcon': window.electron.setInstanceIcon(instanceId); break
        case 'rename': setRenamingId(instanceId); break
        case 'delete':
          removeRef.current(instanceId)
          window.electron.deleteInstance(instanceId)
          break
      }
    }
    window.electron.onInstanceAction(handler)
  }, [])

  const sortedInstances = [...instances].sort((a, b) => {
    if (config.instanceSorting === 'lastLaunched') {
      const aTime = a.lastPlayed ? new Date(a.lastPlayed).getTime() : 0
      const bTime = b.lastPlayed ? new Date(b.lastPlayed).getTime() : 0
      return bTime - aTime
    }
    return a.name.localeCompare(b.name)
  })

  const groups = sortedInstances.reduce((acc, instance) => {
    const group = instance.group || t('instance.ungrouped')
    if (!acc[group]) acc[group] = []
    acc[group].push(instance)
    return acc
  }, {} as Record<string, Instance[]>)

  if (instances.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🌿</div>
        <p className={styles.emptyText}>No instances yet</p>
        <p className={styles.emptyHint}>Click "Add Instance" to get started</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {Object.entries(groups).map(([group, items]) => (
        <div key={group}>
          <div className={styles.groupLabel}>
            <span>▾ {group}</span>
            <div className={styles.groupLine} />
          </div>
          <div className={styles.grid}>
            {items.map(instance => (
              <InstanceCard
                key={instance.id}
                instance={instance}
                isRenaming={renamingId === instance.id}
                onRenameComplete={() => setRenamingId(null)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default InstanceGrid