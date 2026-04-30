import { useState } from 'react'
import { useI18n } from '../../hooks/useI18n'
import styles from './StepTheme.module.css'

const THEMES = [
  {
    id: 'dark' as const,
    labelKey: 'firstLaunch.dark',
    descKey: 'firstLaunch.darkDesc',
    preview: {
      bg: '#1e1e1e',
      secondary: '#2d2d2d',
      accent: '#4CAF50',
      text: '#e0e0e0',
      muted: '#666',
    },
  },
  {
    id: 'light' as const,
    labelKey: 'firstLaunch.light',
    descKey: 'firstLaunch.lightDesc',
    preview: {
      bg: '#f5f5f5',
      secondary: '#e0e0e0',
      accent: '#2e7d32',
      text: '#1a1a1a',
      muted: '#999',
    },
  },
  {
    id: 'system' as const,
    labelKey: 'firstLaunch.system',
    descKey: 'firstLaunch.systemDesc',
    preview: {
      bg: '#2a2a2a',
      secondary: '#3a3a3a',
      accent: '#4CAF50',
      text: '#e0e0e0',
      muted: '#666',
    },
  },
]

interface Props {
  onSelect: (theme: 'dark' | 'light' | 'system') => void
}

function StepTheme({ onSelect }: Props) {
  const { t } = useI18n()
  const [selected, setSelected] = useState<'dark' | 'light' | 'system'>('dark')

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('firstLaunch.stepTheme')}</h2>
      <p className={styles.hint}>{t('firstLaunch.themeHint')}</p>

      <div className={styles.themes}>
        {THEMES.map(theme => (
          <div
            key={theme.id}
            className={`${styles.card} ${selected === theme.id ? styles.selected : ''}`}
            onClick={() => setSelected(theme.id)}
          >
            <div
              className={styles.preview}
              style={{ background: theme.preview.bg }}
            >
              <div
                className={styles.previewBar}
                style={{ background: theme.preview.secondary }}
              >
                <div
                  className={styles.previewDot}
                  style={{ background: theme.preview.accent }}
                />
                <div
                  className={styles.previewDot}
                  style={{ background: theme.preview.muted }}
                />
                <div
                  className={styles.previewDot}
                  style={{ background: theme.preview.muted }}
                />
              </div>
              <div className={styles.previewContent}>
                <div
                  className={styles.previewBlock}
                  style={{ background: theme.preview.secondary }}
                />
                <div
                  className={styles.previewBlock}
                  style={{ background: theme.preview.secondary, width: '60%' }}
                />
                <div
                  className={styles.previewBlock}
                  style={{ background: theme.preview.accent, width: '40%' }}
                />
              </div>
            </div>

            <div className={styles.info}>
              <span className={styles.label}>{t(theme.labelKey)}</span>
              <span className={styles.desc}>{t(theme.descKey)}</span>
            </div>

            {selected === theme.id && (
              <div className={styles.checkmark}>✓</div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button
          className="primary"
          onClick={() => onSelect(selected)}
        >
          {t('firstLaunch.finish')} ✓
        </button>
      </div>
    </div>
  )
}

export default StepTheme