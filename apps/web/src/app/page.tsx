import styles from './page.module.css';
import { FeedSection } from './components/FeedSection';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <header className={styles.hero}>
        <p className={styles.heroEyebrow}>Red Social Deportiva</p>
        <h1 className={styles.heroTitle}>
          RS <span>Sports</span>
        </h1>
        <p className={styles.heroSub}>
          Registra tus actividades, comparte con la comunidad y compite en running, ciclismo y trekking.
        </p>
        <div className={styles.heroTags}>
          <span
            className={styles.heroTag}
            style={{ background: 'rgba(230,57,70,0.15)', color: '#e63946' }}
          >
            🏃 Running
          </span>
          <span
            className={styles.heroTag}
            style={{ background: 'rgba(244,162,97,0.15)', color: '#f4a261' }}
          >
            🚴 Ciclismo
          </span>
          <span
            className={styles.heroTag}
            style={{ background: 'rgba(69,123,157,0.15)', color: '#6aabcf' }}
          >
            🥾 Trekking
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.content}>
        <FeedSection />
      </main>
    </>
  );
}
