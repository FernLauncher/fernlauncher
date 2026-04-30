import { useSettingsStore } from '../../store/settingsStore'
import { setLanguage } from '../../hooks/useI18n'
import styles from './SettingsPage.module.css'

const LANGUAGES = [
  { code: 'en', name: 'American English', completeness: 100 },
  { code: 'af', name: 'Afrikaans', completeness: 6.3 },
  { code: 'en-au', name: 'Australian English', completeness: 100 },
  { code: 'az', name: 'azərbaycan', completeness: 99.7 },
  { code: 'en-gb', name: 'British English', completeness: 100 },
  { code: 'en-ca', name: 'Canadian English', completeness: 100 },
  { code: 'fr', name: 'français', completeness: 100 },
  { code: 'fr-ca', name: 'français canadien', completeness: 61.7 },
  { code: 'de', name: 'Deutsch', completeness: 100 },
  { code: 'es', name: 'español de España', completeness: 99.7 },
  { code: 'es-419', name: 'Español de Latinoamérica', completeness: 83.2 },
  { code: 'it', name: 'italiano', completeness: 100 },
  { code: 'ja', name: '日本語', completeness: 100 },
  { code: 'ko', name: '한국어', completeness: 100 },
  { code: 'nl', name: 'Nederlands', completeness: 100 },
  { code: 'pl', name: 'polski', completeness: 100 },
  { code: 'pt-br', name: 'português brasileiro', completeness: 100 },
  { code: 'ru', name: 'русский', completeness: 100 },
  { code: 'zh-cn', name: '中文（简体）', completeness: 100 },
  { code: 'zh-tw', name: '中文（繁體）', completeness: 100 },
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
      </div>
      <div className={styles.hint}>
        Don't see your language or the quality is poor? Help us with translations!
      </div>
      <label className={styles.checkbox} style={{ marginTop: 8 }}>
        <input type="checkbox" />
        Use system locales
      </label>
    </div>
  )
}

export default Language