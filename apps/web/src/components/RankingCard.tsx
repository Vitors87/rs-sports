const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${Math.round(size * 0.32)}px`,
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export interface RankingEntry {
  position: number;
  name: string;
  username: string;
  score: number;
  unit: string;
  activities: number;
}

export function RankingCard({ entry }: { entry: RankingEntry }) {
  const isTop3 = entry.position <= 3;
  const medal = MEDAL[entry.position];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.7rem 0.85rem',
        borderRadius: 'var(--r)',
        background: isTop3 ? 'var(--primary-glow)' : 'transparent',
        border: isTop3 ? '1px solid rgba(42,157,143,0.2)' : '1px solid transparent',
        transition: 'background 0.15s',
      }}
    >
      {/* Position */}
      <div
        style={{
          width: 28,
          textAlign: 'center',
          fontSize: medal ? '1.1rem' : '0.82rem',
          fontWeight: 800,
          color: isTop3 ? 'var(--primary)' : 'var(--text-4)',
          flexShrink: 0,
        }}
      >
        {medal ?? `#${entry.position}`}
      </div>

      <Avatar name={entry.name} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.2 }}>
          {entry.name}
        </div>
        <div style={{ fontSize: '0.73rem', color: 'var(--text-4)' }}>
          @{entry.username} · {entry.activities} actividades
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {entry.score.toFixed(1)}
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {entry.unit}
        </div>
      </div>
    </div>
  );
}
