'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { RouteCard, type RouteCardData } from '@/components/RouteCard';

const SPORT_FILTERS = [
  { label: 'Todos', value: '' },
  { label: '🏃 Running', value: 'RUNNING' },
  { label: '🚴 Ciclismo', value: 'CYCLING' },
  { label: '🥾 Trekking', value: 'TREKKING' },
];

const DIFF_FILTERS = [
  { label: 'Todas', value: '' },
  { label: 'Fácil', value: 'Fácil', color: '#22c55e' },
  { label: 'Media', value: 'Media', color: '#f59e0b' },
  { label: 'Difícil', value: 'Difícil', color: '#e63946' },
];

function FilterPill({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.38rem 0.9rem',
        borderRadius: 'var(--r-pill)',
        fontSize: '0.82rem',
        fontWeight: active ? 700 : 500,
        color: active ? (color ?? 'var(--primary)') : 'var(--text-3)',
        background: active ? (color ? `${color}18` : 'var(--primary-glow)') : 'var(--surface)',
        border: `1.5px solid ${active ? (color ?? 'var(--primary)') : 'var(--border)'}`,
        cursor: 'pointer',
        transition: 'all 0.13s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

export function RoutesContent() {
  const [routes, setRoutes] = useState<RouteCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sport, setSport] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sport) params.set('sport', sport);
      if (difficulty) params.set('difficulty', difficulty);
      const qs = params.toString();
      const data = await apiFetch<{ routes: RouteCardData[] }>(`/api/routes${qs ? `?${qs}` : ''}`);
      setRoutes(data.routes);
    } catch {
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  }, [sport, difficulty]);

  useEffect(() => { fetchRoutes(); }, [fetchRoutes]);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem 3rem' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #0d2b1e 50%, #1a4a3a 100%)',
        borderRadius: 'var(--r-lg)',
        padding: '2.5rem 2rem',
        marginBottom: '1.75rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(42,157,143,0.3) 0%, transparent 65%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.5rem', lineHeight: 1.2 }}>
            Rutas outdoor
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 480 }}>
            Descubre las mejores rutas de running, ciclismo y trekking de Chile.
            Filtra por disciplina o dificultad y encuentra tu próxima aventura.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', border: '1px solid var(--border)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginRight: '0.25rem' }}>
            Disciplina
          </span>
          {SPORT_FILTERS.map((f) => (
            <FilterPill key={f.value} label={f.label} active={sport === f.value} onClick={() => setSport(f.value)} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginRight: '0.25rem' }}>
            Dificultad
          </span>
          {DIFF_FILTERS.map((f) => (
            <FilterPill key={f.value} label={f.label} active={difficulty === f.value} onClick={() => setDifficulty(f.value)} color={f.color} />
          ))}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-4)', marginBottom: '1rem' }}>
          {routes.length === 0 ? 'Sin resultados para los filtros seleccionados.' : `${routes.length} ruta${routes.length !== 1 ? 's' : ''} encontrada${routes.length !== 1 ? 's' : ''}`}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={{ borderRadius: 'var(--r)', border: '1px solid var(--border)', overflow: 'hidden', animation: 'rs-pulse 1.4s ease-in-out infinite' }}>
              <div style={{ height: 140, background: 'var(--border)' }} />
              <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ height: 16, borderRadius: 4, background: 'var(--bg)', width: '60%' }} />
                <div style={{ height: 20, borderRadius: 4, background: 'var(--bg)', width: '85%' }} />
                <div style={{ height: 14, borderRadius: 4, background: 'var(--bg)', width: '45%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : routes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--surface)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
          <p style={{ fontWeight: 600, color: 'var(--text-2)', marginBottom: '0.5rem' }}>No hay rutas con esos filtros.</p>
          <button
            onClick={() => { setSport(''); setDifficulty(''); }}
            style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Quitar filtros
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {routes.map((r) => <RouteCard key={r.id} route={r} />)}
        </div>
      )}
    </div>
  );
}
