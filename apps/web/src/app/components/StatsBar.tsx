interface Activity {
  distance?: number | null;
  sport?: { type: string } | null;
}

interface Props {
  activities: Activity[];
}

export function StatsBar({ activities }: Props) {
  const totalKm = activities.reduce((sum, a) => sum + (a.distance ?? 0), 0);
  const disciplines = new Set(activities.flatMap((a) => (a.sport?.type ? [a.sport.type] : []))).size;

  const stats = [
    { label: 'Actividades', value: activities.length.toString() },
    { label: 'Kilómetros', value: `${totalKm.toFixed(1)} km` },
    { label: 'Disciplinas', value: disciplines.toString() },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: 1,
        background: '#e2e8f0',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: '2rem',
      }}
    >
      {stats.map(({ label, value }) => (
        <div
          key={label}
          style={{
            flex: 1,
            background: 'white',
            padding: '1.1rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#1e293b',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              color: '#94a3b8',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '0.2rem',
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
