'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { SportCard } from './SportCard';
import { StatsBar } from './StatsBar';
import { ActivityFeed, type ActivityItem } from './ActivityFeed';
import { ActivityForm } from './ActivityForm';

interface Sport {
  id: string;
  name: string;
  type: string;
}

export function FeedSection() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [selectedSportId, setSelectedSportId] = useState('');
  const [loading, setLoading] = useState(true);

  const loadActivities = useCallback(async () => {
    try {
      const data = await apiFetch<{ activities: ActivityItem[] }>('/api/activities');
      setActivities(data.activities);
    } catch {
      // show empty state
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const [sportsData] = await Promise.all([
          apiFetch<{ sports: Sport[] }>('/api/sports'),
          loadActivities(),
        ]);
        setSports(sportsData.sports);
        if (sportsData.sports.length > 0) {
          setSelectedSportId(sportsData.sports[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [loadActivities]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>
        Cargando deportes y actividades...
      </div>
    );
  }

  return (
    <>
      <StatsBar activities={activities} />

      <p
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#94a3b8',
          marginBottom: '0.65rem',
        }}
      >
        Selecciona un deporte
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        {sports.map((s) => (
          <SportCard
            key={s.id}
            sport={s}
            selected={s.id === selectedSportId}
            onClick={setSelectedSportId}
          />
        ))}
      </div>

      <p
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#94a3b8',
          marginBottom: '0.65rem',
        }}
      >
        Feed de actividades
      </p>

      <div className="feed-layout">
        <ActivityFeed activities={activities} loading={false} />

        <div style={{ position: 'sticky', top: '1.5rem' }}>
          <ActivityForm
            key={selectedSportId}
            sports={sports}
            initialSportId={selectedSportId}
            onSuccess={loadActivities}
          />
        </div>
      </div>
    </>
  );
}
