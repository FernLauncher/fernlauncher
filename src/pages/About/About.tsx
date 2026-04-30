import styles from './About.module.css'

function About() {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>🌿</div>
      <div className={styles.name}>Fernlaunch</div>
      <div className={styles.version}>Version 1.0.0</div>
      <div className={styles.desc}>A Minecraft launcher built with Electron & React</div>
      <div className={styles.links}>
        <button onClick={() => window.electron.openExternalUrl('https://github.com/FernLauncher/fernlauncher')}>
          GitHub
        </button>
        <button onClick={() => window.electron.openExternalUrl('https://discord.gg/fernlaunch')}>
          Discord
        </button>
      </div>
      <div className={styles.credits}>
        <div className={styles.creditsTitle}>Built with</div>
        <div className={styles.creditsList}>
          Electron · React · TypeScript · Vite · Zustand
        </div>
      </div>
      <div className={styles.copy}>© 2026 Fernlaunch. MIT License.</div>
    </div>
  )
}

export default About