import Link from 'next/link';
import { EventCard, type EventCardData } from './EventCard';
import { RankingCard, type RankingEntry } from './RankingCard';
import { SidebarCommunities } from './SidebarCommunities';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

async function getSidebarData() {
  try {
    const now = new Date();
    const [rawEvents, activities, rawGroups, currentUser] = await Promise.all([
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
      getCurrentUser(),
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

    const myMemberships = await prisma.groupMember.findMany({
      where: { userId: currentUser.id, groupId: { in: rawGroups.map((g) => g.id) } },
      select: { groupId: true },
    });
    const memberSet = new Set(myMemberships.map((m) => m.groupId));

    const groups = rawGroups.map((g) => ({
      id: g.id,
      name: g.name,
      members: g._count.members,
      isMember: memberSet.has(g.id),
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
        <SidebarCommunities groups={groups} />
      </SidebarCard>
    </aside>
  );
}
