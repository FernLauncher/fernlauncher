import { useSettingsStore } from '../../store/settingsStore'
import styles from './SettingsPage.module.css'

function Tools() {
  const { config, set } = useSettingsStore()
  const tools = config.tools

  return (
    <div className={styles.page}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Editors</div>
        <div className={styles.fieldBlock}>
          <label className={styles.fieldBlockLabel}>Text Editor</label>
          <div className={styles.row}>
            <input className={styles.input} value={tools.textEditor}
              onChange={e => set('tools', { ...tools, textEditor: e.target.value })} />
            <button>Browse</button>
          </div>
          <p className={styles.hint}>Used to edit component JSON files.</p>
        </div>
        <div className={styles.fieldBlock}>
          <label className={styles.fieldBlockLabel}>MCEdit</label>
          <div className={styles.row}>
            <input className={styles.input} value={tools.mcedit}
              onChange={e => set('tools', { ...tools, mcedit: e.target.value })} />
            <button>Browse</button>
          </div>
          <button style={{ marginTop: 4 }}>Check</button>
          <p className={styles.hint}>MCEdit Website — Used as world editor in the instance Worlds menu.</p>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Profilers</div>
        <p className={styles.hint}>Profilers are accessible through the Launch dropdown menu.</p>
        <div className={styles.fieldBlock}>
          <label className={styles.fieldBlockLabel}>JProfiler</label>
          <div className={styles.row}>
            <input className={styles.input} value={tools.jprofiler}
              onChange={e => set('tools', { ...tools, jprofiler: e.target.value })} />
            <button>Browse</button>
          </div>
          <button style={{ marginTop: 4 }}>Check</button>
        </div>
        <div className={styles.fieldBlock}>
          <label className={styles.fieldBlockLabel}>VisualVM</label>
          <div className={styles.row}>
            <input className={styles.input} value={tools.visualvm}
              onChange={e => set('tools', { ...tools, visualvm: e.target.value })} />
            <button>Browse</button>
          </div>
          <button style={{ marginTop: 4 }}>Check</button>
        </div>
      </div>
    </div>
  )
}

export default Tools