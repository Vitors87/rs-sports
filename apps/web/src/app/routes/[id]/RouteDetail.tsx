'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const SPORT_GRAD: Record<string, string> = {
  RUNNING: 'linear-gradient(135deg, #e63946 0%, #b71c2b 100%)',
  CYCLING: 'linear-gradient(135deg, #f4a261 0%, #d97b34 100%)',
  TREKKING: 'linear-gradient(135deg, #457b9d 0%, #2d607e 100%)',
};
const SPORT_EMOJI: Record<string, string> = { RUNNING: '🏃', CYCLING: '🚴', TREKKING: '🥾' };
const DIFFICULTY_COLOR: Record<string, string> = { 'Fácil': '#22c55e', 'Media': '#f59e0b', 'Difícil': '#e63946' };

interface RouteData {
  id: string;
  title: string;
  description?: string | null;
  distanceKm?: number | null;
  elevationGain?: number | null;
  durationMin?: number | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
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

export function RouteDetail({ id }: { id: string }) {
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    apiFetch<{ route: RouteData }>(`/api/routes/${id}`)
      .then((d) => setRoute(d.route))
      .catch((e) => {
        if (e.message?.includes('404') || e.message?.includes('no encontrada')) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        <div style={{ height: 260, borderRadius: 'var(--r-lg)', background: 'var(--border)', marginBottom: '1.5rem', animation: 'rs-pulse 1.4s ease-in-out infinite' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[240, 180, 140].map((w) => (
            <div key={w} style={{ height: 18, borderRadius: 4, background: 'var(--border)', width: w, animation: 'rs-pulse 1.4s ease-in-out infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !route) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>Ruta no encontrada</h2>
        <Link href="/routes" style={{ color: 'var(--primary)', fontWeight: 600 }}>← Volver a rutas</Link>
      </div>
    );
  }

  const grad = SPORT_GRAD[route.sport.type] ?? 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
  const emoji = SPORT_EMOJI[route.sport.type] ?? '🗺️';
  const diffColor = route.difficulty ? (DIFFICULTY_COLOR[route.difficulty] ?? 'var(--text-3)') : undefined;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 3rem' }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-4)' }}>
        <Link href="/routes" style={{ color: 'var(--primary)', fontWeight: 600 }}>Rutas</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span>{route.title}</span>
      </nav>

      {/* Hero image / placeholder */}
      {route.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={route.imageUrl}
          alt={route.title}
          style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 'var(--r-lg)', display: 'block', marginBottom: '1.5rem' }}
        />
      ) : (
        <div style={{
          height: 260, borderRadius: 'var(--r-lg)', background: grad, position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <span style={{ fontSize: '5rem', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' }}>{emoji}</span>
        </div>
      )}

      {/* Title + badges */}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            color: '#fff', background: grad, padding: '0.22rem 0.65rem', borderRadius: 'var(--r-pill)',
          }}>
            {route.sport.name}
          </span>
          {route.difficulty && diffColor && (
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, color: diffColor,
              border: `1.5px solid ${diffColor}`, padding: '0.22rem 0.65rem',
              borderRadius: 'var(--r-pill)', background: `${diffColor}15`,
            }}>
              {route.difficulty}
            </span>
          )}
          {(route.city || route.region) && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-4)', display: 'flex', alignItems: 'center', gap: 4 }}>
              📍 {[route.city, route.region].filter(Boolean).join(', ')}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '0.75rem' }}>
          {route.title}
        </h1>

        {route.description && (
          <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.7 }}>
            {route.description}
          </p>
        )}
      </div>

      {/* Metrics grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}>
        {[
          route.distanceKm != null && { icon: '📏', label: 'Distancia', value: `${route.distanceKm} km` },
          route.elevationGain != null && { icon: '⛰️', label: 'Desnivel', value: `${route.elevationGain} m` },
          route.durationMin != null && { icon: '⏱️', label: 'Duración est.', value: formatDuration(route.durationMin) },
          route.difficulty && { icon: '🎯', label: 'Dificultad', value: route.difficulty },
        ].filter(Boolean).map((m) => {
          const metric = m as { icon: string; label: string; value: string };
          return (
            <div key={metric.label} style={{
              background: 'var(--surface)', borderRadius: 'var(--r)', border: '1px solid var(--border)',
              padding: '1rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>{metric.icon}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{metric.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Map placeholder */}
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)',
        padding: '1.5rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>🗺️</div>
        <p style={{ fontWeight: 700, color: 'var(--text-2)', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
          Mapa interactivo
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-4)' }}>
          Próximamente — integración con mapa y visualización del recorrido.
        </p>
      </div>
    </div>
  );
}
