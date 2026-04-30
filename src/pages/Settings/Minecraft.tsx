import { useState } from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import styles from './SettingsPage.module.css'

const TABS = ['General', 'Tweaks', 'Custom Commands', 'Environment Variables'] as const
type Tab = typeof TABS[number]

function Minecraft() {
  const { config, set } = useSettingsStore()
  const [tab, setTab] = useState<Tab>('General')
  const [envVars, setEnvVars] = useState<{name: string, value: string}[]>([])

  const mc = config.minecraft

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
            <div className={styles.sectionTitle}>Game Window</div>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={mc.startMaximized}
                onChange={e => set('minecraft', { ...mc, startMaximized: e.target.checked })}
              />
              Start Minecraft maximized
            </label>
            <div className={styles.row} style={{ marginTop: 8 }}>
              <span className={styles.label}>Window Size</span>
              <input
                type="number"
                className={styles.input}
                style={{ width: 70 }}
                value={mc.windowWidth}
                onChange={e => set('minecraft', { ...mc, windowWidth: Number(e.target.value) })}
              />
              <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>×</span>
              <input
                type="number"
                className={styles.input}
                style={{ width: 70 }}
                value={mc.windowHeight}
                onChange={e => set('minecraft', { ...mc, windowHeight: Number(e.target.value) })}
              />
              <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>pixels</span>
            </div>
            <label className={styles.checkbox} style={{ marginTop: 8 }}>
              <input
                type="checkbox"
                checked={mc.hideOnLaunch}
                onChange={e => set('minecraft', { ...mc, hideOnLaunch: e.target.checked })}
              />
              When the game window opens, hide the launcher
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={mc.quitOnClose}
                onChange={e => set('minecraft', { ...mc, quitOnClose: e.target.checked })}
              />
              When the game window closes, quit the launcher
            </label>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Console Window</div>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={mc.showConsoleOnLaunch}
                onChange={e => set('minecraft', { ...mc, showConsoleOnLaunch: e.target.checked })}
              />
              When the game is launched, show the console window
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={mc.showConsoleOnCrash}
                onChange={e => set('minecraft', { ...mc, showConsoleOnCrash: e.target.checked })}
              />
              When the game crashes, show the console window
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={mc.hideConsoleOnExit}
                onChange={e => set('minecraft', { ...mc, hideConsoleOnExit: e.target.checked })}
              />
              When the game quits, hide the console window
            </label>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Game Time</div>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={mc.showPlayTime}
                onChange={e => set('minecraft', { ...mc, showPlayTime: e.target.checked })}
              />
              Show time spent playing instances
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={mc.recordPlayTime}
                onChange={e => set('minecraft', { ...mc, recordPlayTime: e.target.checked })}
              />
              Record time spent playing instances
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={mc.showTotalPlayTime}
                onChange={e => set('minecraft', { ...mc, showTotalPlayTime: e.target.checked })}
              />
              Show the total time played across instances
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={mc.showDurationsInHours}
                onChange={e => set('minecraft', { ...mc, showDurationsInHours: e.target.checked })}
              />
              Always show durations in hours
            </label>
          </div>
        </div>
      )}

      {tab === 'Tweaks' && (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Legacy Tweaks</div>
            <label className={styles.checkbox}>
              <input type="checkbox" />
              Enable online fixes (experimental)
            </label>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Native Libraries</div>
            <label className={styles.checkbox}>
              <input type="checkbox" />
              Use system installation of GLFW
            </label>
            <div className={styles.row} style={{ marginTop: 6 }}>
              <span className={styles.label}>GLFW library path:</span>
              <input className={styles.input} placeholder="Path to glfw.dll library file" />
            </div>
            <label className={styles.checkbox} style={{ marginTop: 10 }}>
              <input type="checkbox" />
              Use system installation of OpenAL
            </label>
            <div className={styles.row} style={{ marginTop: 6 }}>
              <span className={styles.label}>OpenAL library path:</span>
              <input className={styles.input} placeholder="Path to OpenAL.dll library file" />
            </div>
          </div>
        </div>
      )}

      {tab === 'Custom Commands' && (
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <div className={styles.fieldBlock}>
              <label className={styles.fieldBlockLabel}>Pre-launch Command</label>
              <input className={styles.input} />
            </div>
            <div className={styles.fieldBlock}>
              <label className={styles.fieldBlockLabel}>Wrapper Command</label>
              <input className={styles.input} />
            </div>
            <div className={styles.fieldBlock}>
              <label className={styles.fieldBlockLabel}>Post-exit Command</label>
              <input className={styles.input} />
            </div>
            <p className={styles.hint}>Pre-launch command runs before the instance launches and post-exit command runs after it exits.</p>
            <p className={styles.hint} style={{ marginTop: 8 }}>Both will be run in the launcher's working folder with extra environment variables:</p>
            <ul className={styles.varList}>
              <li><code>$INST_NAME</code> — Name of the instance</li>
              <li><code>$INST_ID</code> — ID of the instance (its folder name)</li>
              <li><code>$INST_DIR</code> — absolute path of the instance</li>
              <li><code>$INST_MC_DIR</code> — absolute path of Minecraft</li>
              <li><code>$INST_JAVA</code> — Java binary used for launch</li>
              <li><code>$INST_JAVA_ARGS</code> — command-line parameters used for launch</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'Environment Variables' && (
        <div className={styles.tabContent}>
          <div className={styles.envToolbar}>
            <button onClick={() => setEnvVars(v => [...v, { name: '', value: '' }])}>Add</button>
            <button onClick={() => setEnvVars(v => v.slice(0, -1))}>Remove</button>
            <button style={{ marginLeft: 'auto' }} onClick={() => setEnvVars([])}>Clear</button>
          </div>
          <div className={styles.envHeader}>
            <span>Name</span>
            <span>Value</span>
          </div>
          <div className={styles.envList}>
            {envVars.map((env, i) => (
              <div key={i} className={styles.envRow}>
                <input
                  className={styles.input}
                  value={env.name}
                  onChange={e => setEnvVars(v => v.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                />
                <input
                  className={styles.input}
                  value={env.value}
                  onChange={e => setEnvVars(v => v.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Minecraft