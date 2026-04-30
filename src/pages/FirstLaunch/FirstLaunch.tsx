import { useState } from 'react'
import { useSettingsStore } from '../../store/settingsStore'
import { setLanguage } from '../../hooks/useI18n'
import StepLanguage from './StepLanguage'
import StepTheme from './StepTheme'
import styles from './FirstLaunch.module.css'

interface Props {
  onComplete: () => void
}

function FirstLaunch({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const { set } = useSettingsStore()

  const handleLanguageSelect = async (lang: string) => {
    await set('language', lang)
    setLanguage(lang)
    setStep(1)
  }

  const handleThemeSelect = async (theme: 'dark' | 'light' | 'system') => {
    await set('theme', theme)
    window.electron.completeFirstLaunch()
    onComplete()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>🌿</div>
        <h1 className={styles.title}>Fernlauncher</h1>
        <div className={styles.steps}>
          <div className={`${styles.step} ${step >= 0 ? styles.active : ''}`} />
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`} />
        </div>
      </div>

      <div className={styles.content}>
        {step === 0 && <StepLanguage onSelect={handleLanguageSelect} />}
        {step === 1 && <StepTheme onSelect={handleThemeSelect} />}
      </div>
    </div>
  )
}

export default FirstLaunch