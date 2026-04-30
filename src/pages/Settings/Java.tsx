import { useState, useEffect } from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import styles from './SettingsPage.module.css'

const TABS = ['General', 'Installations'] as const
type Tab = typeof TABS[number]

function Java() {
  const { config, set } = useSettingsStore()
  const [tab, setTab] = useState<Tab>('General')
  const [installs, setInstalls] = useState<JavaInstall[]>([])
  const [detecting, setDetecting] = useState(false)
  const [selectedInstall, setSelectedInstall] = useState<JavaInstall | null>(null)

  const java = config.java

  useEffect(() => {
    window.electron.getJavaInstalls().then(setInstalls)

    window.electron.on('java:updated', () => {
      window.electron.getJavaInstalls().then(setInstalls)
    })

    return () => {
      window.electron.off('java:updated', () => {})
    }
  }, [])

  const handleDetect = async () => {
    setDetecting(true)
    const found = await window.electron.detectJava()
    setDetecting(false)
    setInstalls(found)
    if (found.length === 0) {
      alert('No Java installations found.')
      return
    }
    const pick = found[0]
    setSelectedInstall(pick)
    set('java', { ...java, executable: pick.path })
  }

  const handleBrowse = async () => {
    const picked = await window.electron.browseJava()
    if (picked) {
      set('java', { ...java, executable: picked })
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'General' && (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Java Installation</div>
            <div className={styles.sectionTitle} style={{ fontSize: 11, marginBottom: 4 }}>Java Executable</div>
            <div className={styles.row}>
              <input
                className={styles.input}
                value={java.executable}
                onChange={e => set('java', { ...java, executable: e.target.value })}
              />
            </div>
            <div className={styles.row} style={{ marginTop: 6 }}>
              <button onClick={handleDetect} disabled={detecting}>
                {detecting ? 'Detecting…' : 'Detect'}
              </button>
              <button onClick={handleBrowse}>Browse</button>
            </div>

            {installs.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div className={styles.sectionTitle}>Found installations</div>
                <div className={styles.envList}>
                  {installs.map((inst, i) => (
                    <div
                      key={i}
                      className={`${styles.envRow} ${selectedInstall?.path === inst.path ? styles.listItemSelected : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedInstall(inst)
                        set('java', { ...java, executable: inst.path })
                      }}
                    >
                      <span>{inst.version}</span>
                      <span>{inst.architecture}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{inst.path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={java.skipCompatChecks}
                  onChange={e => set('java', { ...java, skipCompatChecks: e.target.checked })}
                />
                Skip Java compatibility checks
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={java.skipSetupPrompt}
                  onChange={e => set('java', { ...java, skipSetupPrompt: e.target.checked })}
                />
                Skip Java setup prompt on startup
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={java.autoDetect}
                  onChange={e => set('java', { ...java, autoDetect: e.target.checked })}
                />
                Auto-detect Java version
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={java.autoDownload}
                  onChange={e => set('java', { ...java, autoDownload: e.target.checked })}
                />
                Auto-download Mojang Java
              </label>
            </div>
            <button style={{ marginTop: 10 }}>Test Settings</button>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Memory</div>
            {([
              ['Minimum Memory Usage', 'minMemory', '-Xms'],
              ['Maximum Memory Usage', 'maxMemory', '-Xmx'],
              ['PermGen Size', 'permGen', '-XX:PermSize'],
            ] as const).map(([label, key, flag]) => (
              <div key={key} className={styles.row}>
                <span className={styles.label}>{label}:</span>
                <input
                  type="number"
                  className={styles.input}
                  style={{ width: 90 }}
                  value={java[key]}
                  onChange={e => set('java', { ...java, [key]: Number(e.target.value) })}
                />
                <span style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 4 }}>MiB</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 8 }}>({flag})</span>
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Java Arguments</div>
            <textarea
              className={styles.textarea}
              value={java.jvmArgs}
              onChange={e => set('java', { ...java, jvmArgs: e.target.value })}
            />
          </div>
        </div>
      )}

      {tab === 'Installations' && (
        <div className={styles.tabContent}>
          <div className={styles.envToolbar}>
            <button onClick={() => window.electron.downloadJava('17')}>Download</button>
            <button>Remove</button>
            <button style={{ marginLeft: 'auto' }} onClick={() => window.electron.getJavaInstalls().then(setInstalls)}>Refresh</button>
          </div>
          <div className={styles.envHeader}>
            <span>Version</span>
            <span>Architecture</span>
            <span>Path</span>
          </div>
          <div className={styles.envList}>
            {installs.map((inst, i) => (
              <div key={i} className={`${styles.envRow} ${inst.isDefault ? styles.listItemSelected : ''}`}>
                <span>{inst.version}</span>
                <span>{inst.architecture}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{inst.path}</span>
              </div>
            ))}
          </div>
          <input className={styles.input} placeholder="Search" style={{ marginTop: 6 }} />
        </div>
      )}
    </div>
  )
}

export default Java