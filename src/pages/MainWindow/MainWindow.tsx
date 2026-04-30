import { useState, useEffect } from 'react'
import { useInstanceStore } from '../../store/instanceStore'
import { useAccountStore } from '../../store/accountStore'
import Toolbar from './Toolbar'
import InstanceGrid from './InstanceGrid'
import RightPanel from './RightPanel'
import StatusBar from './StatusBar'
import styles from './MainWindow.module.css'

function MainWindow() {
  const { instances, selectedId, load: loadInstances } = useInstanceStore()
  const { load: loadAccounts } = useAccountStore()
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateDownloaded, setUpdateDownloaded] = useState(false)


  useEffect(() => {
    loadInstances()
    loadAccounts()

    window.electron.on('instances:updated', () => loadInstances())
    window.electron.on('accounts:updated', () => loadAccounts())

    return () => {
      window.electron.off('instances:updated', () => loadInstances())
      window.electron.off('accounts:updated', () => loadAccounts())
    }
  }, [])

  useEffect(() => {
    window.electron.onUpdateAvailable(() => setUpdateAvailable(true))
    window.electron.onUpdateDownloaded(() => setUpdateDownloaded(true))
  }, [])

  const selected = instances.find(i => i.id === selectedId) ?? null

  return (
    <div className={styles.container}>
      {updateDownloaded && (
        <div className={styles.updateBanner}>
          🎉 Update downloaded!
          <button onClick={() => window.electron.installUpdate()}>Restart & Install</button>
        </div>
      )}
      {updateAvailable && !updateDownloaded && (
        <div className={styles.updateBanner}>
          ⬇ Downloading update...
        </div>
      )}
      <Toolbar onAddInstance={() => window.electron.openNewInstance()} />
      <div className={styles.main}>
        <InstanceGrid />
        {selected && <RightPanel instance={selected} />}
      </div>
      <StatusBar instance={selected} />
    </div>
  )
}

export default MainWindow