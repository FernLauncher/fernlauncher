import { useSettingsStore } from '../../store/settingsStore'
import styles from './SettingsPage.module.css'

function Appearance() {
  const { config, set } = useSettingsStore()

  return (
    <div className={styles.page}>
      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>Theme</span>
          <select
            className={styles.select}
            value={config.theme}
            onChange={e => set('theme', e.target.value as 'dark' | 'light' | 'system')}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
          <button>Open Folder</button>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Icons</span>
          <select
            className={styles.select}
            value={config.appearance.iconTheme}
            onChange={e => set('appearance', { ...config.appearance, iconTheme: e.target.value })}
          >
            <option>Simple (Colored)</option>
            <option>Simple (White)</option>
          </select>
          <button>Open Folder</button>
        </div>
        <div className={styles.row}>
          <button>Reload All</button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.row}>
          <span className={styles.label}>Console Font</span>
          <select
            className={styles.select}
            style={{ width: 160 }}
            value={config.appearance.consoleFont}
            onChange={e => set('appearance', { ...config.appearance, consoleFont: e.target.value })}
          >
            <option>DejaVu Sans</option>
            <option>Consolas</option>
            <option>Courier New</option>
          </select>
          <input
            type="number"
            className={styles.input}
            style={{ width: 60 }}
            value={config.appearance.consoleFontSize}
            onChange={e => set('appearance', { ...config.appearance, consoleFontSize: Number(e.target.value) })}
          />
        </div>
      </div>
    </div>
  )
}

export default Appearance