import { useState, useEffect } from 'react'
import { useI18n } from '../../hooks/useI18n'
import { useInstanceStore } from '../../store/instanceStore'
import styles from './NewInstance.module.css'

const MOD_LOADERS = ['none', 'neoforge', 'forge', 'fabric', 'quilt', 'liteloader'] as const

const SOURCES = ['custom', 'import', 'atlauncher', 'curseforge', 'ftb', 'modrinth', 'technic'] as const
type Source = typeof SOURCES[number]

const SOURCE_LABELS: Record<Source, string> = {
  custom: 'Custom',
  import: 'Import',
  atlauncher: 'ATLauncher',
  curseforge: 'CurseForge',
  ftb: 'FTB Legacy',
  modrinth: 'Modrinth',
  technic: 'Technic',
}

interface Props {
  onClose: () => void
}

interface ModrinthModpack {
  project_id: string
  slug: string
  title: string
  description: string
  icon_url: string
  downloads: number
  author: string
}

interface ModrinthVersion {
  id: string
  name: string
  version_number: string
  game_versions: string[]
  loaders: string[]
  files: { url: string, filename: string, primary: boolean }[]
}

interface ManualFile {
  name: string
  url?: string
  found?: boolean
}

interface CurseForgeModpack {
  id: number
  name: string
  summary: string
  logo?: { thumbnailUrl: string }
  downloadCount: number
  authors: { name: string }[]
  slug: string
}

interface CurseForgeModpackFile {
  id: number
  displayName: string
  fileName: string
  gameVersions: string[]
  downloadUrl: string | null
}

