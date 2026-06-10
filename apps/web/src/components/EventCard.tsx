'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';

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

export interface EventCardData {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  date: string;
  maxParticipants?: number | null;
  participants: number;
  isParticipating?: boolean;
  sport: { name: string; type: string };
}

export function EventCard({ event, compact = false }: { event: EventCardData; compact?: boolean }) {
  const [isParticipating, setIsParticipating] = useState(event.isParticipating ?? false);
  const [participantCount, setParticipantCount] = useState(event.participants);
  const [loading, setLoading] = useState(false);

  const color = SPORT_COLOR[event.sport.type] ?? 'var(--primary)';
  const emoji = SPORT_EMOJI[event.sport.type] ?? '🏅';
  const dateObj = new Date(event.date);
  const day = dateObj.toLocaleDateString('es-CL', { day: 'numeric' });
  const month = dateObj.toLocaleDateString('es-CL', { month: 'short' }).replace('.', '');
  const year = dateObj.getFullYear();
  const pct = event.maxParticipants
    ? Math.min(100, Math.round((participantCount / event.maxParticipants) * 100))
    : null;

  async function handleParticipate() {
    if (loading) return;
    setLoading(true);
    const was = isParticipating;
    setIsParticipating(!was);
    setParticipantCount((c) => c + (was ? -1 : 1));
    try {
      const res = await apiFetch<{ participating: boolean }>(`/api/events/${event.id}/participate`, {
        method: 'POST',
      });
      setIsParticipating(res.participating);
    } catch {
      setIsParticipating(was);
      setParticipantCount((c) => c + (was ? 1 : -1));
    }
    setLoading(false);
  }

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          padding: '0.75rem 0',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--r-sm)',
            background: `${color}14`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '1.1rem',
          }}
        >
          {emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
            {event.title}
          </p>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-4)', marginTop: 2 }}>
            {day} {month} {year} · {event.location ?? 'Chile'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <article
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Date banner */}
      <div
        style={{
          background: `${color}12`,
          borderBottom: `3px solid ${color}`,
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ textAlign: 'center', minWidth: 48 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.04em' }}>{day}</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color }}>{month}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-4)' }}>{year}</div>
        </div>
        <div style={{ flex: 1 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.18rem 0.6rem',
              borderRadius: 'var(--r-pill)',
              background: `${color}20`,
              color,
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.4rem',
            }}
          >
            {emoji} {event.sport.name}
          </span>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
            {event.title}
          </h3>
        </div>
      </div>

      <div style={{ padding: '1rem 1.25rem' }}>
        {event.description && (
          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-3)',
              marginBottom: '0.85rem',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
          {event.location && (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              📍 {event.location}
            </span>
          )}
          <span style={{ fontSize: '0.82rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            👥 {participantCount.toLocaleString('es-CL')} participantes
          </span>
          {event.maxParticipants && (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>
              / {event.maxParticipants.toLocaleString('es-CL')} cupos
            </span>
          )}
        </div>

        {pct !== null && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Ocupación
              </span>
              <span style={{ fontSize: '0.72rem', color, fontWeight: 700 }}>{pct}%</span>
            </div>
            <div style={{ height: 5, background: 'var(--bg)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: color,
                  borderRadius: 'var(--r-pill)',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={handleParticipate}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: 'var(--r)',
              background: isParticipating ? 'transparent' : color,
              color: isParticipating ? color : '#fff',
              fontSize: '0.875rem',
              fontWeight: 700,
              border: `2px solid ${color}`,
              cursor: loading ? 'wait' : 'pointer',
              transition: 'all 0.15s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '...' : isParticipating ? '✓ Participando' : 'Participaré'}
          </button>
          <button
            onClick={() => window.open('/events', '_self')}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 'var(--r)',
              background: 'transparent',
              color: 'var(--text-2)',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: '1.5px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            Ver evento
          </button>
        </div>
      </div>
    </article>
  );
}
