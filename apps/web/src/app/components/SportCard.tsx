'use client';

const SPORT_COLORS: Record<string, string> = {
  RUNNING: '#e63946',
  CYCLING: '#f4a261',
  TREKKING: '#457b9d',
};

const SPORT_ICONS: Record<string, string> = {
  RUNNING: '🏃',
  CYCLING: '🚴',
  TREKKING: '🥾',
};

interface Sport {
  id: string;
  name: string;
  type: string;
}

interface Props {
  sport: Sport;
  selected: boolean;
  onClick: (id: string) => void;
}

export function SportCard({ sport, selected, onClick }: Props) {
  const color = SPORT_COLORS[sport.type] ?? '#2a9d8f';
  const icon = SPORT_ICONS[sport.type] ?? '🏅';

  return (
    <button
      type="button"
      onClick={() => onClick(sport.id)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '1.25rem 1rem',
        borderRadius: 12,
        border: `2px solid ${selected ? color : 'transparent'}`,
        background: selected ? `${color}14` : 'white',
        boxShadow: selected
          ? `0 0 0 3px ${color}30, 0 2px 8px rgba(0,0,0,0.06)`
          : '0 1px 3px rgba(0,0,0,0.07)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        width: '100%',
      }}
    >
      <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: selected ? color : '#1e293b',
          letterSpacing: '-0.01em',
        }}
      >
        {sport.name}
      </span>
    </button>
  );
}
