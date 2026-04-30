import { useState, useEffect } from 'react'
import { useAccountStore } from '../../store/accountStore'
import { useI18n } from '../../hooks/useI18n'
import styles from './SettingsPage.module.css'

function Accounts() {
  const { t } = useI18n()
  const { accounts, load, setActive } = useAccountStore()

  useEffect(() => {
    load()
    window.electron.on('accounts:updated', () => load())
    return () => {
      window.electron.off('accounts:updated', () => load())
    }
  }, [])

  const [showOfflineModal, setShowOfflineModal] = useState(false)
  const [offlineUsername, setOfflineUsername] = useState('')

  const handleAddOffline = async () => {
    if (!offlineUsername.trim()) return
    await window.electron.addOfflineAccount(offlineUsername.trim())
    setOfflineUsername('')
    setShowOfflineModal(false)
    load()
  }

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
          <button onClick={() => setShowOfflineModal(true)}>Add Offline</button>
          <button>Refresh</button>
          <button>Remove</button>
          <button onClick={() => window.electron.setActiveAccount('')}>{t('accounts.setDefault')}</button>
          <button>{t('accounts.noDefault')}</button>
          <div style={{ flex: 1 }} />
          <button>{t('accounts.manageSkins')}</button>
        </div>
      </div>
      {showOfflineModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, width: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Add Offline Account</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Offline accounts can only play in singleplayer and on servers that don't require authentication.</div>
            <input
              className={styles.input}
              placeholder="Username"
              value={offlineUsername}
              onChange={e => setOfflineUsername(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddOffline() }}
              autoFocus
              maxLength={16}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowOfflineModal(false)}>Cancel</button>
              <button className="primary" onClick={handleAddOffline} disabled={!offlineUsername.trim()}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Accounts