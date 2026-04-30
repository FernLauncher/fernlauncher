import { useI18n } from '../../hooks/useI18n'
import { useInstanceStore } from '../../store/instanceStore'
import styles from './StatusBar.module.css'

interface Props {
  instance: Instance | null
}

function StatusBar({ instance }: Props) {
  const { t } = useI18n()
  const { instances } = useInstanceStore()

  const totalPlayTime = instances.reduce((acc, i) => acc + i.totalPlayTime, 0)

  const formatPlayTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    if (h > 0) return `${h}h ${m}min`
    return `${m}min`
  }

  const formatLastPlayed = (date: string | null) => {
    if (!date) return t('instance.never')
    return new Date(date).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        {instance ? (
          <>
            <div className={styles.dot} />
            <span>
              Minecraft {instance.version}
              {instance.modLoader !== 'none' && ` (${instance.modLoader})`}
              {instance.lastPlayed && `, last played on ${formatLastPlayed(instance.lastPlayed)}`}
              {instance.totalPlayTime > 0 && `, total played: ${formatPlayTime(instance.totalPlayTime)}`}
            </span>
          </>
        ) : (
          <span className={styles.hint}>Select an instance to get started</span>
        )}
      </div>
      <div className={styles.right}>
        {t('instance.totalPlayTime')}: {formatPlayTime(totalPlayTime)}
      </div>
    </div>
  )
}

export default StatusBar