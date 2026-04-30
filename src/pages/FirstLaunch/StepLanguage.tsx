import { useState } from 'react'
import { useI18n } from '../../hooks/useI18n'
import styles from './StepLanguage.module.css'

const LANGUAGES = [
  { code: 'en', name: 'American English', completeness: 100 },
  { code: 'fr', name: 'français', completeness: 20 },
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