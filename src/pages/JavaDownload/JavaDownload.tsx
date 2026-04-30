import { useState, useEffect } from 'react'
import { useI18n } from '../../hooks/useI18n'
import styles from './JavaDownload.module.css'

const SOURCES = ['mojang', 'adoptium', 'azulzulu'] as const
type Source = typeof SOURCES[number]

const SOURCE_LABELS: Record<Source, string> = {
  mojang: 'Mojang',
  adoptium: 'Adoptium',
  azulzulu: 'Azul Zulu',
}

const MAJOR_VERSIONS = [25, 21, 17, 16, 8]

function JavaDownload() {
  const { t } = useI18n()
  const [source, setSource] = useState<Source>('mojang')
  const [selectedMajor, setSelectedMajor] = useState<number>(21)
  const [mojangVersions, setMojangVersions] = useState<MojangJavaVersion[]>([])
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [recommended, setRecommended] = useState(true)
  const [progress, setProgress] = useState<number | null>(null)

  useEffect(() => {
    if (source === 'mojang') {
      setLoading(true)
      window.electron.getMojangJavaVersions().then(v => {
        setMojangVersions(v)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [source])

  useEffect(() => {
    window.electron.on('java:downloadProgress', (data: any) => {
      setProgress(data.percent)
    })
    return () => {
      window.electron.off('java:downloadProgress', () => {})
    }
  }, [])

  const filteredVersions = mojangVersions.filter(v =>
    !recommended || v.majorVersion === selectedMajor
  )

  const selectedVersion = mojangVersions.find(v => v.majorVersion === selectedMajor)

  const handleDownload = async () => {
  if (!selectedVersion) return
  setDownloading(true)
  setProgress(0)
  try {
    await window.electron.downloadMojangJava(selectedVersion.component)
    setProgress(100)
    await new Promise(r => setTimeout(r, 800))
    window.close()
  } catch (e) {
    alert('Download failed: ' + e)
    setDownloading(false)
    setProgress(null)
  }
}

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.sourceSidebar}>
          {SOURCES.map(s => (
            <div
              key={s}
              className={`${styles.sourceItem} ${source === s ? styles.sourceActive : ''}`}
              onClick={() => setSource(s)}
            >
              {SOURCE_LABELS[s]}
            </div>
          ))}
        </div>

        <div className={styles.content}>
          {source === 'mojang' ? (
            <div className={styles.mojangLayout}>
              <div className={styles.majorList}>
                <div className={styles.listHeader}>Major Version</div>
                {MAJOR_VERSIONS.map(v => (
                  <div
                    key={v}
                    className={`${styles.listItem} ${selectedMajor === v ? styles.selected : ''}`}
                    onClick={() => setSelectedMajor(v)}
                  >
                    Java {v}
                  </div>
                ))}
              </div>

              <div className={styles.versionList}>
                <div className={styles.listHeader} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ flex: 1 }}>Version</span>
                  <span style={{ flex: 1 }}>Java Name</span>
                  <span style={{ width: 80 }}>Released</span>
                  <span style={{ width: 40 }}>Type</span>
                </div>
                {loading ? (
                  <div className={styles.hint}>Loading…</div>
                ) : filteredVersions.length === 0 ? (
                  <div className={styles.hint}>No versions available for Java {selectedMajor}</div>
                ) : filteredVersions.map(v => (
                  <div
                    key={v.component}
                    className={`${styles.versionRow} ${selectedVersion?.component === v.component ? styles.selected : ''}`}
                    onClick={() => setSelectedMajor(v.majorVersion)}
                  >
                    <span style={{ flex: 1 }}>{v.version}</span>
                    <span style={{ flex: 1, color: 'var(--text-muted)', fontSize: 11 }}>{v.component}</span>
                    <span style={{ width: 80, color: 'var(--text-muted)', fontSize: 11 }}>
                      {v.released ? new Date(v.released).toLocaleDateString() : '—'}
                    </span>
                    <span style={{ width: 40, color: 'var(--text-muted)', fontSize: 11 }}>{v.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.hint}>
              {SOURCE_LABELS[source]} support coming soon…
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={recommended}
              onChange={e => setRecommended(e.target.checked)}
            />
            Recommended
          </label>
        </div>
        {downloading && progress !== null && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              flex: 1,
              height: 6,
              background: 'var(--bg-hover)',
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'var(--accent)',
                transition: 'width 0.2s',
              }} />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 36 }}>{progress}%</span>
          </div>
        )}
        <button>{t('common.refresh')}</button>
        <button
          className="primary"
          onClick={handleDownload}
          disabled={!selectedVersion || downloading}
        >
          {downloading ? 'Downloading…' : t('common.download')}
        </button>
        <button onClick={() => window.close()}>{t('common.cancel')}</button>
      </div>
    </div>
  )
}

export default JavaDownload