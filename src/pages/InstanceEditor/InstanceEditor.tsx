import { useState, useEffect, useCallback, useRef } from 'react'
import styles from './InstanceEditor.module.css'
import { useSettingsStore } from '../../store/settingsStore'

const TABS = [
  { id: 'log', label: '📋 Minecraft Log' },
  { id: 'version', label: '⚙️ Version' },
  { id: 'mods', label: '🧩 Mods' },
  { id: 'resourcepacks', label: '🎨 Resource Packs' },
  { id: 'shaderpacks', label: '✨ Shader Packs' },
  { id: 'notes', label: '📝 Notes' },
  { id: 'worlds', label: '🌍 Worlds' },
  { id: 'servers', label: '🌐 Servers' },
  { id: 'screenshots', label: '📷 Screenshots' },
  { id: 'settings', label: '⚙️ Settings' },
  { id: 'otherlogs', label: '📄 Other Logs' },
]

function ComingSoon({ label }: { label: string }) {
  return (
    <div className={styles.comingSoon}>
      <div className={styles.comingSoonIcon}>🌿</div>
      <div className={styles.comingSoonText}>{label}</div>
      <div className={styles.comingSoonSub}>Coming soon</div>
    </div>
  )
}

interface ModrinthProject {
  project_id: string
  slug: string
  title: string
  description: string
  icon_url: string
  downloads: number
  categories: string[]
  author: string
}

interface ModrinthVersion {
  id: string
  name: string
  version_number: string
  files: { url: string, filename: string, primary: boolean }[]
  game_versions: string[]
  loaders: string[]
  dependencies?: { version_id: string, project_id: string, dependency_type: 'required' | 'optional' | 'incompatible' }[]
}

interface CurseForgeProject {
  id: number
  name: string
  summary: string
  logo?: { thumbnailUrl: string }
  downloadCount: number
  authors: { name: string }[]
  slug: string
}

interface CurseForgeFile {
  id: number
  displayName: string
  fileName: string
  downloadUrl: string
  gameVersions: string[]
  dependencies?: { modId: number, relationType: number }[]
}

interface ContentTabProps {
  instance: Instance
  files: string[]
  onRefresh: () => void
  type: 'resourcepack' | 'shader'
  folder: string
  icon: string
  label: string
}

// ─── ContentTab (Resource Packs & Shader Packs) ───────────────────────────────

