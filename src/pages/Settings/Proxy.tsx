import { useSettingsStore } from '../../store/settingsStore'
import styles from './SettingsPage.module.css'

function Proxy() {
  const { config, set } = useSettingsStore()
  const proxy = config.proxy

  return (
    <div className={styles.page}>
      <p className={styles.hint}>This only applies to the launcher. Minecraft does not accept proxy settings.</p>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Type</div>
        {(['system', 'none', 'socks5', 'http'] as const).map(type => (
          <label key={type} className={styles.radio}>
            <input
              type="radio"
              name="proxyType"
              checked={proxy.type === type}
              onChange={() => set('proxy', { ...proxy, type })}
            />
            {type === 'system' ? 'Use system settings' : type === 'none' ? 'None' : type.toUpperCase()}
          </label>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Address and Port</div>
        <div className={styles.row}>
          <input
            className={styles.input}
            value={proxy.address}
            onChange={e => set('proxy', { ...proxy, address: e.target.value })}
          />
          <input
            type="number"
            className={styles.input}
            style={{ width: 80 }}
            value={proxy.port}
            onChange={e => set('proxy', { ...proxy, port: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Authentication</div>
        <div className={styles.row}>
          <span className={styles.label}>Username:</span>
          <input
            className={styles.input}
            value={proxy.username}
            onChange={e => set('proxy', { ...proxy, username: e.target.value })}
          />
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Password:</span>
          <input
            type="password"
            className={styles.input}
            value={proxy.password}
            onChange={e => set('proxy', { ...proxy, password: e.target.value })}
          />
        </div>
        <p className={styles.hint}>Note: Proxy username and password are stored in plain text inside the launcher's configuration file!</p>
      </div>
    </div>
  )
}

export default Proxy