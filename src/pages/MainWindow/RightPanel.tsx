import { useI18n } from '../../hooks/useI18n'
import styles from './RightPanel.module.css'
import { useInstanceStore } from '../../store/instanceStore'
import { useState, useEffect } from 'react'

interface Props {
  instance: Instance
}

function RightPanel({ instance }: Props) {
  const { t } = useI18n()

  const handleLaunch = async () => {
    const running = await window.electron.isInstanceRunning(instance.id)
    if (running) return
    const cfg = await window.electron.getConfig()
    if (cfg.minecraft.showConsoleOnLaunch) {
      await window.electron.openConsole(instance.id)
    }
    window.electron.launchInstance(instance.id)
  }
  const handleDelete = () => window.electron.deleteInstance(instance.id)
  const handleCopy = () => window.electron.copyInstance(instance.id)
  const handleEdit = () => window.electron.openInstanceEditor(instance.id)
  const handleFolder = () => window.electron.openInstanceFolder(instance.id, 'minecraft')
  const handleShortcut = () => window.electron.createShortcut(instance.id)
  const handleExport = () => window.electron.exportInstance(instance.id)
  const handleKill = () => window.electron.killInstance(instance.id)

  const formatPlayTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    if (h > 0) return `${h}h ${m}min`
    return `${m}min`
  }

  const [editingGroup, setEditingGroup] = useState(false)
  const [groupInput, setGroupInput] = useState(instance.group || '')

  // Get all existing groups for autocomplete
  const { instances } = useInstanceStore()
  const existingGroups = [...new Set(instances.map(i => i.group).filter(Boolean))]

  const handleChangeGroup = async () => {
    await window.electron.updateInstance({ ...instance, group: groupInput })
    setEditingGroup(false)
  }

  const [iconSrc, setIconSrc] = useState<string | null>(null)

  useEffect(() => {
    if (instance.icon && instance.icon !== 'default') {
      window.electron.getInstanceIconData(instance.id, instance.icon).then(setIconSrc)
    } else {
      setIconSrc(null)
    }
  }, [instance.icon, instance.id])

  const handleIconClick = async () => {
    const iconPath = await window.electron.setInstanceIcon(instance.id)
    if (iconPath) {
      window.electron.getInstanceIconData(instance.id, instance.icon).then(setIconSrc)
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.icon} onClick={handleIconClick} title="Click to change icon" style={{ cursor: 'pointer' }}>
        {iconSrc
          ? <img src={iconSrc} className={styles.iconImg} alt="" />
          : <div className={styles.iconInner} />
        }
        <div className={styles.iconOverlay}>📷</div>
      </div>

      <div className={styles.name}>{instance.name}</div>
      <div className={styles.version}>{instance.version}</div>
      {instance.modLoader !== 'none' && (
        <div className={styles.loader}>{instance.modLoader}</div>
      )}

      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.launch} primary`} onClick={handleLaunch}>
          ▶ {t('instance.launch')}
        </button>
        <button className={`${styles.btn} ${styles.kill} danger`} onClick={handleKill}>
          ✕ {t('instance.kill')}
        </button>
        <div className={styles.sep} />
        <button className={styles.btn} onClick={handleEdit}>✎ {t('instance.edit')}</button>
        {editingGroup ? (
          <div className={styles.groupEditor}>
            <input
              className={styles.groupInput}
              value={groupInput}
              onChange={e => setGroupInput(e.target.value)}
              placeholder="Group name (empty = ungrouped)"
              list="group-suggestions"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleChangeGroup(); if (e.key === 'Escape') setEditingGroup(false) }}
            />
            <datalist id="group-suggestions">
              {existingGroups.map(g => <option key={g} value={g} />)}
            </datalist>
            <button className={`${styles.btn} primary`} onClick={handleChangeGroup}>✓</button>
            <button className={styles.btn} onClick={() => setEditingGroup(false)}>✕</button>
          </div>
        ) : (
          <button className={styles.btn} onClick={() => { setGroupInput(instance.group || ''); setEditingGroup(true) }}>
            ⊞ {t('instance.changeGroup')}
          </button>
        )}
        <button className={styles.btn} onClick={handleFolder}>📁 {t('instance.folder')}</button>
        <button className={styles.btn} onClick={handleExport}>↗ {t('instance.export')}</button>
        <button className={styles.btn} onClick={handleCopy}>⎘ {t('instance.copy')}</button>
        <button className={`${styles.btn} danger`} onClick={handleDelete}>
          🗑 {t('instance.delete')}
        </button>
        <button className={styles.btn} onClick={handleShortcut}>🔗 {t('instance.createShortcut')}</button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t('instance.lastPlayed')}</span>
          <span className={styles.statValue}>
            {instance.lastPlayed
              ? new Date(instance.lastPlayed).toLocaleDateString()
              : t('instance.never')}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{t('instance.totalPlayTime')}</span>
          <span className={styles.statValue}>{formatPlayTime(instance.totalPlayTime)}</span>
        </div>
      </div>
    </div>
  )
}

export default RightPanel