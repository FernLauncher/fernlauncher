import { useState } from 'react'
import { useI18n } from '../../hooks/useI18n'
import styles from './StepLanguage.module.css'

const LANGUAGES = [
  { code: 'en', name: 'American English', completeness: 100 },
  { code: 'af', name: 'Afrikaans', completeness: 6.3 },
  { code: 'en-au', name: 'Australian English', completeness: 100 },
  { code: 'az', name: 'azərbaycan', completeness: 99.7 },
  { code: 'en-gb', name: 'British English', completeness: 100 },
  { code: 'en-ca', name: 'Canadian English', completeness: 100 },
  { code: 'ca', name: 'català', completeness: 63.1 },
  { code: 'ceb', name: 'Cebuano', completeness: 62 },
  { code: 'en-cute', name: 'Cute Engwish', completeness: 100 },
  { code: 'cy', name: 'Cymraeg', completeness: 4 },
  { code: 'da', name: 'dansk', completeness: 94.1 },
  { code: 'de', name: 'Deutsch', completeness: 100 },
  { code: 'et', name: 'eesti', completeness: 68.8 },
  { code: 'es', name: 'español de España', completeness: 99.7 },
  { code: 'es-419', name: 'Español de Latinoamérica', completeness: 83.2 },
  { code: 'eo', name: 'Esperanto', completeness: 29.9 },
  { code: 'eu', name: 'euskara', completeness: 15.3 },
  { code: 'fil', name: 'Filipino', completeness: 52.8 },
  { code: 'fr', name: 'français', completeness: 100 },
  { code: 'fr-ca', name: 'français canadien', completeness: 61.7 },
  { code: 'fy', name: 'Frysk', completeness: 0.2 },
  { code: 'fur', name: 'furlan', completeness: 81.5 },
  { code: 'ga', name: 'Gaeilge', completeness: 100 },
  { code: 'gd', name: 'Gaelg', completeness: 0.6 },
  { code: 'gl', name: 'galego', completeness: 49 },
  { code: 'hr', name: 'hrvatski', completeness: 43.2 },
  { code: 'id', name: 'Indonesia', completeness: 100 },
  { code: 'it', name: 'italiano', completeness: 100 },
  { code: 'ja', name: '日本語', completeness: 100 },
  { code: 'ko', name: '한국어', completeness: 100 },
  { code: 'nl', name: 'Nederlands', completeness: 100 },
  { code: 'nb', name: 'norsk bokmål', completeness: 100 },
  { code: 'pl', name: 'polski', completeness: 100 },
  { code: 'pt', name: 'português', completeness: 100 },
  { code: 'pt-br', name: 'português brasileiro', completeness: 100 },
  { code: 'ro', name: 'română', completeness: 100 },
  { code: 'ru', name: 'русский', completeness: 100 },
  { code: 'zh-cn', name: '中文（简体）', completeness: 100 },
  { code: 'zh-tw', name: '中文（繁體）', completeness: 100 },
]

interface Props {
  onSelect: (lang: string) => void
}

function StepLanguage({ onSelect }: Props) {
  const { t } = useI18n()
  const [selected, setSelected] = useState('en')
  const [search, setSearch] = useState('')

  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('firstLaunch.stepLanguage')}</h2>
      <p className={styles.hint}>{t('firstLaunch.languageHint')}</p>

      <input
        className={styles.search}
        type="text"
        placeholder={t('common.search')}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className={styles.list}>
        <div className={styles.listHeader}>
          <span>Language</span>
          <span>Completeness</span>
        </div>
        {filtered.map(lang => (
          <div
            key={lang.code}
            className={`${styles.item} ${selected === lang.code ? styles.selected : ''}`}
            onClick={() => setSelected(lang.code)}
            onDoubleClick={() => onSelect(lang.code)}
          >
            <span>{lang.name}</span>
            <span className={styles.completeness}>{lang.completeness}%</span>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button
          className="primary"
          onClick={() => onSelect(selected)}
        >
          {t('firstLaunch.next')} →
        </button>
      </div>
    </div>
  )
}

export default StepLanguage