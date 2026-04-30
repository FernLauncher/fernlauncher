import { useEffect } from 'react'
import { useAccountStore } from '../../store/accountStore'
import { useI18n } from '../../hooks/useI18n'
import styles from './SettingsPage.module.css'

function Accounts() {
  const { t } = useI18n()
  const { accounts, load, setActive, remove } = useAccountStore()

  useEffect(() => {
    load()
    window.electron.on('accounts:updated', () => load())
    return () => {
      window.electron.off('accounts:updated', () => load())
    }
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.accountLayout}>
        <div className={styles.accountList}>
          <div className={styles.envHeader}>
            <span>Username</span>
            <span>Account</span>
            <span>Type</span>
            <span>Status</span>
          </div>
          {accounts.map(a => (
            <div
              key={a.id}
              className={`${styles.envRow} ${a.isActive ? styles.listItemSelected : ''}`}
              onClick={() => setActive(a.id)}
            >
              <span>{a.minecraftUsername}</span>
              <span style={{ color: 'var(--text-muted)' }}>{a.username}</span>
              <span>{a.type.toUpperCase()}</span>
              <span className={a.status === 'ready' ? styles.statusOk : styles.statusErr}>
                {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.accountActions}>
          <button className="primary" onClick={() => window.electron.addMicrosoftAccount()}>
            {t('accounts.addMicrosoft')}
          </button>
          <button>Add Offline</button>
          <button>Refresh</button>
          <button>Remove</button>
          <button onClick={() => window.electron.setActiveAccount('')}>{t('accounts.setDefault')}</button>
          <button>{t('accounts.noDefault')}</button>
          <div style={{ flex: 1 }} />
          <button>{t('accounts.manageSkins')}</button>
        </div>
      </div>
    </div>
  )
}

export default Accounts