function NewInstance({ onClose }: Props) {
  const { t } = useI18n()
  const { add } = useInstanceStore()

  const [source, setSource] = useState<Source>('custom')
  const [name, setName] = useState('')
  const [group, setGroup] = useState('')
  const [versions, setVersions] = useState<MinecraftVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<MinecraftVersion | null>(null)
  const [modLoader, setModLoader] = useState<Instance['modLoader']>('none')
  const [modLoaderVersions, setModLoaderVersions] = useState<ModLoaderVersion[]>([])
  const [selectedModLoaderVersion, setSelectedModLoaderVersion] = useState<string>('')
  const [loadingVersions, setLoadingVersions] = useState(true)
  const [loadingLoaders, setLoadingLoaders] = useState(false)
  const [search, setSearch] = useState('')
  const [loaderSearch, setLoaderSearch] = useState('')
  const [filters, setFilters] = useState({
    releases: true,
    snapshots: false,
    betas: false,
    alphas: false,
    experiments: false,
  })

  // Modpack state
  const [modpackQuery, setModpackQuery] = useState('')
  const [modpacks, setModpacks] = useState<ModrinthModpack[]>([])
  const [modpackLoading, setModpackLoading] = useState(false)
  const [selectedModpack, setSelectedModpack] = useState<ModrinthModpack | null>(null)
  const [modpackVersions, setModpackVersions] = useState<ModrinthVersion[]>([])
  const [selectedModpackVersion, setSelectedModpackVersion] = useState<ModrinthVersion | null>(null)
  const [installing, setInstalling] = useState(false)
  const [manualFiles, setManualFiles] = useState<ManualFile[]>([])
  const [showManualModal, setShowManualModal] = useState(false)
  const [pendingInstance, setPendingInstance] = useState<Instance | null>(null)
  const [cfModpackQuery, setCfModpackQuery] = useState('')
  const [cfModpacks, setCfModpacks] = useState<CurseForgeModpack[]>([])
  const [cfModpackLoading, setCfModpackLoading] = useState(false)
  const [selectedCfModpack, setSelectedCfModpack] = useState<CurseForgeModpack | null>(null)
  const [cfModpackFiles, setCfModpackFiles] = useState<CurseForgeModpackFile[]>([])
  const [selectedCfFile, setSelectedCfFile] = useState<CurseForgeModpackFile | null>(null)

  useEffect(() => {
    window.electron.getVersions().then(v => {
      setVersions(v)
      const first = v.find(x => x.type === 'release')
      if (first) {
        setSelectedVersion(first)
        setName(first.id)
      }
      setLoadingVersions(false)
    })
  }, [])

  useEffect(() => {
    if (!selectedVersion || modLoader === 'none' || modLoader === 'liteloader') {
      setModLoaderVersions([])
      setSelectedModLoaderVersion('')
      return
    }
    setLoadingLoaders(true)
    setModLoaderVersions([])
    setSelectedModLoaderVersion('')

    const fetchers: Partial<Record<Instance['modLoader'], () => Promise<ModLoaderVersion[]>>> = {
      fabric: () => window.electron.getFabricVersions(selectedVersion.id),
      quilt: () => window.electron.getQuiltVersions(selectedVersion.id),
      forge: () => window.electron.getForgeVersions(selectedVersion.id),
      neoforge: () => window.electron.getNeoForgeVersions(selectedVersion.id),
    }

    const fetch = fetchers[modLoader]
    if (fetch) {
      fetch().then(v => {
        setModLoaderVersions(v)
        if (v.length > 0) setSelectedModLoaderVersion(v[0].version)
        setLoadingLoaders(false)
      })
    }
  }, [selectedVersion, modLoader])

  useEffect(() => {
    window.electron.onModpackProgress(msg => setProgressMsg(msg))
  }, [])

  useEffect(() => {
    if (installing) {
      window.onbeforeunload = () => false
    } else {
      window.onbeforeunload = null
    }
    return () => { window.onbeforeunload = null }
  }, [installing])

  const filtered = versions.filter(v => {
    if (search && !v.id.toLowerCase().includes(search.toLowerCase())) return false
    if (v.type === 'release' && !filters.releases) return false
    if (v.type === 'snapshot' && !filters.snapshots) return false
    if (v.type === 'old_beta' && !filters.betas) return false
    if (v.type === 'old_alpha' && !filters.alphas) return false
    return true
  })

  const filteredLoaders = modLoaderVersions.filter(v =>
    !loaderSearch || v.version.toLowerCase().includes(loaderSearch.toLowerCase())
  )

  const handleCreate = async () => {
    if (!selectedVersion) return
    const instance = await window.electron.createInstance({
      name: name || selectedVersion.id,
      version: selectedVersion.id,
      modLoader,
      modLoaderVersion: selectedModLoaderVersion,
      group,
      icon: 'default',
    })
    add(instance)
    onClose()
  }

  const handleVersionSelect = (v: MinecraftVersion) => {
    setSelectedVersion(v)
    if (!name || versions.some(ver => ver.id === name)) {
      setName(v.id)
    }
  }

  const handleImport = async () => {
    const { filePaths } = await window.electron.openFileDialog({
      filters: [{ name: 'Fernlauncher Pack', extensions: ['fernpack'] }],
    })
    if (filePaths?.[0]) {
      await window.electron.importInstance(filePaths[0])
      onClose()
    }
  }

  async function searchModpacks(q: string) {
    setModpackLoading(true)
    try {
      const facets = JSON.stringify([['project_type:modpack']])
      const params = new URLSearchParams({ query: q, facets, limit: '20' })
      const res = await fetch(`https://api.modrinth.com/v2/search?${params}`, {
        headers: { 'User-Agent': 'Fernlaunch/1.0' }
      })
      const data = await res.json()
      setModpacks(data.hits ?? [])
    } catch (e) { console.error(e) }
    finally { setModpackLoading(false) }
  }

  async function selectModpack(modpack: ModrinthModpack) {
    setSelectedModpack(modpack)
    setSelectedModpackVersion(null)
    try {
      const res = await fetch(`https://api.modrinth.com/v2/project/${modpack.project_id}/version`, {
        headers: { 'User-Agent': 'Fernlaunch/1.0' }
      })
      const vers: ModrinthVersion[] = await res.json()
      setModpackVersions(vers)
      if (vers.length) setSelectedModpackVersion(vers[0])
    } catch (e) { console.error(e) }
  }

  async function handleInstallModpack() {
    if (!selectedModpackVersion) return
    setInstalling(true)
    setProgressMsg('Installing modpack...')
    try {
      const result = await window.electron.installModrinthModpack(
        selectedModpackVersion.id,
        name || selectedModpack!.title,
        group
      )
      if (result.manualFiles.length > 0) {
        setManualFiles(result.manualFiles.map(f => ({ ...f, found: false })))
        setPendingInstance(result.instance)
        setShowManualModal(true)
        const downloadsPath = await window.electron.getDownloadsPath()
        const interval = setInterval(async () => {
          const found = await window.electron.checkManualFiles(
            result.instance.id,
            result.manualFiles.map(f => f.name),
            downloadsPath
          )
          setManualFiles(prev => prev.map(f => ({ ...f, found: found.includes(f.name) })))
          if (found.length === result.manualFiles.length) clearInterval(interval)
        }, 2000)
      } else {
        add(result.instance)
        onClose()
      }
    } catch (e: any) {
      alert(`Failed to install modpack: ${e.message}`)
    } finally {
      setInstalling(false)
      setProgressMsg('')
    }
  }

  async function searchCfModpacks(q: string) {
    setCfModpackLoading(true)
    try {
      const data = await window.electron.cfModpackSearch(q, 0)
      setCfModpacks(data.data ?? [])
    } catch (e) { console.error(e) }
    finally { setCfModpackLoading(false) }
  }

  async function selectCfModpack(modpack: CurseForgeModpack) {
    setSelectedCfModpack(modpack)
    setSelectedCfFile(null)
    try {
      const data = await window.electron.cfModpackFiles(modpack.id)
      console.log('[CF Files]', data)
      setCfModpackFiles(data.data ?? [])
      if (data.data?.length) setSelectedCfFile(data.data[0])
    } catch (e) { console.error(e) }
  }

  async function handleInstallCfModpack() {
    console.log('[Install CF] selectedCfFile:', selectedCfFile, 'selectedCfModpack:', selectedCfModpack)
    if (!selectedCfFile || !selectedCfModpack) return
    setInstalling(true)
    setProgressMsg('Installing CurseForge modpack...')
    try {
      const result = await window.electron.installCurseForgeModpack(
        selectedCfFile.id,
        selectedCfModpack.id,
        name || selectedCfModpack.name,
        group
      )
      if (result.manualFiles.length > 0) {
        setManualFiles(result.manualFiles.map(f => ({ ...f, found: false })))
        setPendingInstance(result.instance)
        setShowManualModal(true)
        const downloadsPath = await window.electron.getDownloadsPath()
        const interval = setInterval(async () => {
          const found = await window.electron.checkManualFiles(
            result.instance.id,
            result.manualFiles.map(f => f.name),
            downloadsPath
          )
          setManualFiles(prev => prev.map(f => ({ ...f, found: found.includes(f.name) })))
          if (found.length === result.manualFiles.length) clearInterval(interval)
        }, 2000)
      } else {
        add(result.instance)
        onClose()
      }
    } catch (e: any) {
      alert(`Failed to install modpack: ${e.message}`)
    } finally {
      setInstalling(false)
      setProgressMsg('')
    }
  }

  const [progressMsg, setProgressMsg] = useState('')

    return (
    <div className={styles.dialog}>
      <div className={styles.titlebar}>
        <span>New Instance — Fernlauncher</span>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <div className={styles.topBar}>
        <div className={styles.iconPicker}>
          <div className={styles.iconBox}>🌿</div>
        </div>
        <div className={styles.topFields}>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>{t('newInstance.name')}:</label>
            <input className={styles.fieldInput} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>{t('newInstance.group')}:</label>
            <input className={styles.fieldInput} value={group} placeholder={t('newInstance.noGroup')} onChange={e => setGroup(e.target.value)} />
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.sourceSidebar}>
          {SOURCES.map(s => (
            <div key={s} className={`${styles.sourceItem} ${source === s ? styles.sourceActive : ''}`} onClick={() => setSource(s)}>
              {SOURCE_LABELS[s]}
            </div>
          ))}
        </div>

        <div className={styles.contentArea}>
          {source === 'custom' ? (
            <div className={styles.customLayout}>
              <div className={styles.customTop}>
                <div className={styles.versionPanel}>
                  <input className={styles.searchInput} placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} />
                  <div className={styles.versionListHeader}>
                    <span>Version</span>
                    <span>Released</span>
                    <span>Type</span>
                  </div>
                  <div className={styles.versionList}>
                    {loadingVersions ? (
                      <div className={styles.hint}>Loading versions…</div>
                    ) : filtered.map(v => (
                      <div key={v.id} className={`${styles.versionItem} ${selectedVersion?.id === v.id ? styles.selected : ''}`} onClick={() => handleVersionSelect(v)}>
                        {v.type === 'release' ? <span className={styles.star}>★</span> : <span className={styles.starEmpty} />}
                        <span className={styles.versionId}>{v.id}</span>
                        <span className={styles.versionDate}>
                          {new Date(v.releaseTime).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}
                        </span>
                        <span className={`${styles.versionType} ${styles[v.type] ?? ''}`}>
                          {v.type === 'old_beta' ? 'beta' : v.type === 'old_alpha' ? 'alpha' : v.type}
                        </span>
                      </div>
                    ))}
                  </div>
                  <input className={styles.searchInput} placeholder={t('common.search')} value={loaderSearch} onChange={e => setLoaderSearch(e.target.value)} />
                  <div className={styles.loaderVersionList}>
                    {modLoader === 'none' ? (
                      <div className={styles.hint}>{t('newInstance.noModLoader')}</div>
                    ) : loadingLoaders ? (
                      <div className={styles.hint}>Loading {modLoader} versions…</div>
                    ) : filteredLoaders.length === 0 ? (
                      <div className={styles.hint}>No versions found for {selectedVersion?.id}</div>
                    ) : filteredLoaders.map(v => (
                      <div key={v.version} className={`${styles.versionItem} ${selectedModLoaderVersion === v.version ? styles.selected : ''}`} onClick={() => setSelectedModLoaderVersion(v.version)}>
                        <span className={styles.starEmpty} />
                        <span className={styles.versionId}>{v.version}</span>
                        {v.stable && <span className={styles.stableBadge}>stable</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.sidePanel}>
                  <div className={styles.sideSection}>
                    <div className={styles.sideLabel}>Filter</div>
                    {Object.entries(filters).map(([key, val]) => (
                      <label key={key} className={styles.checkRow}>
                        <input type="checkbox" checked={val} onChange={e => setFilters(f => ({ ...f, [key]: e.target.checked }))} />
                        <span style={{ textTransform: 'capitalize' }}>{key}</span>
                      </label>
                    ))}
                  </div>
                  <div className={styles.sideSection}>
                    <div className={styles.sideLabel}>{t('newInstance.modLoader')}</div>
                    {MOD_LOADERS.map(l => (
                      <label key={l} className={styles.radioRow}>
                        <input type="radio" name="modLoader" checked={modLoader === l} onChange={() => setModLoader(l)} />
                        <span style={{ textTransform: l === 'none' ? 'none' : 'capitalize' }}>
                          {l === 'none' ? 'None' : l === 'neoforge' ? 'NeoForge' : l === 'liteloader' ? 'LiteLoader' : l.charAt(0).toUpperCase() + l.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          ) : source === 'import' ? (
            <div className={styles.importPane}>
              <div className={styles.importIcon}>📦</div>
              <div className={styles.importTitle}>Import Instance</div>
              <div className={styles.importDesc}>Import a previously exported Fernlauncher instance (.fernpack file)</div>
              <button className={`${styles.importBtn} primary`} onClick={handleImport}>📂 Choose .fernpack file</button>
              <div className={styles.importHint}>The instance will be imported with all its mods, worlds and settings intact.</div>
            </div>

          ) : source === 'modrinth' ? (
            <div className={styles.modpackPane}>
              {!selectedModpack ? (
                <>
                  <form className={styles.modpackSearch} onSubmit={e => { e.preventDefault(); searchModpacks(modpackQuery) }}>
                    <input className={styles.searchInput} value={modpackQuery} onChange={e => setModpackQuery(e.target.value)} placeholder="Search Modrinth modpacks..." />
                    <button type="submit" className="primary">🔍</button>
                  </form>
                  {modpackLoading && <div className={styles.hint}>Searching...</div>}
                  {!modpackLoading && modpacks.length === 0 && <div className={styles.hint}>Search for a modpack to get started</div>}
                  <div className={styles.modpackList}>
                    {modpacks.map(mp => (
                      <div key={mp.project_id} className={styles.modpackCard} onClick={() => selectModpack(mp)}>
                        <div className={styles.modpackIcon}>
                          {mp.icon_url ? <img src={mp.icon_url} alt="" className={styles.modpackIconImg} /> : <span>📦</span>}
                        </div>
                        <div className={styles.modpackInfo}>
                          <div className={styles.modpackTitle}>{mp.title}</div>
                          <div className={styles.modpackDesc}>{mp.description}</div>
                          <div className={styles.modpackMeta}>
                            <span>⬇ {mp.downloads.toLocaleString()}</span>
                            <span>👤 {mp.author}</span>
                          </div>
                        </div>
                        <div className={styles.modpackArrow}>›</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <button className={styles.backBtn} onClick={() => { setSelectedModpack(null); setModpackVersions([]) }}>← Back</button>
                  <div className={styles.modpackDetail}>
                    <div className={styles.modpackDetailHeader}>
                      {selectedModpack.icon_url && <img src={selectedModpack.icon_url} className={styles.modpackDetailIcon} alt="" />}
                      <div>
                        <div className={styles.modpackTitle}>{selectedModpack.title}</div>
                        <div className={styles.modpackDesc}>{selectedModpack.description}</div>
                      </div>
                    </div>
                    <div className={styles.modpackVersionLabel}>Select version:</div>
                    <div className={styles.modpackVersionList}>
                      {modpackVersions.map(v => (
                        <div key={v.id} className={`${styles.modpackVersionItem} ${selectedModpackVersion?.id === v.id ? styles.selected : ''}`} onClick={() => setSelectedModpackVersion(v)}>
                          <div className={styles.versionId}>{v.name}</div>
                          <div className={styles.modpackMeta}>{v.game_versions.slice(0, 3).join(', ')} · {v.loaders.join(', ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : source === 'curseforge' ? (
          <div className={styles.modpackPane}>
            {!selectedCfModpack ? (
              <>
                <form className={styles.modpackSearch} onSubmit={e => { e.preventDefault(); searchCfModpacks(cfModpackQuery) }}>
                  <input className={styles.searchInput} value={cfModpackQuery} onChange={e => setCfModpackQuery(e.target.value)} placeholder="Search CurseForge modpacks..." />
                  <button type="submit" className="primary">🔍</button>
                </form>
                {cfModpackLoading && <div className={styles.hint}>Searching...</div>}
                {!cfModpackLoading && cfModpacks.length === 0 && <div className={styles.hint}>Search for a modpack to get started</div>}
                <div className={styles.modpackList}>
                  {cfModpacks.map(mp => (
                    <div key={mp.id} className={styles.modpackCard} onClick={() => selectCfModpack(mp)}>
                      <div className={styles.modpackIcon}>
                        {mp.logo?.thumbnailUrl ? <img src={mp.logo.thumbnailUrl} alt="" className={styles.modpackIconImg} /> : <span>📦</span>}
                      </div>
                      <div className={styles.modpackInfo}>
                        <div className={styles.modpackTitle}>{mp.name}</div>
                        <div className={styles.modpackDesc}>{mp.summary}</div>
                        <div className={styles.modpackMeta}>
                          <span>⬇ {mp.downloadCount.toLocaleString()}</span>
                          <span>👤 {mp.authors[0]?.name}</span>
                        </div>
                      </div>
                      <div className={styles.modpackArrow}>›</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <button className={styles.backBtn} onClick={() => { setSelectedCfModpack(null); setCfModpackFiles([]) }}>← Back</button>
                <div className={styles.modpackDetail}>
                  <div className={styles.modpackDetailHeader}>
                    {selectedCfModpack.logo?.thumbnailUrl && <img src={selectedCfModpack.logo.thumbnailUrl} className={styles.modpackDetailIcon} alt="" />}
                    <div>
                      <div className={styles.modpackTitle}>{selectedCfModpack.name}</div>
                      <div className={styles.modpackDesc}>{selectedCfModpack.summary}</div>
                    </div>
                  </div>
                  <div className={styles.modpackVersionLabel}>Select version:</div>
                  <div className={styles.modpackVersionList}>
                    {cfModpackFiles.map(f => (
                      <div key={f.id} className={`${styles.modpackVersionItem} ${selectedCfFile?.id === f.id ? styles.selected : ''}`} onClick={() => setSelectedCfFile(f)}>
                        <div className={styles.versionId}>{f.displayName}</div>
                        <div className={styles.modpackMeta}>{f.gameVersions.slice(0, 3).join(', ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          ) : (
            <div className={styles.sourceComingSoon}>
              <div className={styles.hint}>{SOURCE_LABELS[source]} modpack browser coming soon…</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className="primary"
          onClick={() => {
            if (source === 'modrinth' && selectedModpackVersion) handleInstallModpack()
            else if (source === 'curseforge' && selectedCfFile) handleInstallCfModpack()
            else handleCreate()
          }}
          disabled={
            installing ||
            (source === 'custom' && !selectedVersion) ||
            (source === 'modrinth' && !selectedModpackVersion) ||
            (source === 'curseforge' && !selectedCfFile) ||
            (source !== 'custom' && source !== 'modrinth' && source !== 'curseforge' && source !== 'import')
          }
        >
          {installing ? (progressMsg || 'Installing...') 
            : source === 'modrinth' && selectedModpackVersion ? '⬇ Install Modpack' 
            : source === 'curseforge' && selectedCfFile ? '⬇ Install Modpack'
            : t('common.ok')}
        </button>
        <button onClick={onClose}>{t('common.cancel')}</button>
        <button>{t('common.help')}</button>
      </div>

      {installing && (
        <div className={styles.progressOverlay}>
          <div className={styles.progressBox}>
            <div className={styles.progressIcon}>📦</div>
            <div className={styles.progressTitle}>Installing Modpack</div>
            <div className={styles.progressMsg}>{progressMsg || 'Starting...'}</div>
            <div className={styles.progressSpinner} />
          </div>
        </div>
      )}

      {showManualModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.manualModal}>
            <div className={styles.manualModalHeader}>
              <div className={styles.manualModalTitle}>⚠️ Manual Downloads Required</div>
              <div className={styles.manualModalSub}>
                Some files could not be downloaded automatically. Please download them and place them in your Downloads folder.
              </div>
            </div>
            <div className={styles.manualFileList}>
              {manualFiles.map((f, i) => (
                <div key={i} className={styles.manualFileItem}>
                  <span className={styles.manualFileStatus}>{f.found ? '✅' : '⏳'}</span>
                  <span className={styles.manualFileName}>{f.name}</span>
                  {f.url && (
                    <button className={styles.manualFileLink} onClick={() => window.electron.openExternalUrl(f.url!)}>🌐 Download</button>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.manualModalFooter}>
              <div className={styles.manualHint}>Files will be detected automatically when placed in your Downloads folder.</div>
              <button className="primary" disabled={!manualFiles.every(f => f.found)} onClick={() => { if (pendingInstance) add(pendingInstance); setShowManualModal(false); onClose() }}>
                ✓ Done
              </button>
              <button onClick={() => { if (pendingInstance) add(pendingInstance); setShowManualModal(false); onClose() }}>
                Skip Missing Files
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewInstance