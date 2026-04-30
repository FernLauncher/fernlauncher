import { useState, useRef, useEffect } from 'react'
import { useAccountStore } from '../../store/accountStore'
import { useI18n } from '../../hooks/useI18n'
import styles from './Toolbar.module.css'

interface Props {
  onAddInstance?: () => void
}

function Toolbar({ onAddInstance }: Props) {
  const { t } = useI18n()
  const { accounts, active, setActive } = useAccountStore()
  const activeAccount = active()
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showFoldersMenu, setShowFoldersMenu] = useState(false)
  const [showHelpMenu, setShowHelpMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) {
        setShowAccountMenu(false)
        setShowFoldersMenu(false)
        setShowHelpMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key) - 1
        if (accounts[idx]) setActive(accounts[idx].id)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [accounts])

  const closeMenus = () => {
    setShowAccountMenu(false)
    setShowFoldersMenu(false)
    setShowHelpMenu(false)
  }

  const folders: { label: string, key: string }[] = [
    { label: 'Launcher Root', key: 'root' },
    { label: 'Instances', key: 'instances' },
    { label: 'Central Mods', key: 'mods' },
    { label: 'Skins', key: 'skins' },
    { label: 'Java', key: 'java' },
    { label: 'Icons', key: 'icons' },
    { label: 'Logs', key: 'logs' },
  ]

  const handleOpenFolder = (key: string) => {
    window.electron.openLauncherFolder(key)
    closeMenus()
  }

  const handleHelpItem = (item: string) => {
    closeMenus()
    switch (item) {
      case 'Report a Bug or Suggest a Feature':
        window.electron.openExternalUrl('https://github.com/FernLauncher/fernlauncher/issues')
        break
      case 'Discord':
        window.electron.openExternalUrl('https://discord.gg/fernlaunch')
        break
      case 'About Fernlaunch':
        window.electron.openAbout()
        break
      case 'View logs':
        window.electron.openLauncherFolder('logs')
        break
      case 'Clear Metadata Cache':
        window.electron.clearMetadataCache()
        break
    }
  }

  return (
    <div className={styles.toolbar} ref={menuRef}>
      <button className={styles.btn} onClick={onAddInstance}>
        <span className={styles.icon}>+</span>
        {t('toolbar.addInstance')}
      </button>

      <div className={styles.relative}>
        <button className={styles.btn} onClick={() => { setShowFoldersMenu(v => !v); setShowHelpMenu(false); setShowAccountMenu(false) }}>
          <span className={styles.icon}>📁</span>
          {t('toolbar.folders')}
        </button>
        {showFoldersMenu && (
          <div className={styles.menu}>
            {folders.map(f => (
              <div key={f.key} className={styles.menuItem} onClick={() => handleOpenFolder(f.key)}>
                {f.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <button className={styles.btn} onClick={() => window.electron.openSettings()}>
        <span className={styles.icon}>⚙</span>
        {t('toolbar.settings')}
      </button>

      <div className={styles.relative}>
        <button className={styles.btn} onClick={() => { setShowHelpMenu(v => !v); setShowFoldersMenu(false); setShowAccountMenu(false) }}>
          <span className={styles.icon}>?</span>
          {t('toolbar.help')}
        </button>
        {showHelpMenu && (
          <div className={styles.menu}>
            {['Clear Metadata Cache', 'Report a Bug or Suggest a Feature', 'View logs', 'Discord', 'About Fernlaunch'].map(item => (
              <div key={item} className={styles.menuItem} onClick={() => handleHelpItem(item)}>{item}</div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.spacer} />

      <div className={styles.relative}>
        <button className={`${styles.btn} ${styles.accountBtn}`} onClick={() => { setShowAccountMenu(v => !v); setShowFoldersMenu(false); setShowHelpMenu(false) }}>
          <span className={styles.icon}>👤</span>
          {activeAccount?.minecraftUsername ?? 'No account'}
        </button>
        {showAccountMenu && (
          <div className={`${styles.menu} ${styles.menuRight}`}>
            {accounts.map((a, i) => (
              <div key={a.id} className={`${styles.menuItem} ${a.isActive ? styles.menuItemActive : ''}`} onClick={() => { setActive(a.id); closeMenus() }}>
                {a.minecraftUsername}
                <span className={styles.menuKbd}>Ctrl+{i + 1}</span>
              </div>
            ))}
            <div className={styles.menuSep} />
            <div className={styles.menuItem} onClick={() => { window.electron.openSettings(); closeMenus() }}>
              Manage Accounts…
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Toolbar