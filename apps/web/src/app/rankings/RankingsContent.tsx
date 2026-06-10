'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { RankingCard, type RankingEntry } from '@/components/RankingCard';

const SPORT_TABS = [
  { label: '🏃 Running', value: 'RUNNING', color: '#e63946' },
  { label: '🚴 Ciclismo', value: 'CYCLING', color: '#f4a261' },
  { label: '🥾 Trekking', value: 'TREKKING', color: '#457b9d' },
];

export function RankingsContent() {
  const [tab, setTab] = useState('RUNNING');
  const [rankings, setRankings] = useState<Record<string, RankingEntry[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<{ rankings: Record<string, RankingEntry[]> }>('/api/rankings')
      .then((d) => setRankings(d.rankings))
      .catch(() => setError(true))
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

        {!loading && error && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-4)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
            No se pudieron cargar los rankings. Intenta recargar la página.
          </div>
        )}

        {!loading && !error && current.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-4)' }}>
            No hay datos suficientes para esta disciplina.
          </div>
        )}

        {!loading && !error && current.length > 0 && (
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
