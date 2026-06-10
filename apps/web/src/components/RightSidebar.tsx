import Link from 'next/link';
import { EventCard, type EventCardData } from './EventCard';
import { RankingCard, type RankingEntry } from './RankingCard';
import { prisma } from '@/lib/prisma';

async function getSidebarData(): Promise<{
  events: EventCardData[];
  rankings: RankingEntry[];
  groups: Array<{ id: string; name: string; members: number; sport: { type: string } | null }>;
}> {
  try {
    const now = new Date();
    const [rawEvents, activities, rawGroups] = await Promise.all([
      prisma.event.findMany({
        where: { status: 'UPCOMING', date: { gte: now } },
        include: {
          sport: { select: { name: true, type: true } },
          _count: { select: { participants: true } },
        },
        orderBy: { date: 'asc' },
        take: 3,
      }),
      prisma.activity.findMany({
        where: { status: 'PUBLISHED', sport: { type: 'RUNNING' } },
        select: {
          distance: true,
          user: { select: { name: true, username: true } },
        },
      }),
      prisma.group.findMany({
        include: {
          sport: { select: { type: true } },
          _count: { select: { members: true } },
        },
        orderBy: { createdAt: 'asc' },
        take: 3,
      }),
    ]);

    const events: EventCardData[] = rawEvents.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      date: e.date.toISOString(),
      maxParticipants: e.maxParticipants,
      participants: e._count.participants,
      sport: e.sport,
    }));

    const map = new Map<string, { name: string; username: string; km: number; count: number }>();
    for (const a of activities) {
      const key = a.user.username;
      const prev = map.get(key) ?? { name: a.user.name, username: a.user.username, km: 0, count: 0 };
      map.set(key, { ...prev, km: prev.km + (a.distance ?? 0), count: prev.count + 1 });
    }
    const rankings: RankingEntry[] = [...map.values()]
      .sort((a, b) => b.km - a.km)
      .slice(0, 3)
      .map((u, i) => ({
        position: i + 1,
        name: u.name,
        username: u.username,
        score: Math.round(u.km * 10) / 10,
        unit: 'km',
        activities: u.count,
      }));

    const groups = rawGroups.map((g) => ({
      id: g.id,
      name: g.name,
      members: g._count.members,
      sport: g.sport,
    }));

    return { events, rankings, groups };
  } catch {
    return { events: [], rankings: [], groups: [] };
  }
}

function SidebarCard({ title, link, children }: { title: string; link?: string; children: React.ReactNode }) {
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
        {link && (
          <Link href={link} style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
            Ver todos →
          </Link>
        )}
      </div>
      <div style={{ padding: '0.25rem 0.75rem 0.75rem' }}>{children}</div>
    </section>
  );
}

export async function RightSidebar() {
  const { events, rankings, groups } = await getSidebarData();

  const colors: Record<string, string> = { RUNNING: '#e63946', CYCLING: '#f4a261', TREKKING: '#457b9d' };
  const emojis: Record<string, string> = { RUNNING: '🏃', CYCLING: '🚴', TREKKING: '🥾' };

  return (
    <aside style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1.5rem)' }}>
      <SidebarCard title="Próximos eventos" link="/events">
        {events.length > 0 ? (
          events.map((e) => <EventCard key={e.id} event={e} compact />)
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-4)', padding: '0.75rem 0', textAlign: 'center' }}>
            No hay eventos próximos.
          </p>
        )}
      </SidebarCard>

      <SidebarCard title="Top corredores" link="/rankings">
        {rankings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '0.25rem' }}>
            {rankings.map((r) => (
              <RankingCard key={r.username} entry={r} />
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-4)', padding: '0.75rem 0', textAlign: 'center' }}>
            Sin datos de ranking aún.
          </p>
        )}
      </SidebarCard>

      <SidebarCard title="Comunidades activas" link="/groups">
        {groups.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem' }}>
            {groups.map(({ id, name, members, sport }) => {
              const type = sport?.type ?? '';
              const c = colors[type] ?? 'var(--primary)';
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--r-sm)',
                      background: `${c}14`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      flexShrink: 0,
                    }}
                  >
                    {emojis[type] ?? '🤝'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-4)' }}>{members.toLocaleString('es-CL')} miembros</div>
                  </div>
                  <button
                    style={{
                      padding: '0.22rem 0.65rem',
                      borderRadius: 'var(--r-pill)',
                      border: `1.5px solid ${c}`,
                      background: 'transparent',
                      color: c,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    Unirse
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-4)', padding: '0.75rem 0', textAlign: 'center' }}>
            Sin comunidades aún.
          </p>
        )}
      </SidebarCard>
    </aside>
  );
}
