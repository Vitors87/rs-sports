import { ApiStatus } from './components/ApiStatus';

// ─── Data ────────────────────────────────────────────────────────────────────

const DISCIPLINES = [
  {
    name: 'Running',
    description: 'Registra tus carreras, comparte recorridos y compite con la comunidad runner.',
    color: '#e63946',
  },
  {
    name: 'Ciclismo',
    description: 'Sube tus rutas en bici, descubre nuevos circuitos y conecta con ciclistas.',
    color: '#2a9d8f',
  },
  {
    name: 'Trekking',
    description: 'Explora senderos, registra ascensos y únete a grupos de montañistas.',
    color: '#457b9d',
  },
];

const FEATURES = [
  'Registrar actividades (distancia, duración, desnivel)',
  'Compartir publicaciones en el feed social',
  'Participar en eventos deportivos',
  'Ver rankings por disciplina',
  'Unirte a grupos y comunidades',
];

const MVP_STATUS = [
  { label: 'Web base', ok: true },
  { label: 'API base', ok: true },
  { label: 'Base de datos', ok: false, note: 'Pendiente de conexión' },
  { label: 'Mobile Flutter', ok: false, note: 'Pendiente de prueba' },
];

// ─── Styles ──────────────────────────────────────────────────────────────────

const S = {
  page: {
    maxWidth: 920,
    margin: '0 auto',
    padding: '3rem 1.5rem 5rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#111',
  },
  sectionTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#374151',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #e5e7eb',
  },
  section: {
    marginBottom: '3rem',
  },
  card: (color: string) => ({
    padding: '1.75rem',
    borderRadius: 12,
    border: `2px solid ${color}`,
    background: `${color}10`,
  }),
  cardTitle: (color: string) => ({
    fontSize: '1.35rem',
    fontWeight: 700,
    color,
    margin: '0 0 0.6rem',
  }),
  cardDesc: {
    color: '#4b5563',
    margin: 0,
    lineHeight: 1.6,
    fontSize: '0.95rem',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.6rem',
    marginBottom: '0.6rem',
    fontSize: '0.95rem',
    color: '#374151',
  },
  statusItem: (ok: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.65rem 1rem',
    borderRadius: 8,
    background: ok ? '#f0fdf4' : '#fafafa',
    border: `1px solid ${ok ? '#bbf7d0' : '#e5e7eb'}`,
    marginBottom: '0.5rem',
  }),
  dot: (ok: boolean) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
    background: ok ? '#22c55e' : '#94a3b8',
  }),
  panel: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '1.5rem',
  },
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main style={S.page}>

      {/* Header */}
      <div style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.03em' }}>
          RS Sports
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', margin: 0 }}>
          Red social deportiva para running, ciclismo y trekking
        </p>
      </div>

      {/* Disciplinas */}
      <div style={S.section}>
        <h2 style={S.sectionTitle}>Disciplinas</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {DISCIPLINES.map((d) => (
            <div key={d.name} style={S.card(d.color)}>
              <h3 style={S.cardTitle(d.color)}>{d.name}</h3>
              <p style={S.cardDesc}>{d.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Qué podrás hacer */}
      <div style={S.section}>
        <h2 style={S.sectionTitle}>Qué podrás hacer</h2>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {FEATURES.map((f) => (
            <li key={f} style={S.featureItem}>
              <span style={{ color: '#2a9d8f', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1 }}>
                →
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Estado del MVP */}
      <div style={S.section}>
        <h2 style={S.sectionTitle}>Estado del MVP</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
          {MVP_STATUS.map((item) => (
            <div key={item.label} style={S.statusItem(item.ok)}>
              <span style={S.dot(item.ok)} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
                {item.label}
              </span>
              <span style={{ fontSize: '0.85rem', color: item.ok ? '#16a34a' : '#9ca3af', marginLeft: 'auto' }}>
                {item.ok ? 'OK' : item.note ?? 'Pendiente'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Conectividad API */}
      <div style={S.section}>
        <h2 style={S.sectionTitle}>Conectividad API</h2>
        <div style={S.panel}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#64748b' }}>
            Verificando <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>GET /api/health</code>{' '}
            en tiempo real desde el navegador:
          </p>
          <ApiStatus />
        </div>
      </div>

    </main>
  );
}
