'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ActivityCard, type ActivityCardData } from '@/components/ActivityCard';
import { ActivityForm } from '../components/ActivityForm';

interface Sport {
  id: string;
  name: string;
  type: string;
}

export function FeedContent() {
  const [activities, setActivities] = useState<ActivityCardData[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadActivities = useCallback(async () => {
    try {
      const data = await apiFetch<{ activities: ActivityCardData[] }>('/api/activities');
      setActivities(data.activities);
    } catch {
      // silently show empty state
    }
  }, []);

  useEffect(() => {
    async function init() {
      const [sportsData] = await Promise.all([
        apiFetch<{ sports: Sport[] }>('/api/sports').catch(() => ({ sports: [] })),
        loadActivities(),
      ]);
      setSports(sportsData.sports);
      setLoading(false);
    }
    init();
  }, [loadActivities]);

  async function handleActivityCreated() {
    await loadActivities();
    setShowForm(false);
  }

  return (
    <>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          gap: '0.75rem',
        }}
      >
        <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>
          Feed de actividades
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1.1rem',
            borderRadius: 'var(--r-pill)',
            background: 'var(--primary)',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          + Registrar actividad
        </button>
      </div>

      {/* Inline form */}
      {showForm && sports.length > 0 && (
        <div
          style={{
            marginBottom: '1.25rem',
            animation: 'rs-fade-up 0.2s ease',
          }}
        >
          <ActivityForm
            sports={sports}
            onSuccess={handleActivityCreated}
          />
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface)',
                borderRadius: 'var(--r)',
                height: 200,
                border: '1px solid var(--border)',
                animation: 'rs-pulse 1.4s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && activities.length === 0 && (
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r)',
            padding: '3rem',
            textAlign: 'center',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏁</div>
          <p style={{ fontWeight: 600, color: 'var(--text-2)' }}>
            Aún no hay actividades.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-4)', marginTop: '0.35rem' }}>
            ¡Sé el primero en registrar una actividad!
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              marginTop: '1.25rem',
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--r-pill)',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Registrar primera actividad
          </button>
        </div>
      )}

      {/* Feed */}
      {!loading && activities.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      )}
    </>
  );
}