function ContentTab({ instance, files, onRefresh, type, folder, icon, label }: ContentTabProps) {
  const [view, setView] = useState<'installed' | 'browse'>('installed')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ModrinthProject[]>([])
  const [loading, setLoading] = useState(false)
  const [installing, setInstalling] = useState<string | null>(null)
  const [versionModal, setVersionModal] = useState<{ project: ModrinthProject, versions: ModrinthVersion[] } | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const PER_PAGE = 20

  async function search(q: string, offset = 0) {
    setLoading(true)
    try {
      const facets: string[][] = [
        [`versions:${instance.version}`],
        [`project_type:${type}`],
      ]
      const params = new URLSearchParams({
        query: q, facets: JSON.stringify(facets),
        limit: String(PER_PAGE), offset: String(offset),
      })
      const res = await fetch(`https://api.modrinth.com/v2/search?${params}`, { headers: { 'User-Agent': 'Fernlaunch/1.0' } })
      const data = await res.json()
      if (offset === 0) setResults(data.hits ?? [])
      else setResults(prev => [...prev, ...(data.hits ?? [])])
      setHasMore((data.hits?.length ?? 0) === PER_PAGE)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function openVersionPicker(project: ModrinthProject) {
    setInstalling(project.project_id)
    try {
      const res = await fetch(
        `https://api.modrinth.com/v2/project/${project.project_id}/version?game_versions=["${instance.version}"]`,
        { headers: { 'User-Agent': 'Fernlaunch/1.0' } }
      )
      const versions: ModrinthVersion[] = await res.json()
      if (!versions.length) { alert('No compatible version found.'); return }
      setVersionModal({ project, versions })
    } catch { alert('Failed to fetch versions.') }
    finally { setInstalling(null) }
  }

  async function installVersion(version: ModrinthVersion) {
  const file = version.files.find(f => f.primary) ?? version.files[0]
  setInstalling(versionModal!.project.project_id)
  setVersionModal(null)
  try {
    await window.electron.downloadFile(instance.id, file.url, file.filename, folder.replace('minecraft/', ''))
    onRefresh()
  } catch { alert('Failed to install.') }
  finally { setInstalling(null) }
}

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(0)
    search(query, 0)
  }

  const isInstalled = (project: ModrinthProject) =>
    files.some(f => f.toLowerCase().includes(project.slug.toLowerCase()))

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {view === 'installed' ? `${label} (${files.length})` : `Browse Modrinth — ${label}`}
        </h2>
        <div className={styles.headerBtns}>
          <button className={`${styles.addBtn} ${view === 'installed' ? styles.active : ''}`} onClick={() => setView('installed')}>📦 Installed</button>
          <button className={`${styles.addBtn} ${view === 'browse' ? styles.active : ''}`} onClick={() => { setView('browse'); if (!results.length) search('') }}>🔍 Browse</button>
          <button className={styles.addBtn} onClick={() => window.electron.openInstanceFolder(instance.id, folder)}>📁 Folder</button>
        </div>
      </div>

      {view === 'installed' && (
        files.length === 0
          ? <div className={styles.empty}>No {label.toLowerCase()} installed.<br />Click Browse to find some.</div>
          : <div className={styles.fileList}>
              {files.map(f => (
                <div key={f} className={styles.fileItem}>
                  <span className={styles.fileIcon}>{icon}</span>
                  <span className={styles.fileName}>{f}</span>
                  <button className={styles.deleteModBtn} onClick={async () => { await window.electron.deleteInstanceFile(instance.id, `${folder}/${f}`); onRefresh() }} title={`Remove`}>🗑</button>
                </div>
              ))}
            </div>
      )}

      {view === 'browse' && (
        <div className={styles.browsePane}>
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input className={styles.searchInput} value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search ${label.toLowerCase()} for ${instance.version}...`} />
            <button className={styles.searchBtn} type="submit">🔍</button>
          </form>
          {loading && !results.length && <div className={styles.empty}>Searching...</div>}
          <div className={styles.modGrid}>
            {results.map(project => (
              <div key={project.project_id} className={styles.modCard}>
                <div className={styles.modCardLeft}>
                  {project.icon_url ? <img className={styles.modIcon} src={project.icon_url} alt="" /> : <div className={styles.modIconPlaceholder}>{icon}</div>}
                </div>
                <div className={styles.modCardBody}>
                  <div className={styles.modName}>{project.title}</div>
                  <div className={styles.modDesc}>{project.description}</div>
                  <div className={styles.modMeta}><span>⬇ {project.downloads.toLocaleString()}</span><span>👤 {project.author}</span></div>
                </div>
                <div className={styles.modCardRight}>
                  {isInstalled(project)
                    ? <button className={`${styles.installBtn} ${styles.installed}`} disabled>✓ Installed</button>
                    : <button className={styles.installBtn} disabled={installing === project.project_id} onClick={() => openVersionPicker(project)}>
                        {installing === project.project_id ? '...' : '⬇ Install'}
                      </button>
                  }
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <button className={styles.loadMore} onClick={() => { const next = page + 1; setPage(next); search(query, next * PER_PAGE) }} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}

      {versionModal && (
        <div className={styles.modalOverlay} onClick={() => setVersionModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Select Version — {versionModal.project.title}</div>
              <button className={styles.modalClose} onClick={() => setVersionModal(null)}>✕</button>
            </div>
            <div className={styles.versionList}>
              {versionModal.versions.map(v => (
                <div key={v.id} className={styles.versionItem} onClick={() => installVersion(v)}>
                  <div className={styles.versionName}>{v.name}</div>
                  <div className={styles.versionMeta}>{v.version_number} · {v.game_versions.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ModsTab ──────────────────────────────────────────────────────────────────

function ModsTab({ instance, mods, onRefresh }: { instance: Instance, mods: string[], onRefresh: () => void }) {
  const [view, setView] = useState<'installed' | 'browse'>('installed')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ModrinthProject[]>([])
  const [cfResults, setCfResults] = useState<CurseForgeProject[]>([])
  const [loading, setLoading] = useState(false)
  const [installing, setInstalling] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [source, setSource] = useState<'modrinth' | 'curseforge'>('modrinth')
  const [versionModal, setVersionModal] = useState<{ project: ModrinthProject, versions: ModrinthVersion[] } | null>(null)
  const [cfVersionModal, setCfVersionModal] = useState<{ project: CurseForgeProject, files: CurseForgeFile[] } | null>(null)

  const CF_CLASS_MODS = 6
  const PER_PAGE = 20
  const loaderMap: Record<string, string> = { fabric: 'fabric', forge: 'forge', neoforge: 'neoforge', quilt: 'quilt', none: '' }
  const loader = loaderMap[instance.modLoader] ?? ''

  // ─── Modrinth ──────────────────────────────────────────────────────────────

  async function search(q: string, offset = 0) {
    setLoading(true)
    try {
      const facets: string[][] = [[`versions:${instance.version}`], ['project_type:mod']]
      if (loader) facets.push([`categories:${loader}`])
      const params = new URLSearchParams({ query: q, facets: JSON.stringify(facets), limit: String(PER_PAGE), offset: String(offset) })
      const res = await fetch(`https://api.modrinth.com/v2/search?${params}`, { headers: { 'User-Agent': 'Fernlaunch/1.0' } })
      const data = await res.json()
      if (offset === 0) setResults(data.hits ?? [])
      else setResults(prev => [...prev, ...(data.hits ?? [])])
      setHasMore((data.hits?.length ?? 0) === PER_PAGE)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function openVersionPicker(project: ModrinthProject) {
    setInstalling(project.project_id)
    try {
      const res = await fetch(
        `https://api.modrinth.com/v2/project/${project.project_id}/version?game_versions=["${instance.version}"]${loader ? `&loaders=["${loader}"]` : ''}`,
        { headers: { 'User-Agent': 'Fernlaunch/1.0' } }
      )
      const versions: ModrinthVersion[] = await res.json()
      if (!versions.length) { alert('No compatible version found.'); return }
      setVersionModal({ project, versions })
    } catch { alert('Failed to fetch versions.') }
    finally { setInstalling(null) }
  }

  async function installVersion(version: ModrinthVersion) {
    const file = version.files.find(f => f.primary) ?? version.files[0]
    setInstalling(versionModal!.project.project_id)
    setVersionModal(null)
    try {
      await window.electron.downloadMod(instance.id, file.url, file.filename)
      const requiredDeps = version.dependencies?.filter((d: any) => d.dependency_type === 'required' && d.project_id) ?? []
      for (const dep of requiredDeps) {
        try {
          let depFile: { url: string, filename: string } | null = null
          if (dep.version_id) {
            const r = await fetch(`https://api.modrinth.com/v2/version/${dep.version_id}`, { headers: { 'User-Agent': 'Fernlaunch/1.0' } })
            const v: ModrinthVersion = await r.json()
            depFile = v.files.find(f => f.primary) ?? v.files[0]
          } else {
            const r = await fetch(
              `https://api.modrinth.com/v2/project/${dep.project_id}/version?game_versions=["${instance.version}"]${loader ? `&loaders=["${loader}"]` : ''}`,
              { headers: { 'User-Agent': 'Fernlaunch/1.0' } }
            )
            const vs: ModrinthVersion[] = await r.json()
            if (vs.length) depFile = vs[0].files.find(f => f.primary) ?? vs[0].files[0]
          }
          if (depFile && !mods.includes(depFile.filename)) {
            await window.electron.downloadMod(instance.id, depFile.url, depFile.filename)
          }
        } catch (e) { console.warn(`Failed to install dependency ${dep.project_id}`, e) }
      }
      onRefresh()
    } catch { alert('Failed to install.') }
    finally { setInstalling(null) }
  }

  // ─── CurseForge ────────────────────────────────────────────────────────────

  async function searchCurseForge(q: string, offset = 0) {
    setLoading(true)
    try {
      const data = await window.electron.curseforgeSearch(q, instance.version, loader, CF_CLASS_MODS, offset)
      if (offset === 0) setCfResults(data.data ?? [])
      else setCfResults(prev => [...prev, ...(data.data ?? [])])
      setHasMore((data.data?.length ?? 0) === 20)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function openCfVersionPicker(project: CurseForgeProject) {
    setInstalling(String(project.id))
    try {
      const data = await window.electron.curseforgeGetFiles(project.id, instance.version, loader)
      const files: CurseForgeFile[] = data.data ?? []
      if (!files.length) { alert('No compatible files found.'); return }
      setCfVersionModal({ project, files })
    } catch { alert('Failed to fetch files.') }
    finally { setInstalling(null) }
  }

  async function installCfFile(file: CurseForgeFile) {
    setInstalling(String(cfVersionModal!.project.id))
    setCfVersionModal(null)
    try {
      if (!file.downloadUrl) {
        alert('This file has no download URL (blocked by CurseForge). Please download manually.')
        return
      }
      await window.electron.downloadMod(instance.id, file.downloadUrl, file.fileName)
      if (file.dependencies?.length) {
        const requiredDeps = file.dependencies.filter((d: any) => d.relationType === 3)
        for (const dep of requiredDeps) {
          try {
            const depData = await window.electron.curseforgeGetFiles(dep.modId, instance.version, loader)
            const depFiles: CurseForgeFile[] = depData.data ?? []
            if (depFiles.length) {
              const depFile = depFiles[0]
              if (depFile.downloadUrl && !mods.includes(depFile.fileName)) {
                await window.electron.downloadMod(instance.id, depFile.downloadUrl, depFile.fileName)
              }
            }
          } catch (e) { console.warn(`Failed to install CF dependency ${dep.modId}`, e) }
        }
      }
      onRefresh()
    } catch { alert('Failed to install.') }
    finally { setInstalling(null) }
  }

  // ─── Shared ────────────────────────────────────────────────────────────────

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(0)
    if (source === 'modrinth') search(query, 0)
    else searchCurseForge(query, 0)
  }

  const isInstalled = (slug: string) =>
    mods.some(m => m.toLowerCase().includes(slug.toLowerCase()))

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {view === 'installed' ? `Mods (${mods.length})` : `Browse ${source === 'modrinth' ? 'Modrinth' : 'CurseForge'}`}
        </h2>
        <div className={styles.headerBtns}>
          <button className={`${styles.addBtn} ${view === 'installed' ? styles.active : ''}`} onClick={() => setView('installed')}>📦 Installed</button>
          <button className={`${styles.addBtn} ${view === 'browse' ? styles.active : ''}`} onClick={() => { setView('browse'); if (!results.length && !cfResults.length) search('') }}>🔍 Browse</button>
          <button className={styles.addBtn} onClick={() => window.electron.openInstanceFolder(instance.id, 'minecraft/mods')}>📁 Folder</button>
        </div>
      </div>

      {view === 'installed' && (
        mods.length === 0
          ? <div className={styles.empty}>No mods installed.<br />Click Browse to find mods.</div>
          : <div className={styles.fileList}>
              {mods.map(m => (
                <div key={m} className={styles.fileItem}>
                  <span className={styles.fileIcon}>🧩</span>
                  <span className={styles.fileName}>{m}</span>
                  <button className={styles.deleteModBtn} onClick={async () => { await window.electron.deleteInstanceFile(instance.id, `minecraft/mods/${m}`); onRefresh() }} title="Remove mod">🗑</button>
                </div>
              ))}
            </div>
      )}

      {view === 'browse' && (
        <div className={styles.browsePane}>
          <div className={styles.sourceSwitcher}>
            <button className={`${styles.sourceBtn} ${source === 'modrinth' ? styles.active : ''}`} onClick={() => { setSource('modrinth'); if (!results.length) search('') }}>
              <img src="https://cdn.modrinth.com/modrinth-new.png" className={styles.sourceIcon} alt="" />
              Modrinth
            </button>
            <button className={`${styles.sourceBtn} ${source === 'curseforge' ? styles.active : ''}`} onClick={() => { setSource('curseforge'); if (!cfResults.length) searchCurseForge('') }}>
              <img src="https://www.curseforge.com/favicon.ico" className={styles.sourceIcon} alt="" />
              CurseForge
            </button>
          </div>

          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input className={styles.searchInput} value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search ${source === 'modrinth' ? 'Modrinth' : 'CurseForge'} for ${instance.version}...`} />
            <button className={styles.searchBtn} type="submit">🔍</button>
          </form>

          {loading && <div className={styles.empty}>Searching...</div>}

          <div className={styles.modGrid}>
            {source === 'modrinth' && results.map(project => (
              <div key={project.project_id} className={styles.modCard}>
                <div className={styles.modCardLeft}>
                  {project.icon_url ? <img className={styles.modIcon} src={project.icon_url} alt="" /> : <div className={styles.modIconPlaceholder}>🧩</div>}
                </div>
                <div className={styles.modCardBody}>
                  <div className={styles.modName}>{project.title}</div>
                  <div className={styles.modDesc}>{project.description}</div>
                  <div className={styles.modMeta}><span>⬇ {project.downloads.toLocaleString()}</span><span>👤 {project.author}</span></div>
                </div>
                <div className={styles.modCardRight}>
                  {isInstalled(project.slug)
                    ? <button className={`${styles.installBtn} ${styles.installed}`} disabled>✓ Installed</button>
                    : <button className={styles.installBtn} disabled={installing === project.project_id} onClick={() => openVersionPicker(project)}>
                        {installing === project.project_id ? '...' : '⬇ Install'}
                      </button>
                  }
                </div>
              </div>
            ))}

            {source === 'curseforge' && cfResults.map(project => (
              <div key={project.id} className={styles.modCard}>
                <div className={styles.modCardLeft}>
                  {project.logo?.thumbnailUrl ? <img className={styles.modIcon} src={project.logo.thumbnailUrl} alt="" /> : <div className={styles.modIconPlaceholder}>🧩</div>}
                </div>
                <div className={styles.modCardBody}>
                  <div className={styles.modName}>{project.name}</div>
                  <div className={styles.modDesc}>{project.summary}</div>
                  <div className={styles.modMeta}><span>⬇ {project.downloadCount.toLocaleString()}</span><span>👤 {project.authors[0]?.name}</span></div>
                </div>
                <div className={styles.modCardRight}>
                  {isInstalled(project.slug)
                    ? <button className={`${styles.installBtn} ${styles.installed}`} disabled>✓ Installed</button>
                    : <button className={styles.installBtn} disabled={installing === String(project.id)} onClick={() => openCfVersionPicker(project)}>
                        {installing === String(project.id) ? '...' : '⬇ Install'}
                      </button>
                  }
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <button className={styles.loadMore} onClick={() => { const next = page + 1; setPage(next); source === 'modrinth' ? search(query, next * PER_PAGE) : searchCurseForge(query, next * PER_PAGE) }} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}

      {versionModal && (
        <div className={styles.modalOverlay} onClick={() => setVersionModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Select Version — {versionModal.project.title}</div>
              <button className={styles.modalClose} onClick={() => setVersionModal(null)}>✕</button>
            </div>
            <div className={styles.versionList}>
              {versionModal.versions.map(v => (
                <div key={v.id} className={styles.versionItem} onClick={() => installVersion(v)}>
                  <div className={styles.versionName}>{v.name}</div>
                  <div className={styles.versionMeta}>{v.version_number} · {v.game_versions.join(', ')} · {v.loaders.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {cfVersionModal && (
        <div className={styles.modalOverlay} onClick={() => setCfVersionModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Select File — {cfVersionModal.project.name}</div>
              <button className={styles.modalClose} onClick={() => setCfVersionModal(null)}>✕</button>
            </div>
            <div className={styles.versionList}>
              {cfVersionModal.files.map(f => (
                <div key={f.id} className={styles.versionItem} onClick={() => installCfFile(f)}>
                  <div className={styles.versionName}>{f.displayName}</div>
                  <div className={styles.versionMeta}>{f.fileName} · {f.gameVersions.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ServersTab({ instanceId }: { instanceId: string }) {
  const [servers, setServers] = useState<{ name: string, ip: string, icon: string }[]>([])
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIp, setNewIp] = useState('')

    const loadServers = useCallback(async () => {
    const s = await window.electron.getServers(instanceId)
    setServers(s)
    }, [instanceId])

    useEffect(() => { loadServers() }, [loadServers])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || !newIp.trim()) return
    await window.electron.addServer(instanceId, newName.trim(), newIp.trim())
    setNewName('')
    setNewIp('')
    setAdding(false)
    loadServers()
  }

  async function handleRemove(index: number) {
    await window.electron.removeServer(instanceId, index)
    loadServers()
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Servers ({servers.length})</h2>
        <button className={styles.addBtn} onClick={() => setAdding(v => !v)}>
          {adding ? '✕ Cancel' : '+ Add Server'}
        </button>
      </div>

      {adding && (
        <form className={styles.addServerForm} onSubmit={handleAdd}>
          <input className={styles.input} placeholder="Server name" value={newName} onChange={e => setNewName(e.target.value)} />
          <input className={styles.input} placeholder="IP address" value={newIp} onChange={e => setNewIp(e.target.value)} />
          <button className={styles.installBtn} type="submit">Add</button>
        </form>
      )}

      {servers.length === 0
        ? <div className={styles.empty}>No servers added yet.</div>
        : <div className={styles.fileList}>
            {servers.map((s, i) => (
              <div key={i} className={styles.fileItem}>
                <span className={styles.fileIcon}>🌐</span>
                <div className={styles.serverInfo}>
                  <div className={styles.serverName}>{s.name}</div>
                  <div className={styles.serverIp}>{s.ip}</div>
                </div>
                <button className={styles.deleteModBtn} onClick={() => handleRemove(i)} title="Remove server">🗑</button>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

function HeaderIcon({ instance }: { instance: Instance }) {
  const [iconSrc, setIconSrc] = useState<string | null>(null)

  useEffect(() => {
    if (instance.icon && instance.icon !== 'default') {
      window.electron.getInstanceIconData(instance.id, instance.icon).then(setIconSrc)
    } else {
      setIconSrc(null)
    }
  }, [instance.icon, instance.id])

  return (
    <div className={styles.headerIcon}>
      {iconSrc
        ? <img src={iconSrc} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} alt="" />
        : null
      }
    </div>
  )
}

function ScreenshotCard({ instanceId, fileName }: { instanceId: string, fileName: string }) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    window.electron.getScreenshot(instanceId, fileName).then(setSrc)
  }, [instanceId, fileName])

  return (
    <div 
        className={styles.screenshotCard} 
        title={fileName}
        onClick={() => window.electron.openFile(instanceId, `minecraft/screenshots/${fileName}`)}
        >
      {src
        ? <img src={src} className={styles.screenshotImg} alt={fileName} />
        : <div className={styles.screenshotPlaceholder}>📷</div>
      }
      <div className={styles.screenshotName}>{fileName}</div>
    </div>
  )
}

function LogTab({ instanceId }: { instanceId: string }) {
  const [log, setLog] = useState('')
  const [autoScroll, setAutoScroll] = useState(true)
  const [filter, setFilter] = useState('')
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.electron.readLog(instanceId).then(setLog)
    window.electron.watchLog(instanceId)

    const unsub = window.electron.on('instance:logUpdated', (content: string) => {
      setLog(content)
    })

    return () => unsub?.()
  }, [instanceId])

  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [log, autoScroll])

  const lines = log.split('\n').filter(l => !filter || l.toLowerCase().includes(filter.toLowerCase()))

  const getLineClass = (line: string) => {
    if (line.includes('/ERROR') || line.includes('ERROR]')) return styles.logError
    if (line.includes('/WARN') || line.includes('WARN]')) return styles.logWarn
    if (line.includes('/INFO') || line.includes('INFO]')) return styles.logInfo
    return styles.logDefault
  }

  return (
    <div className={styles.logPane}>
      <div className={styles.logToolbar}>
        <input
          className={styles.logFilter}
          placeholder="Filter..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <label className={styles.logAutoScroll}>
          <input type="checkbox" checked={autoScroll} onChange={e => setAutoScroll(e.target.checked)} />
          Auto-scroll
        </label>
        <button className={styles.addBtn} onClick={() => window.electron.readLog(instanceId).then(setLog)}>
          🔄 Refresh
        </button>
        <button className={styles.addBtn} onClick={() => window.electron.openInstanceFolder(instanceId, 'minecraft/logs')}>
          📁 Logs Folder
        </button>
      </div>
      <div className={styles.logContent} ref={logRef}>
        {lines.length === 0
          ? <div className={styles.empty}>No log file found. Launch Minecraft first.</div>
          : lines.map((line, i) => (
              <div key={i} className={`${styles.logLine} ${getLineClass(line)}`}>
                {line}
              </div>
            ))
        }
      </div>
    </div>
  )
}

// ─── InstanceEditor ───────────────────────────────────────────────────────────

function InstanceEditor({ instanceId }: { instanceId: string }) {
  const [activeTab, setActiveTab] = useState('mods')
  const [instance, setInstance] = useState<Instance | null>(null)
  const [notes, setNotes] = useState('')
  const [mods, setMods] = useState<string[]>([])
  const [resourcePacks, setResourcePacks] = useState<string[]>([])
  const [shaderPacks, setShaderPacks] = useState<string[]>([])
  const [worlds, setWorlds] = useState<string[]>([])
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [otherLogs, setOtherLogs] = useState<string[]>([])
  const { config: cfg } = useSettingsStore()

  const loadInstance = useCallback(async () => {
    const instances = await window.electron.getInstances()
    const inst = instances.find((i: Instance) => i.id === instanceId)
    if (inst) {
        setInstance(inst)
        setNotes(inst.notes ?? '')
    }
    }, [instanceId])

  const loadTabData = useCallback(async (tab: string) => {
    if (!instance) return
    try {
      switch (tab) {
        case 'mods': setMods(await window.electron.listInstanceFolder(instanceId, 'minecraft/mods')); break
        case 'resourcepacks': setResourcePacks(await window.electron.listInstanceFolder(instanceId, 'minecraft/resourcepacks')); break
        case 'shaderpacks': setShaderPacks(await window.electron.listInstanceFolder(instanceId, 'minecraft/shaderpacks')); break
        case 'worlds': setWorlds(await window.electron.listInstanceFolder(instanceId, 'minecraft/saves')); break
        case 'screenshots': setScreenshots(await window.electron.listInstanceFolder(instanceId, 'minecraft/screenshots')); break
        case 'otherlogs': setOtherLogs(await window.electron.listInstanceFolder(instanceId, 'minecraft/logs')); break
      }
    } catch { console.error('Failed to load tab data') }
  }, [instance, instanceId])

  useEffect(() => { loadInstance() }, [loadInstance])
  useEffect(() => { if (!instance) return; loadTabData(activeTab) }, [loadTabData, activeTab, instance])

  if (!instance) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <HeaderIcon instance={instance} />
        <div className={styles.headerInfo}>
          <div className={styles.headerName}>{instance.name}</div>
          <div className={styles.headerMeta}>
            {instance.version}
            {instance.modLoader !== 'none' && ` · ${instance.modLoader} ${instance.modLoaderVersion}`}
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          {TABS.map(tab => (
            <button key={tab.id} className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {activeTab === 'log' && (
            <LogTab instanceId={instanceId} />
            )}

          {activeTab === 'version' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Version</h2>
              <div className={styles.field}>
                <label>Minecraft Version</label>
                <div className={styles.fieldValue}>{instance.version}</div>
              </div>
              <div className={styles.field}>
                <label>Mod Loader</label>
                <div className={styles.fieldValue}>{instance.modLoader === 'none' ? 'Vanilla' : `${instance.modLoader} ${instance.modLoaderVersion}`}</div>
              </div>
              <div className={styles.field}>
                <label>Instance Name</label>
                <input className={styles.input} defaultValue={instance.name} />
              </div>
            </div>
          )}

          {activeTab === 'mods' && <ModsTab instance={instance} mods={mods} onRefresh={() => loadTabData('mods')} />}

          {activeTab === 'resourcepacks' && (
            <ContentTab instance={instance} files={resourcePacks} onRefresh={() => loadTabData('resourcepacks')} type="resourcepack" folder="minecraft/resourcepacks" icon="🎨" label="Resource Packs" />
          )}

          {activeTab === 'shaderpacks' && (
            <ContentTab instance={instance} files={shaderPacks} onRefresh={() => loadTabData('shaderpacks')} type="shader" folder="minecraft/shaderpacks" icon="✨" label="Shader Packs" />
          )}

          {activeTab === 'notes' && (
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Notes</h2>
                <textarea
                className={styles.notes}
                placeholder="Add notes about this instance..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                onBlur={() => window.electron.updateInstance({ ...instance, notes })}
                />
            </div>
            )}

          {activeTab === 'worlds' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Worlds ({worlds.length})</h2>
                <button className={styles.addBtn} onClick={() => window.electron.openInstanceFolder(instanceId, 'minecraft/saves')}>📁 Open Folder</button>
              </div>
              {worlds.length === 0
                ? <div className={styles.empty}>No worlds found</div>
                : <div className={styles.fileList}>{worlds.map(w => <div key={w} className={styles.fileItem}><span className={styles.fileIcon}>🌍</span><span className={styles.fileName}>{w}</span></div>)}</div>
              }
            </div>
          )}

          {activeTab === 'servers' && (
            <ServersTab instanceId={instanceId} />
        )}

          {activeTab === 'screenshots' && (
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Screenshots ({screenshots.length})</h2>
                <button className={styles.addBtn} onClick={() => window.electron.openInstanceFolder(instanceId, 'minecraft/screenshots')}>
                    📁 Open Folder
                </button>
                </div>
                {screenshots.length === 0
                ? <div className={styles.empty}>No screenshots found</div>
                : <div className={styles.screenshotGrid}>
                    {screenshots.map(s => (
                        <ScreenshotCard key={s} instanceId={instanceId} fileName={s} />
                    ))}
                    </div>
                }
            </div>
            )}

          {activeTab === 'settings' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Instance Settings</h2>
              <div className={styles.field}>
                <label>Instance Name</label>
                <input className={styles.input} defaultValue={instance.name} onBlur={e => window.electron.updateInstance({ ...instance, name: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Java Executable (leave blank to use global)</label>
                <input className={styles.input} defaultValue={instance.javaPath ?? ''} placeholder={cfg?.java.executable || 'Auto-detect'} onBlur={e => window.electron.updateInstance({ ...instance, javaPath: e.target.value })} />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Min Memory (MB)</label>
                  <input className={styles.input} type="number" defaultValue={instance.minMemory ?? cfg?.java.minMemory ?? 512} onBlur={e => window.electron.updateInstance({ ...instance, minMemory: parseInt(e.target.value) })} />
                </div>
                <div className={styles.field}>
                  <label>Max Memory (MB)</label>
                  <input className={styles.input} type="number" defaultValue={instance.maxMemory ?? cfg?.java.maxMemory ?? 2048} onBlur={e => window.electron.updateInstance({ ...instance, maxMemory: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className={styles.field}>
                <label>JVM Arguments (leave blank to use global)</label>
                <input className={styles.input} defaultValue={instance.jvmArgs ?? ''} placeholder={cfg?.java.jvmArgs || 'None'} onBlur={e => window.electron.updateInstance({ ...instance, jvmArgs: e.target.value })} />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Window Width</label>
                  <input className={styles.input} type="number" defaultValue={instance.windowWidth ?? cfg?.minecraft.windowWidth ?? 854} onBlur={e => window.electron.updateInstance({ ...instance, windowWidth: parseInt(e.target.value) })} />
                </div>
                <div className={styles.field}>
                  <label>Window Height</label>
                  <input className={styles.input} type="number" defaultValue={instance.windowHeight ?? cfg?.minecraft.windowHeight ?? 480} onBlur={e => window.electron.updateInstance({ ...instance, windowHeight: parseInt(e.target.value) })} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'otherlogs' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Logs ({otherLogs.length})</h2>
                <button className={styles.addBtn} onClick={() => window.electron.openInstanceFolder(instanceId, 'minecraft/logs')}>📁 Open Folder</button>
              </div>
              {otherLogs.length === 0
                ? <div className={styles.empty}>No logs found</div>
                : <div className={styles.fileList}>{otherLogs.map(l => <div key={l} className={styles.fileItem}><span className={styles.fileIcon}>📄</span><span className={styles.fileName}>{l}</span></div>)}</div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InstanceEditor