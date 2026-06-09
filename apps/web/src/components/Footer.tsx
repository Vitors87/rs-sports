import Link from 'next/link';

const LINKS = [
  { href: '/feed', label: 'Feed' },
  { href: '/events', label: 'Eventos' },
  { href: '/groups', label: 'Comunidades' },
  { href: '/rankings', label: 'Rankings' },
];

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '2.5rem 1.5rem 3rem',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 900,
              fontSize: '1.15rem',
              letterSpacing: '-0.04em',
              color: 'var(--text)',
              marginBottom: '0.4rem',
            }}
          >
            RS<span style={{ color: 'var(--primary)' }}>·</span>Sports
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-3)', maxWidth: 320, lineHeight: 1.55 }}>
            La comunidad outdoor para runners, ciclistas y trekkers. Registra, comparte y mejora.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {['🏃 Running', '🚴 Ciclismo', '🥾 Trekking'].map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--r-pill)',
                  background: 'var(--bg)',
                  fontSize: '0.75rem',
                  color: 'var(--text-3)',
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-4)', marginBottom: '0.25rem' }}>
            Navegar
          </p>
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{ fontSize: '0.875rem', color: 'var(--text-3)', fontWeight: 500 }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: '2rem auto 0',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <p style={{ fontSize: '0.78rem', color: 'var(--text-4)' }}>© 2026 RS Sports</p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-4)' }}>MVP en desarrollo — Beta pública</p>
      </div>
    </footer>
  );
}
