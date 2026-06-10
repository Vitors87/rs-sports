'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { EventCard, type EventCardData } from '@/components/EventCard';

const SPORT_FILTERS = [
  { label: 'Todos', value: '' },
  { label: '🏃 Running', value: 'RUNNING' },
  { label: '🚴 Ciclismo', value: 'CYCLING' },
  { label: '🥾 Trekking', value: 'TREKKING' },
];

export function EventsContent() {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<{ events: EventCardData[] }>('/api/events')
      .then((d) => setEvents(d.events))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? events.filter((e) => e.sport.type === filter) : events;

  return (
    <>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: 'var(--text)',
            marginBottom: '0.4rem',
          }}
        >
          Eventos deportivos
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '1rem' }}>
          Participa en los mejores eventos de running, ciclismo y trekking en Chile.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {SPORT_FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            style={{
              padding: '0.45rem 1.1rem',
              borderRadius: 'var(--r-pill)',
              fontSize: '0.875rem',
              fontWeight: filter === value ? 700 : 500,
              color: filter === value ? '#fff' : 'var(--text-3)',
              background: filter === value ? 'var(--primary)' : 'var(--surface)',
              border: `1.5px solid ${filter === value ? 'var(--primary)' : 'var(--border)'}`,
              cursor: 'pointer',
              transition: 'all 0.14s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--r)', height: 280, border: '1px solid var(--border)', animation: 'rs-pulse 1.4s ease-in-out infinite' }} />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)', background: 'var(--surface)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
          <p style={{ fontWeight: 600, color: 'var(--text-2)' }}>No se pudieron cargar los eventos.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>Intenta recargar la página.</p>
        </div>
      )}

      {/* Events grid */}
      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.1rem' }}>
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)', background: 'var(--surface)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
          {filter
            ? 'No hay eventos para esta disciplina aún.'
            : 'No hay eventos disponibles por ahora.'}
        </div>
      )}
    </>
  );
}
