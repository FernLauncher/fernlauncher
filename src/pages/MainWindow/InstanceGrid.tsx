import { useInstanceStore } from '../../store/instanceStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useI18n } from '../../hooks/useI18n'
import { useState, useEffect } from 'react'
import styles from './InstanceGrid.module.css'

function InstanceIcon({ instance }: { instance: Instance }) {
  const [iconSrc, setIconSrc] = useState<string | null>(null)

  useEffect(() => {
    if (instance.icon && instance.icon !== 'default') {
      window.electron.getInstanceIconData(instance.id, instance.icon).then(p => setIconSrc(p))
    } else {
      setIconSrc(null)
    }
  }, [instance.icon, instance.id])

  return (
    <div className={styles.icon}>
      {iconSrc
        ? <img src={iconSrc} className={styles.iconImg} alt="" />
        : <div className={styles.iconInner} />
      }
    </div>
  )
}

function InstanceCard({ instance }: { instance: Instance }) {
  const { selectedId, select } = useInstanceStore()
  const isSelected = selectedId === instance.id

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={() => select(instance.id)}
      onDoubleClick={() => window.electron.launchInstance(instance.id)}
    >
      <InstanceIcon instance={instance} />
      <span className={styles.name}>{instance.name}</span>
      {instance.modLoader !== 'none' && (
        <span className={styles.loader}>{instance.modLoader}</span>
      )}
    </div>
  )
}

function InstanceGrid() {
  const { t } = useI18n()
  const { instances } = useInstanceStore()
  const { config } = useSettingsStore()

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
              <InstanceCard key={instance.id} instance={instance} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default InstanceGrid