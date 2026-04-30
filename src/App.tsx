import { useEffect, useState } from 'react'
import { useSettingsStore } from './store/settingsStore'
import { useTheme } from './hooks/useTheme'
import { setLanguage } from './hooks/useI18n'
import FirstLaunch from './pages/FirstLaunch/FirstLaunch'
import MainWindow from './pages/MainWindow/MainWindow'
import NewInstance from './pages/NewInstance/NewInstance'
import Settings from './pages/Settings/Settings'
import JavaDownload from './pages/JavaDownload/JavaDownload'
import ConsoleWindow from './pages/ConsoleWindow/ConsoleWindow'
import InstanceEditor from './pages/InstanceEditor/InstanceEditor'
import About from './pages/About/About'

function App() {
  const { load, isLoaded, config } = useSettingsStore()
  const [isFirstLaunch, setIsFirstLaunch] = useState(false)
  const [isNewInstance, setIsNewInstance] = useState(false)
  const [isSettings, setIsSettings] = useState(false)
  const [isJavaDownload, setIsJavaDownload] = useState(false)
  const [isConsole, setIsConsole] = useState(false)
  const [consoleInstanceId, setConsoleInstanceId] = useState<string>('')
  const [isInstanceEditor, setIsInstanceEditor] = useState(false)
  const [editorInstanceId, setEditorInstanceId] = useState<string>('')
  const [isAbout, setIsAbout] = useState(false)

  useTheme()

  useEffect(() => {
    load().then(() => {
      const params = new URLSearchParams(window.location.search)
      setIsFirstLaunch(params.get('firstLaunch') === 'true')
      setIsNewInstance(params.get('window') === 'newInstance')
      setIsSettings(params.get('window') === 'settings')
      setIsJavaDownload(params.get('window') === 'javaDownload')
      setIsConsole(params.get('window') === 'console')
      setConsoleInstanceId(params.get('instanceId') ?? '')
      setIsInstanceEditor(params.get('window') === 'instanceEditor')
      setEditorInstanceId(params.get('instanceId') ?? '')
      setIsAbout(params.get('window') === 'about')
    })
  }, [])

  useEffect(() => {
    if (isLoaded) setLanguage(config.language)
  }, [isLoaded, config.language])

  if (!isLoaded) return null
  if (isFirstLaunch) return <FirstLaunch onComplete={() => setIsFirstLaunch(false)} />
  if (isNewInstance) return <NewInstance onClose={() => window.close()} />
  if (isSettings) return <Settings />
  if (isJavaDownload) return <JavaDownload />
  if (isConsole) return <ConsoleWindow instanceId={consoleInstanceId} />
  if (isInstanceEditor) return <InstanceEditor instanceId={editorInstanceId} />
  if (isAbout) return <About />

  return <MainWindow />
}

export default App