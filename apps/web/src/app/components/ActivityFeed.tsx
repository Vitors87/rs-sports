const SPORT_COLORS: Record<string, string> = {
  RUNNING: '#e63946',
  CYCLING: '#f4a261',
  TREKKING: '#457b9d',
};

export interface ActivityItem {
  id: string;
  title: string;
  description?: string | null;
  distance?: number | null;
  duration?: number | null;
  elevation?: number | null;
  date: string;
  user: { name: string; username: string; avatarUrl?: string | null };
  sport: { id: string; name: string; type: string };
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #2a9d8f, #1a6b62)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.72rem',
        fontWeight: 800,
        flexShrink: 0,
        letterSpacing: '0.02em',
      }}
    >
      {initials}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{value}</span>
      <span
        style={{
          fontSize: '0.68rem',
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function ActivityCard({ activity }: { activity: ActivityItem }) {
  const color = SPORT_COLORS[activity.sport.type] ?? '#2a9d8f';
  const dateStr = new Date(activity.date).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 12,
        padding: '1.1rem 1.25rem',
        borderLeft: `4px solid ${color}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        marginBottom: '0.65rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
        <Avatar name={activity.user.name} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>
            {activity.user.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            @{activity.user.username} · {dateStr}
          </div>
        </div>
        <span
          style={{
            padding: '0.18rem 0.6rem',
            borderRadius: 999,
            background: `${color}16`,
            color,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          {activity.sport.name}
        </span>
      </div>

      <h3
        style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: activity.description ? '0.3rem' : '0',
        }}
      >
        {activity.title}
      </h3>

      {activity.description && (
        <p
          style={{
            fontSize: '0.82rem',
            color: '#64748b',
            lineHeight: 1.5,
            marginBottom: '0.6rem',
          }}
        >
          {activity.description}
        </p>
      )}

      {(activity.distance || activity.duration || activity.elevation) && (
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            paddingTop: '0.6rem',
            marginTop: '0.4rem',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          {activity.distance != null && (
            <Metric label="km" value={activity.distance.toFixed(1)} />
          )}
          {activity.duration != null && (
            <Metric label="min" value={activity.duration.toString()} />
          )}
          {activity.elevation != null && (
            <Metric label="m desnivel" value={activity.elevation.toString()} />
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  activities: ActivityItem[];
  loading: boolean;
}

export function ActivityFeed({ activities, loading }: Props) {
  if (loading) {
    return (
      <>
        <style>{`@keyframes rs-pulse{0%,100%{opacity:1}50%{opacity:.35}}`}</style>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: 'white',
              borderRadius: 12,
              height: 110,
              borderLeft: '4px solid #e2e8f0',
              marginBottom: '0.65rem',
              animation: 'rs-pulse 1.4s ease-in-out infinite',
            }}
          />
        ))}
      </>
    );
  }

  if (activities.length === 0) {
    return (
      <div
        style={{
          background: 'white',
          borderRadius: 12,
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ fontSize: '2.25rem', marginBottom: '0.65rem' }}>🏁</div>
        <p style={{ color: '#475569', fontWeight: 600, fontSize: '0.9rem' }}>
          Aún no hay actividades.
        </p>
        <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '0.3rem' }}>
          ¡Sé el primero en registrar una!
        </p>
      </div>
    );
  }

  return (
    <div>
      {activities.map((a) => (
        <ActivityCard key={a.id} activity={a} />
      ))}
    </div>
  );
}
