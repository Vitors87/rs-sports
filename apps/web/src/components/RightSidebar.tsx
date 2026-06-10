'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { EventCard, type EventCardData } from './EventCard';
import { RankingCard, type RankingEntry } from './RankingCard';
import { SidebarCommunities } from './SidebarCommunities';

interface SidebarGroup {
  id: string;
  name: string;
  members: number;
  isMember: boolean;
  sport: { type: string } | null;
}

interface SidebarData {
  upcomingEvents: EventCardData[];
  topRunners: RankingEntry[];
  activeGroups: SidebarGroup[];
}

function SkeletonBlock({ height = 72 }: { height?: number }) {
  return (
    <div
      style={{
        height,
        borderRadius: 'var(--r-sm)',
        background: 'var(--bg)',
        animation: 'rs-pulse 1.4s ease-in-out infinite',
        marginBottom: '0.5rem',
      }}
    />
  );
}

function SidebarCard({
  title,
  link,
  loading,
  children,
}: {
  title: string;
  link?: string;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          padding: '0.85rem 1rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3 style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
        {link && !loading && (
          <Link href={link} style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
            Ver todos →
          </Link>
        )}
      </div>
      <div style={{ padding: '0.25rem 0.75rem 0.75rem' }}>{children}</div>
    </section>
  );
}

export function RightSidebar() {
  const [data, setData] = useState<SidebarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<SidebarData>('/api/feed/sidebar')
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <aside style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1.5rem)' }}>
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: 'var(--r)',
            border: '1px solid var(--border)',
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--text-4)' }}>No se pudo cargar el sidebar.</p>
          <button
            onClick={() => { setError(false); setLoading(true); apiFetch<SidebarData>('/api/feed/sidebar').then(setData).catch(() => setError(true)).finally(() => setLoading(false)); }}
            style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Reintentar
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1.5rem)' }}>
      {/* Upcoming events */}
      <SidebarCard title="Próximos eventos" link="/events" loading={loading}>
        {loading ? (
          <>
            <SkeletonBlock height={60} />
            <SkeletonBlock height={60} />
            <SkeletonBlock height={60} />
          </>
        ) : (data?.upcomingEvents ?? []).length > 0 ? (
          (data!.upcomingEvents).map((e) => <EventCard key={e.id} event={e} compact />)
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-4)', padding: '0.75rem 0', textAlign: 'center' }}>
            No hay eventos próximos.
          </p>
        )}
      </SidebarCard>

      {/* Top runners */}
      <SidebarCard title="Top corredores" link="/rankings" loading={loading}>
        {loading ? (
          <>
            <SkeletonBlock height={52} />
            <SkeletonBlock height={52} />
            <SkeletonBlock height={52} />
          </>
        ) : (data?.topRunners ?? []).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '0.25rem' }}>
            {data!.topRunners.map((r) => (
              <RankingCard key={r.username} entry={r} />
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-4)', padding: '0.75rem 0', textAlign: 'center' }}>
            Sin datos de ranking aún.
          </p>
        )}
      </SidebarCard>

      {/* Active groups */}
      <SidebarCard title="Comunidades activas" link="/groups" loading={loading}>
        {loading ? (
          <>
            <SkeletonBlock height={44} />
            <SkeletonBlock height={44} />
            <SkeletonBlock height={44} />
          </>
        ) : (
          <SidebarCommunities groups={data?.activeGroups ?? []} />
        )}
      </SidebarCard>
    </aside>
  );
}
