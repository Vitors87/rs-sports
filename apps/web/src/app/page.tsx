import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './page.module.css';
import { Footer } from '@/components/Footer';
import { EventCard, type EventCardData } from '@/components/EventCard';

export const metadata: Metadata = {
  title: 'RS Sports — La comunidad outdoor para runners, ciclistas y trekkers',
  description: 'Registra actividades, comparte con la comunidad y participa en eventos de running, ciclismo y trekking en Chile.',
};

const SPORTS = [
  {
    type: 'RUNNING',
    name: 'Running',
    emoji: '🏃',
    grad: 'linear-gradient(135deg, #e63946, #b71c2b)',
    desc: 'Registra cada kilómetro, desde tu rodada matutina hasta maratones. Comparte tus rutas y compite con la comunidad runner.',
    stat: '1.200 actividades este mes',
  },
  {
    type: 'CYCLING',
    name: 'Ciclismo',
    emoji: '🚴',
    grad: 'linear-gradient(135deg, #f4a261, #d97b34)',
    desc: 'Rutas de ruta y MTB, descensos técnicos y fondos épicos por la cordillera. Conecta con ciclistas de toda la RM.',
    stat: '840 actividades este mes',
  },
  {
    type: 'TREKKING',
    name: 'Trekking',
    emoji: '🥾',
    grad: 'linear-gradient(135deg, #457b9d, #2d607e)',
    desc: 'Desde cumbres en los Andes hasta senderos patagónicos. Explora, registra y comparte cada aventura outdoor.',
    stat: '410 actividades este mes',
  },
];

const STEPS = [
  { num: 1, icon: '📝', title: 'Registra actividades', desc: 'Sube distancia, duración y desnivel de tus entrenamientos.' },
  { num: 2, icon: '📢', title: 'Comparte con la comunidad', desc: 'Tu actividad aparece en el feed de toda la red social.' },
  { num: 3, icon: '🗓', title: 'Participa en eventos', desc: 'Inscríbete en carreras, rutas y trekking organizados.' },
  { num: 4, icon: '📈', title: 'Mejora tu rendimiento', desc: 'Revisa tus estadísticas y sube en los rankings.' },
];

const METRICS = [
  { value: '2.450', label: 'Actividades' },
  { value: '850', label: 'Deportistas' },
  { value: '120', label: 'Eventos' },
  { value: '35', label: 'Comunidades' },
];

