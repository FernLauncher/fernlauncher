import { useSettingsStore } from '../../store/settingsStore'
import { useI18n } from '../../hooks/useI18n'
import styles from './SettingsPage.module.css'

function General() {
  const { t } = useI18n()
  const { config, set } = useSettingsStore()

  return (
    <div className={styles.page}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>User Interface</div>
        <div className={styles.row}>
          <span className={styles.label}>Instance Sorting</span>
          <div className={styles.radioGroup}>
            <label className={styles.radio}>
              <input
                type="radio"
                checked={config.instanceSorting === 'name'}
                onChange={() => set('instanceSorting', 'name')}
              />
              By name
            </label>
            <label className={styles.radio}>
              <input
                type="radio"
                checked={config.instanceSorting === 'lastLaunched'}
                onChange={() => set('instanceSorting', 'lastLaunched')}
              />
              By last launched
            </label>
          </div>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Instance Renaming</span>
          <div className={styles.radioGroup}>
            {(['ask', 'always', 'never'] as const).map(v => (
              <label key={v} className={styles.radio}>
                <input
                  type="radio"
                  checked={config.instanceRenaming === v}
                  onChange={() => set('instanceRenaming', v)}
                />
                {v === 'ask' ? 'Ask what to do' : v === 'always' ? 'Always rename the folder' : 'Never rename the folder'}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Updater</div>
        <div className={styles.row}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={config.checkUpdates}
              onChange={e => set('checkUpdates', e.target.checked)}
            />
            Check for updates automatically
          </label>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>How Often?</span>
          <select
            className={styles.select}
            value={config.updateInterval}
            onChange={e => set('updateInterval', e.target.value)}
          >
            <option>Every 24 hours</option>
            <option>Every 12 hours</option>
            <option>Every week</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Folders</div>
        {([
          ['Instances', 'instances'],
          ['Mods', 'mods'],
          ['Icons', 'icons'],
          ['Java', 'java'],
          ['Skins', 'skins'],
          ['Downloads', 'downloads'],
        ] as const).map(([label, key]) => (
          <div key={key} className={styles.row}>
            <span className={styles.label}>{label}:</span>
            <input
              className={styles.input}
              value={config.folders[key]}
              onChange={e => set('folders', { ...config.folders, [key]: e.target.value })}
            />
            <button>{t('common.browse')}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default General