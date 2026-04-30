import { useState, useEffect, useRef } from 'react'
import { useI18n } from '../../hooks/useI18n'
import styles from './ConsoleWindow.module.css'

interface Props {
  instanceId: string
}

interface LogLine {
  text: string
  type: 'info' | 'warn' | 'error' | 'debug' | 'fatal' | 'plain'
}

function parseLine(line: string): LogLine {
  if (line.includes('[ERROR]') || line.includes('ERROR]')) return { text: line, type: 'error' }
  if (line.includes('[WARN]') || line.includes('WARN]')) return { text: line, type: 'warn' }
  if (line.includes('[DEBUG]') || line.includes('DEBUG]')) return { text: line, type: 'debug' }
  if (line.includes('[FATAL]') || line.includes('FATAL]')) return { text: line, type: 'fatal' }
  if (line.includes('[INFO]') || line.includes('INFO]')) return { text: line, type: 'info' }
  return { text: line, type: 'plain' }
}

function ConsoleWindow({ instanceId }: Props) {
  const { t } = useI18n()
  const [lines, setLines] = useState<LogLine[]>([])
  const [search, setSearch] = useState('')
  const [keepUpdating, setKeepUpdating] = useState(true)
  const [wrapLines, setWrapLines] = useState(true)
  const [colorLines, setColorLines] = useState(true)
  const [status, setStatus] = useState<string>('launching')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.electron.on('instance:log', (data: any) => {
      if (data.instanceId !== instanceId) return
      setLines(prev => [...prev, parseLine(data.line)])
    })

    window.electron.on('instance:status', (data: any) => {
      if (data.instanceId !== instanceId) return
      setStatus(data.status)
    })

    return () => {
      window.electron.off('instance:log', () => {})
      window.electron.off('instance:status', () => {})
    }
  }, [instanceId])

  useEffect(() => {
    if (keepUpdating) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [lines, keepUpdating])

  const filtered = search
    ? lines.filter(l => l.text.toLowerCase().includes(search.toLowerCase()))
    : lines

  const copyLog = () => {
    navigator.clipboard.writeText(lines.map(l => l.text).join('\n'))
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <label className={styles.check}>
          <input type="checkbox" checked={keepUpdating} onChange={e => setKeepUpdating(e.target.checked)} />
          Keep updating
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={wrapLines} onChange={e => setWrapLines(e.target.checked)} />
          Wrap lines
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={colorLines} onChange={e => setColorLines(e.target.checked)} />
          Color lines
        </label>
        <div style={{ flex: 1 }} />
        <button onClick={copyLog}>Copy</button>
        <button onClick={() => setLines([])}>Clear</button>
      </div>

      <div className={styles.log}>
        {filtered.map((line, i) => (
          <div
            key={i}
            className={`${styles.line} ${colorLines ? styles[line.type] : ''} ${wrapLines ? styles.wrap : ''}`}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={styles.searchBar}>
        <input
          className={styles.searchInput}
          placeholder="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button>Find</button>
        <button onClick={() => bottomRef.current?.scrollIntoView()}>Bottom</button>
      </div>

      <div className={styles.footer}>
        <button>Help</button>
        <div style={{ flex: 1 }} />
        <button
          className="primary"
          onClick={() => window.electron.launchInstance(instanceId)}
          disabled={status === 'running' || status === 'launching'}
        >
          Launch
        </button>
        <button
          className="danger"
          onClick={() => window.electron.killInstance(instanceId)}
          disabled={status !== 'running'}
        >
          Kill
        </button>
        <button onClick={() => window.close()}>Close</button>
      </div>
    </div>
  )
}

export default ConsoleWindow