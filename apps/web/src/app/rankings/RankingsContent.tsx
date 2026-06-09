'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { RankingCard, type RankingEntry } from '@/components/RankingCard';

interface ActivityItem {
  user: { name: string; username: string };
  sport: { type: string };
  distance?: number | null;
}

const SPORT_TABS = [
  { label: '🏃 Running', value: 'RUNNING', color: '#e63946' },
  { label: '🚴 Ciclismo', value: 'CYCLING', color: '#f4a261' },
  { label: '🥾 Trekking', value: 'TREKKING', color: '#457b9d' },
];

function buildRanking(activities: ActivityItem[], sportType: string): RankingEntry[] {
  const map = new Map<string, { name: string; username: string; km: number; count: number }>();
  for (const a of activities) {
    if (a.sport.type !== sportType) continue;
    const key = a.user.username;
    const prev = map.get(key) ?? { name: a.user.name, username: a.user.username, km: 0, count: 0 };
    map.set(key, { ...prev, km: prev.km + (a.distance ?? 0), count: prev.count + 1 });
  }
  return [...map.values()]
    .sort((a, b) => b.km - a.km)
    .slice(0, 10)
    .map((u, i) => ({
      position: i + 1,
      name: u.name,
      username: u.username,
      score: Math.round(u.km * 10) / 10,
      unit: 'km',
      activities: u.count,
    }));
}

const FALLBACK: Record<string, RankingEntry[]> = {
  RUNNING: [
    { position: 1, name: 'Carlos Morales', username: 'carlos_morales', score: 187.5, unit: 'km', activities: 12 },
    { position: 2, name: 'Valentina Ruiz', username: 'valentina_ruiz', score: 156.2, unit: 'km', activities: 9 },
    { position: 3, name: 'Víctor Riquelme', username: 'victor_riquelme', score: 131.3, unit: 'km', activities: 8 },
    { position: 4, name: 'Sofía Castro', username: 'sofia_castro', score: 98.7, unit: 'km', activities: 7 },
    { position: 5, name: 'Felipe Muñoz', username: 'felipe_munoz', score: 75.4, unit: 'km', activities: 6 },
    { position: 6, name: 'María González', username: 'maria_gonzalez', score: 62.1, unit: 'km', activities: 5 },
  ],
  CYCLING: [
    { position: 1, name: 'Pedro Soto', username: 'pedro_soto', score: 245.8, unit: 'km', activities: 8 },
    { position: 2, name: 'Daniela Torres', username: 'daniela_torres', score: 198.4, unit: 'km', activities: 7 },
    { position: 3, name: 'Rodrigo Bravo', username: 'rodrigo_bravo', score: 120.3, unit: 'km', activities: 4 },
    { position: 4, name: 'Carlos Morales', username: 'carlos_morales', score: 88.0, unit: 'km', activities: 3 },
  ],
  TREKKING: [
    { position: 1, name: 'Camila Herrera', username: 'camila_herrera', score: 55.2, unit: 'km', activities: 5 },
    { position: 2, name: 'María González', username: 'maria_gonzalez', score: 42.5, unit: 'km', activities: 4 },
    { position: 3, name: 'Valentina Ruiz', username: 'valentina_ruiz', score: 38.1, unit: 'km', activities: 3 },
    { position: 4, name: 'Carlos Morales', username: 'carlos_morales', score: 25.0, unit: 'km', activities: 2 },
  ],
};

export function RankingsContent() {
  const [tab, setTab] = useState('RUNNING');
  const [rankings, setRankings] = useState<Record<string, RankingEntry[]>>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ activities: ActivityItem[] }>('/api/activities')
      .then((d) => {
        if (d.activities.length > 0) {
          setRankings({
            RUNNING: buildRanking(d.activities, 'RUNNING'),
            CYCLING: buildRanking(d.activities, 'CYCLING'),
            TREKKING: buildRanking(d.activities, 'TREKKING'),
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const current = rankings[tab] ?? [];
  const tabInfo = SPORT_TABS.find((t) => t.value === tab)!;

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
          Rankings
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: '1rem' }}>
          Top deportistas del mes por kilómetros totales.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          background: 'var(--surface)',
          borderRadius: 'var(--r)',
          border: '1px solid var(--border)',
          padding: '0.35rem',
          gap: '0.25rem',
          marginBottom: '1.5rem',
          width: 'fit-content',
        }}
      >
        {SPORT_TABS.map(({ label, value, color }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--r-sm)',
              fontSize: '0.875rem',
              fontWeight: tab === value ? 700 : 500,
              color: tab === value ? '#fff' : 'var(--text-3)',
              background: tab === value ? color : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.14s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--r)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
            Top 10 — {tabInfo.label}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-4)', fontWeight: 500 }}>
            Junio 2026
          </span>
        </div>

        {loading && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-4)' }}>
            Calculando rankings...
          </div>
        )}

        {!loading && current.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-4)' }}>
            No hay datos suficientes para esta disciplina.
          </div>
        )}

        {!loading && current.length > 0 && (
          <div style={{ padding: '0.5rem 0.5rem' }}>
            {current.map((entry) => (
              <RankingCard key={entry.username} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
