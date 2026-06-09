'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { EventCard, type EventCardData } from '@/components/EventCard';

const FALLBACK_EVENTS: EventCardData[] = [
  {
    id: 'e1',
    title: 'Maratón de Santiago 2026',
    description: 'El evento de running más importante de Chile. 42K por las principales avenidas de Santiago.',
    location: 'Parque O\'Higgins, Santiago',
    date: '2026-11-15T08:00:00',
    participants: 7840,
    maxParticipants: 10000,
    sport: { name: 'Running', type: 'RUNNING' },
  },
  {
    id: 'e2',
    title: 'Corrida Nocturna Santiago',
    description: 'Corre de noche por el centro de Santiago. Distancias de 5K y 10K.',
    location: 'Paseo El Bosque Norte',
    date: '2026-07-20T20:00:00',
    participants: 1240,
    maxParticipants: 3000,
    sport: { name: 'Running', type: 'RUNNING' },
  },
  {
    id: 'e3',
    title: 'Desafío MTB Andes',
    description: 'Ruta técnica por el Cajón del Maipo con impresionantes vistas a la cordillera.',
    location: 'Cajón del Maipo, RM',
    date: '2026-08-10T09:00:00',
    participants: 312,
    maxParticipants: 500,
    sport: { name: 'Ciclismo', type: 'CYCLING' },
  },
  {
    id: 'e4',
    title: 'Trekking Cerro Provincia',
    description: 'Ascenso al Cerro Provincia guiado, con vista panorámica del Valle de Aconcagua.',
    location: 'Cerro Provincia, RM',
    date: '2026-07-05T07:00:00',
    participants: 89,
    maxParticipants: 200,
    sport: { name: 'Trekking', type: 'TREKKING' },
  },
  {
    id: 'e5',
    title: 'Trail Patagonia 50K',
    description: 'Ultra trail en el corazón de la Patagonia. Para corredores de montaña experimentados.',
    location: 'Torres del Paine, Magallanes',
    date: '2026-12-01T07:00:00',
    participants: 180,
    maxParticipants: 300,
    sport: { name: 'Running', type: 'RUNNING' },
  },
];

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

  useEffect(() => {
    apiFetch<{ events: EventCardData[] }>('/api/events')
      .then((d) => setEvents(d.events.length > 0 ? d.events : FALLBACK_EVENTS))
      .catch(() => setEvents(FALLBACK_EVENTS))
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

      {/* Events grid */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.1rem' }}>
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)' }}>
          No hay eventos para esta disciplina aún.
        </div>
      )}
    </>
  );
}
