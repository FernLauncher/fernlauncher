import { useState } from 'react'
import { useI18n } from '../../hooks/useI18n'
import General from './General'
import Language from './Language'
import Appearance from './Appearance'
import Minecraft from './Minecraft'
import Java from './Java'
import Accounts from './Accounts'
import Services from './Services'
import Tools from './Tools'
import Proxy from './Proxy'
import styles from './Settings.module.css'

const PAGES = [
  'general',
  'language',
  'appearance',
  'minecraft',
  'java',
  'accounts',
  'services',
  'tools',
  'proxy',
] as const

type Page = typeof PAGES[number]

const PAGE_ICONS: Record<Page, string> = {
  general: '⚙',
  language: '🌐',
  appearance: '🎨',
  minecraft: '🎮',
  java: '☕',
  accounts: '👤',
  services: '🔧',
  tools: '🛠',
  proxy: '🔒',
}

function Settings() {
  const { t } = useI18n()
  const [page, setPage] = useState<Page>('general')

  const renderPage = () => {
    switch (page) {
      case 'general': return <General />
      case 'language': return <Language />
      case 'appearance': return <Appearance />
      case 'minecraft': return <Minecraft />
      case 'java': return <Java />
      case 'accounts': return <Accounts />
      case 'services': return <Services />
      case 'tools': return <Tools />
      case 'proxy': return <Proxy />
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        {PAGES.map(p => (
          <div
            key={p}
            className={`${styles.navItem} ${page === p ? styles.active : ''}`}
            onClick={() => setPage(p)}
          >
            <span className={styles.navIcon}>{PAGE_ICONS[p]}</span>
            <span>{t(`settings.${p}`)}</span>
          </div>
        ))}
      </div>
      <div className={styles.content}>
        <div className={styles.pageTitle}>{t(`settings.${page}`)}</div>
        <div className={styles.pageContent}>
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

export default Settings