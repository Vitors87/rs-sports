const SPORT_COLOR: Record<string, string> = {
  RUNNING: '#e63946',
  CYCLING: '#f4a261',
  TREKKING: '#457b9d',
};

const SPORT_EMOJI: Record<string, string> = {
  RUNNING: '🏃',
  CYCLING: '🚴',
  TREKKING: '🥾',
};

export interface GroupCardData {
  id: string;
  name: string;
  description?: string | null;
  members: number;
  recentActivity?: string;
  sport?: { name: string; type: string } | null;
}

export function GroupCard({ group }: { group: GroupCardData }) {
  const color = group.sport ? (SPORT_COLOR[group.sport.type] ?? 'var(--primary)') : 'var(--primary)';
  const emoji = group.sport ? (SPORT_EMOJI[group.sport.type] ?? '🏅') : '🤝';

  const initial = group.name[0].toUpperCase();

  return (
    <article
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        padding: '1.25rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 'var(--r)',
          background: `linear-gradient(135deg, ${color}, ${color}99)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
            {group.name}
          </h3>
          {group.sport && (
            <span
              style={{
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--r-pill)',
                background: `${color}14`,
                color,
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                flexShrink: 0,
              }}
            >
              {group.sport.name}
            </span>
          )}
        </div>

        {group.description && (
          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-3)',
              marginBottom: '0.7rem',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {group.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-4)' }}>
              👥 {group.members.toLocaleString('es-CL')} miembros
            </span>
            {group.recentActivity && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-4)' }}>
                🕐 {group.recentActivity}
              </span>
            )}
          </div>
          <button
            style={{
              padding: '0.38rem 1rem',
              borderRadius: 'var(--r-pill)',
              background: color,
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Unirse
          </button>
        </div>
      </div>
    </article>
  );
}
