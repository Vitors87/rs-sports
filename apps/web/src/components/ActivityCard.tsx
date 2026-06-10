'use client';

import { useState } from 'react';

const SPORT_COLOR: Record<string, string> = {
  RUNNING: '#e63946',
  CYCLING: '#f4a261',
  TREKKING: '#457b9d',
};

const SPORT_GRAD: Record<string, string> = {
  RUNNING:  'linear-gradient(135deg, #e63946 0%, #b71c2b 100%)',
  CYCLING:  'linear-gradient(135deg, #f4a261 0%, #d97b34 100%)',
  TREKKING: 'linear-gradient(135deg, #457b9d 0%, #2d607e 100%)',
};

const SPORT_EMOJI: Record<string, string> = {
  RUNNING: '🏃',
  CYCLING: '🚴',
  TREKKING: '🥾',
};

export interface ActivityCardData {
  id: string;
  title: string;
  description?: string | null;
  distance?: number | null;
  duration?: number | null;
  elevation?: number | null;
  date: string;
  user: { name: string; username: string };
  sport: { name: string; type: string };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (d > 6) return new Date(dateStr).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  if (d > 0) return `hace ${d}d`;
  if (h > 0) return `hace ${h}h`;
  if (m > 0) return `hace ${m}m`;
  return 'ahora';
}

function Avatar({ name, size = 38 }: { name: string; size?: number }) {
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
        letterSpacing: '0.02em',
      }}
    >
      {initials}
    </div>
  );
}

export function ActivityCard({ activity }: { activity: ActivityCardData }) {
  const color = SPORT_COLOR[activity.sport.type] ?? 'var(--primary)';
  const grad = SPORT_GRAD[activity.sport.type] ?? 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
  const emoji = SPORT_EMOJI[activity.sport.type] ?? '🏅';
  const [liked, setLiked] = useState(false);

  return (
    <article
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        animation: 'rs-fade-up 0.25s ease',
      }}
    >
      {/* Sport banner */}
      <div
        style={{
          height: 76,
          background: grad,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 1.25rem',
        }}
      >
        <div style={{ position: 'absolute', top: -24, right: 64, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', top: -12, right: 18, width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: 8, left: 16, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.65)' }}>
          {activity.sport.name}
        </div>
        <span style={{ fontSize: '2.25rem', position: 'relative', zIndex: 1 }}>{emoji}</span>
      </div>

      <div style={{ padding: '1rem 1.15rem 0.8rem' }}>
        {/* User header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.7rem' }}>
          <Avatar name={activity.user.name} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.2 }}>
              {activity.user.name}
            </div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-4)' }}>
              @{activity.user.username} · {timeAgo(activity.date)}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '0.975rem',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: activity.description ? '0.3rem' : '0.7rem',
            lineHeight: 1.3,
          }}
        >
          {activity.title}
        </h3>

        {activity.description && (
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-3)',
              marginBottom: '0.7rem',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {activity.description}
          </p>
        )}

        {/* Metrics */}
        {(activity.distance != null || activity.duration != null || activity.elevation != null) && (
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              padding: '0.6rem 0 0.7rem',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              marginBottom: '0.7rem',
            }}
          >
            {activity.distance != null && (
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {activity.distance.toFixed(1)}
                </div>
                <div style={{ fontSize: '0.67rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>km</div>
              </div>
            )}
            {activity.duration != null && (
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {activity.duration}
                </div>
                <div style={{ fontSize: '0.67rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>min</div>
              </div>
            )}
            {activity.elevation != null && (
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {activity.elevation}
                </div>
                <div style={{ fontSize: '0.67rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>m ↑</div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.15rem' }}>
          <button
            onClick={() => setLiked(!liked)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.7rem',
              borderRadius: 'var(--r-sm)',
              fontSize: '0.82rem',
              fontWeight: liked ? 600 : 500,
              color: liked ? '#e63946' : 'var(--text-3)',
              background: liked ? 'rgba(230,57,70,0.08)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.14s',
            }}
          >
            {liked ? '❤️' : '🤍'} Me gusta
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.7rem',
              borderRadius: 'var(--r-sm)',
              fontSize: '0.82rem',
              fontWeight: 500,
              color: 'var(--text-3)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            💬 Comentar
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.7rem',
              borderRadius: 'var(--r-sm)',
              fontSize: '0.82rem',
              fontWeight: 500,
              color: 'var(--text-3)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            ↗ Compartir
          </button>
        </div>
      </div>
    </article>
  );
}
