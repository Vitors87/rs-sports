'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { GroupCard, type GroupCardData } from '@/components/GroupCard';

const FALLBACK_GROUPS: GroupCardData[] = [
  { id: 'g1', name: 'Running Santiago', description: 'Comunidad de corredores urbanos de Santiago. Salidas los sábados y domingos por el parque.', members: 1840, recentActivity: 'Hace 2h', sport: { name: 'Running', type: 'RUNNING' } },
  { id: 'g2', name: 'Trail Chile', description: 'Para quienes aman correr en montaña y trail. Exploramos senderos de todo Chile.', members: 920, recentActivity: 'Hace 4h', sport: { name: 'Running', type: 'RUNNING' } },
  { id: 'g3', name: 'MTB RM', description: 'Mountain bikers de la Región Metropolitana. Rutas técnicas y cross-country los fines de semana.', members: 760, recentActivity: 'Ayer', sport: { name: 'Ciclismo', type: 'CYCLING' } },
  { id: 'g4', name: 'Trekking Chile', description: 'Trekkistas de todo Chile. Organizamos salidas a cumbres, senderos y parques nacionales.', members: 1120, recentActivity: 'Hace 6h', sport: { name: 'Trekking', type: 'TREKKING' } },
  { id: 'g5', name: 'Corredores 10K', description: 'Para quienes entrenan la distancia de 10K. Planes de entrenamiento compartidos y motivación colectiva.', members: 2340, recentActivity: 'Hace 1h', sport: { name: 'Running', type: 'RUNNING' } },
];

const SPORT_FILTERS = [
  { label: 'Todos', value: '' },
  { label: '🏃 Running', value: 'RUNNING' },
  { label: '🚴 Ciclismo', value: 'CYCLING' },
  { label: '🥾 Trekking', value: 'TREKKING' },
];

export function GroupsContent() {
  const [groups, setGroups] = useState<GroupCardData[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ groups: GroupCardData[] }>('/api/groups')
      .then((d) => setGroups(d.groups.length > 0 ? d.groups : FALLBACK_GROUPS))
      .catch(() => setGroups(FALLBACK_GROUPS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? groups.filter((g) => g.sport?.type === filter) : groups;

  return (
    <>
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
          Comunidades
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '1rem' }}>
          Conéctate con deportistas que comparten tu pasión por el outdoor.
        </p>
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: 'flex',
          gap: 1,
          background: 'var(--border)',
          borderRadius: 'var(--r)',
          overflow: 'hidden',
          marginBottom: '1.75rem',
        }}
      >
        {[
          { label: 'Comunidades', value: '35' },
          { label: 'Miembros', value: '6.980' },
          { label: 'Activas hoy', value: '18' },
        ].map(({ label, value }) => (
          <div key={label} style={{ flex: 1, background: 'var(--surface)', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em' }}>{value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2, fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--r)', height: 100, border: '1px solid var(--border)', animation: 'rs-pulse 1.4s ease-in-out infinite' }} />
          ))}
        </div>
      )}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((g) => (
            <GroupCard key={g.id} group={g} />
          ))}
        </div>
      )}
    </>
  );
}