const DEMO_EVENTS: EventCardData[] = [
  {
    id: 'e1',
    title: 'Maratón de Santiago 2026',
    description: 'El evento de running más importante de Chile. 42K por las principales avenidas.',
    location: 'Parque O\'Higgins',
    date: '2026-11-15T08:00:00',
    participants: 7840,
    maxParticipants: 10000,
    sport: { name: 'Running', type: 'RUNNING' },
  },
  {
    id: 'e2',
    title: 'Desafío MTB Andes',
    description: 'Ruta técnica de 35km por el Cajón del Maipo con 850m de desnivel positivo.',
    location: 'Cajón del Maipo, RM',
    date: '2026-08-10T09:00:00',
    participants: 312,
    maxParticipants: 500,
    sport: { name: 'Ciclismo', type: 'CYCLING' },
  },
  {
    id: 'e3',
    title: 'Trekking Cerro Provincia',
    description: 'Ascenso guiado con vista panorámica del Valle de Aconcagua y los Andes centrales.',
    location: 'Cerro Provincia, RM',
    date: '2026-07-05T07:00:00',
    participants: 89,
    maxParticipants: 200,
    sport: { name: 'Trekking', type: 'TREKKING' },
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />

        <div className={styles.heroEyebrow}>
          <span>🌿</span> Red Social Deportiva — Beta 2026
        </div>

        <h1 className={styles.heroTitle}>
          RS <span>Sports</span>
        </h1>

        <p className={styles.heroSub}>
          La comunidad outdoor para runners, ciclistas y trekkers. Registra, comparte y supérate.
        </p>

        <div className={styles.heroCtas}>
          <Link href="/feed" className={styles.ctaPrimary}>
            Explorar comunidad
          </Link>
          <Link href="/events" className={styles.ctaSecondary}>
            Ver eventos →
          </Link>
        </div>

        <div className={styles.heroTags}>
          <span className={styles.heroTag} style={{ background: 'rgba(230,57,70,0.15)', color: '#e63946' }}>
            🏃 Running
          </span>
          <span className={styles.heroTag} style={{ background: 'rgba(244,162,97,0.15)', color: '#f4a261' }}>
            🚴 Ciclismo
          </span>
          <span className={styles.heroTag} style={{ background: 'rgba(69,123,157,0.15)', color: '#7ab2d0' }}>
            🥾 Trekking
          </span>
        </div>

        {/* Mountain SVG silhouette */}
        <div className={styles.heroMountain}>
          <svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 'auto' }}>
            <path d="M0 200L200 90L350 130L500 55L680 115L820 40L980 100L1120 38L1280 85L1440 50V200z" fill="rgba(42,157,143,0.10)" />
            <path d="M0 200L160 130L320 165L460 85L620 150L780 95L920 155L1060 88L1220 140L1380 95L1440 115V200z" fill="rgba(42,157,143,0.07)" />
            <path d="M0 200L120 160L260 125L400 170L540 105L680 160L830 130L1000 170L1140 110L1300 155L1440 135V200z" fill="rgba(10,22,40,0.55)" />
          </svg>
        </div>
      </section>

      {/* ── SPORTS ───────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className={styles.sectionLabel}>Disciplinas</p>
          <h2 className={styles.sectionTitle}>Tres deportes, una comunidad</h2>
          <p className={styles.sectionSub}>
            Running, ciclismo y trekking comparten el amor por el aire libre. RS Sports es el espacio para las tres.
          </p>

          <div className={styles.sportsGrid}>
            {SPORTS.map((s) => (
              <div key={s.type} className={styles.sportCard}>
                <div className={styles.sportCardBanner} style={{ background: s.grad }}>
                  <div style={{ position: 'absolute', top: -20, right: 60, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ position: 'absolute', top: -10, right: 14, width: 55, height: 55, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                  <span style={{ fontSize: '2.75rem', position: 'relative', zIndex: 1 }}>{s.emoji}</span>
                </div>
                <div className={styles.sportCardBody}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
                    {s.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {s.desc}
                  </p>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>
                    📊 {s.stat}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METRICS ──────────────────────────────────────────────── */}
      <div className={styles.metricsBand}>
        <div className={styles.metricsGrid}>
          {METRICS.map(({ value, label }) => (
            <div key={label} className={styles.metricItem}>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05 }}>
                {value}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginTop: '0.4rem' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--surface)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p className={styles.sectionLabel}>Cómo funciona</p>
          <h2 className={styles.sectionTitle}>Simple como salir a correr</h2>

          <div className={styles.stepsGrid}>
            {STEPS.map(({ num, icon, title, desc }) => (
              <div key={num} className={styles.stepCard}>
                <div className={styles.stepNumber}>{num}</div>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{icon}</div>
                <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-3)', lineHeight: 1.55 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ──────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className={styles.sectionLabel}>Próximos eventos</p>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Participa y compite</h2>
            </div>
            <Link
              href="/events"
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: 'var(--r-pill)',
                border: '1.5px solid var(--border)',
                background: 'var(--surface)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-2)',
                flexShrink: 0,
              }}
            >
              Ver todos los eventos →
            </Link>
          </div>
          <div className={styles.eventsGrid}>
            {DEMO_EVENTS.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <h2
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
          }}
        >
          ¿Listo para comenzar?
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.72)', marginBottom: '2rem', maxWidth: 420, margin: '0 auto 2rem' }}>
          Únete a la comunidad outdoor más activa de Chile. Es gratis.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/feed"
            style={{
              padding: '0.85rem 2.25rem',
              borderRadius: 'var(--r-pill)',
              background: '#fff',
              color: 'var(--primary-dark)',
              fontSize: '1rem',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            Explorar el feed
          </Link>
          <Link
            href="/events"
            style={{
              padding: '0.85rem 2.25rem',
              borderRadius: 'var(--r-pill)',
              background: 'transparent',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 700,
              border: '2px solid rgba(255,255,255,0.35)',
              textDecoration: 'none',
            }}
          >
            Ver eventos
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
