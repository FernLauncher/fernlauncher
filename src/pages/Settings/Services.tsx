import { useSettingsStore } from '../../store/settingsStore'
import styles from './SettingsPage.module.css'

function Services() {
  const { config, set } = useSettingsStore()
  const s = config.services

  return (
    <div className={styles.page}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Pastebin Service</div>
        <div className={styles.row}>
          <span className={styles.label}>Paste Service Type</span>
          <select className={styles.select} style={{ width: 120 }}
            value={s.pasteService}
            onChange={e => set('services', { ...s, pasteService: e.target.value })}
          >
            <option>mclo.gs</option>
            <option>Pastebin</option>
          </select>
        </div>
        <div className={styles.fieldBlock}>
          <label className={styles.fieldBlockLabel}>Base URL</label>
          <input className={styles.input} value={s.pasteBaseUrl}
            onChange={e => set('services', { ...s, pasteBaseUrl: e.target.value })} />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Metadata Server</div>
        <p className={styles.hint}>You can set this to a third-party metadata server to use patched libraries or other hacks.</p>
        <input className={styles.input} value={s.metaServer}
          onChange={e => set('services', { ...s, metaServer: e.target.value })} />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Assets Server</div>
        <p className={styles.hint}>You can set this to another server if you have problems with downloading assets.</p>
        <input className={styles.input} value={s.assetsServer}
          onChange={e => set('services', { ...s, assetsServer: e.target.value })} />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>User Agent</div>
        <input className={styles.input} placeholder="FernLauncher/$LAUNCHER_VER" value={s.userAgent}
          onChange={e => set('services', { ...s, userAgent: e.target.value })} />
        <p className={styles.hint} style={{ marginTop: 4 }}>The special string $LAUNCHER_VER will be replaced with the version of the launcher.</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>API Keys</div>
        {([
          ['Microsoft Authentication', 'microsoftApiKey'],
          ['Modrinth', 'modrinthApiKey'],
          ['CurseForge', 'curseforgeApiKey'],
          ['Technic', 'technicApiKey'],
        ] as const).map(([label, key]) => (
          <div key={key} className={styles.fieldBlock}>
            <label className={styles.fieldBlockLabel}>{label}</label>
            <input className={styles.input} placeholder="Use Default" value={s[key]}
              onChange={e => set('services', { ...s, [key]: e.target.value })} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Services