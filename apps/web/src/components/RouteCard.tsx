'use client';

import Link from 'next/link';

const SPORT_GRAD: Record<string, string> = {
  RUNNING: 'linear-gradient(135deg, #e63946 0%, #b71c2b 100%)',
  CYCLING: 'linear-gradient(135deg, #f4a261 0%, #d97b34 100%)',
  TREKKING: 'linear-gradient(135deg, #457b9d 0%, #2d607e 100%)',
};

const SPORT_EMOJI: Record<string, string> = {
  RUNNING: '🏃',
  CYCLING: '🚴',
  TREKKING: '🥾',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  'Fácil': '#22c55e',
  'Media': '#f59e0b',
  'Difícil': '#e63946',
};

export interface RouteCardData {
  id: string;
  title: string;
  description?: string | null;
  distanceKm?: number | null;
  elevationGain?: number | null;
  durationMin?: number | null;
  city?: string | null;
  region?: string | null;
  difficulty?: string | null;
  imageUrl?: string | null;
  sport: { name: string; type: string };
}

function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function RoutePlaceholder({ type, size = 'card' }: { type: string; size?: 'card' | 'hero' }) {
  const grad = SPORT_GRAD[type] ?? 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
  const emoji = SPORT_EMOJI[type] ?? '🗺️';
  const h = size === 'hero' ? 260 : 140;
  return (
    <div style={{
      height: h,
      background: grad,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
      <div style={{ position: 'absolute', bottom: -20, left: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
      <span style={{ fontSize: size === 'hero' ? '4rem' : '2.5rem', position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
        {emoji}
      </span>
    </div>
  );
}

export function RouteCard({ route }: { route: RouteCardData }) {
  const diffColor = route.difficulty ? (DIFFICULTY_COLOR[route.difficulty] ?? 'var(--text-3)') : 'var(--text-3)';

  return (
    <article
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Image / placeholder */}
      {route.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={route.imageUrl}
          alt={route.title}
          style={{ height: 140, width: '100%', objectFit: 'cover', display: 'block', flexShrink: 0 }}
        />
      ) : (
        <RoutePlaceholder type={route.sport.type} />
      )}

      <div style={{ padding: '0.85rem 1rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {/* Sport + Difficulty badges */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: 'var(--surface)', background: SPORT_GRAD[route.sport.type] ?? 'var(--primary)',
            padding: '0.18rem 0.55rem', borderRadius: 'var(--r-pill)',
          }}>
            {route.sport.name}
          </span>
          {route.difficulty && (
            <span style={{
              fontSize: '0.68rem', fontWeight: 700, color: diffColor,
              border: `1.5px solid ${diffColor}`, padding: '0.18rem 0.55rem', borderRadius: 'var(--r-pill)',
              background: `${diffColor}15`,
            }}>
              {route.difficulty}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
          {route.title}
        </h3>

        {/* Location */}
        {(route.city || route.region) && (
          <p style={{ fontSize: '0.76rem', color: 'var(--text-4)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            📍 {[route.city, route.region].filter(Boolean).join(', ')}
          </p>
        )}

        {/* Metrics */}
        <div style={{ display: 'flex', gap: '1.1rem', marginTop: '0.15rem' }}>
          {route.distanceKm != null && (
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {route.distanceKm} km
              </div>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Distancia</div>
            </div>
          )}
          {route.elevationGain != null && (
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {route.elevationGain} m
              </div>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Desnivel</div>
            </div>
          )}
          {route.durationMin != null && (
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {formatDuration(route.durationMin)}
              </div>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Duración</div>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/routes/${route.id}`}
          style={{
            marginTop: 'auto',
            paddingTop: '0.75rem',
            display: 'block',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--r-pill)',
            background: 'var(--primary)',
            color: '#fff',
            fontSize: '0.82rem',
            fontWeight: 700,
            textAlign: 'center',
            transition: 'opacity 0.14s',
          }}
        >
          Ver ruta →
        </Link>
      </div>
    </article>
  );
}

export function RouteCardCompact({ route }: { route: RouteCardData }) {
  const diffColor = route.difficulty ? (DIFFICULTY_COLOR[route.difficulty] ?? 'var(--text-3)') : undefined;
  const emoji = SPORT_EMOJI[route.sport.type] ?? '🗺️';

  return (
    <Link
      href={`/routes/${route.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.6rem 0.25rem',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.12s',
      }}
    >
      <span style={{
        width: 36, height: 36, borderRadius: 'var(--r-sm)', flexShrink: 0,
        background: SPORT_GRAD[route.sport.type] ?? 'var(--primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
      }}>
        {emoji}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {route.title}
        </div>
        <div style={{ fontSize: '0.71rem', color: 'var(--text-4)', marginTop: 2 }}>
          {route.distanceKm != null && `${route.distanceKm} km`}
          {route.distanceKm != null && route.difficulty ? ' · ' : ''}
          {route.difficulty && <span style={{ color: diffColor }}>{route.difficulty}</span>}
        </div>
      </div>
    </Link>
  );
}
