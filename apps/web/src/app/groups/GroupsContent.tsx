'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { GroupCard, type GroupCardData } from '@/components/GroupCard';

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
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<{ groups: GroupCardData[] }>('/api/groups')
      .then((d) => setGroups(d.groups))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? groups.filter((g) => g.sport?.type === filter) : groups;

  const totalMembers = groups.reduce((sum, g) => sum + g.members, 0);

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

      {/* Stats bar — computed from real data */}
      {!loading && !error && groups.length > 0 && (
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
            { label: 'Comunidades', value: groups.length.toString() },
            { label: 'Miembros totales', value: totalMembers.toLocaleString('es-CL') },
          ].map(({ label, value }) => (
            <div key={label} style={{ flex: 1, background: 'var(--surface)', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em' }}>{value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

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

      {/* Error state */}
      {!loading && error && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)', background: 'var(--surface)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
          <p style={{ fontWeight: 600, color: 'var(--text-2)' }}>No se pudieron cargar las comunidades.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.35rem' }}>Intenta recargar la página.</p>
        </div>
      )}

      {/* Groups list */}
      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((g) => (
            <GroupCard key={g.id} group={g} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-3)', background: 'var(--surface)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
          {filter
            ? 'No hay comunidades para esta disciplina aún.'
            : 'No hay comunidades disponibles por ahora.'}
        </div>
      )}
    </>
  );
}
