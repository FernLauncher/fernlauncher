import { useSettingsStore } from '../../store/settingsStore'
import { setLanguage } from '../../hooks/useI18n'
import styles from './SettingsPage.module.css'

const LANGUAGES = [
  { code: 'en', name: 'American English', completeness: 100 },
  { code: 'fr', name: 'français', completeness: 20 },
]

const COMING_SOON = [
  'Deutsch', 'español de España', '日本語', '한국어', 'русский',
  'português brasileiro', 'Nederlands', 'polski', '中文（简体）', '中文（繁體）',
  'italiano', 'azərbaycan',
]

function Language() {
  const { config, set } = useSettingsStore()

  const handleSelect = async (code: string) => {
    await set('language', code)
    setLanguage(code)
  }

  return (
    <div className={styles.page}>
      <div className={styles.listHeader}>
        <span>Language</span>
        <span>Completeness</span>
      </div>
      <div className={styles.list}>
        {LANGUAGES.map(lang => (
          <div
            key={lang.code}
            className={`${styles.listItem} ${config.language === lang.code ? styles.listItemSelected : ''}`}
            onClick={() => handleSelect(lang.code)}
          >
            <span>{lang.name}</span>
            <span className={styles.completeness}>{lang.completeness}%</span>
          </div>
        ))}
        <div className={styles.listHeader} style={{ marginTop: 12 }}>
          <span>Coming Soon</span>
          <span></span>
        </div>
        {COMING_SOON.map(lang => (
          <div key={lang} className={styles.listItem} style={{ opacity: 0.4, cursor: 'default' }}>
            <span>{lang}</span>
            <span className={styles.completeness}>—</span>
          </div>
        ))}
      </div>
      <div className={styles.hint}>
        Want to help translate Fernlaunch? Contribute on GitHub (Soon)!
      </div>
    </div>
  )
}

export default Language