import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET() {
  try {
    const [rawEvents, activities, rawGroups, currentUser, featuredRoutes] = await Promise.all([
      prisma.event.findMany({
        where: { status: 'UPCOMING' },
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
        take: 5,
      }),
      getCurrentUser(),
      prisma.route.findMany({
        include: { sport: { select: { name: true, type: true } } },
        orderBy: { createdAt: 'asc' },
        take: 3,
      }),
    ]);

    // ── Upcoming events ──────────────────────────────────────────
    const myParticipations = await prisma.eventParticipant.findMany({
      where: { userId: currentUser.id, eventId: { in: rawEvents.map((e) => e.id) } },
      select: { eventId: true },
    });
    const participatingSet = new Set(myParticipations.map((p) => p.eventId));

    const upcomingEvents = rawEvents.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      date: e.date.toISOString(),
      maxParticipants: e.maxParticipants,
      participants: e._count.participants,
      isParticipating: participatingSet.has(e.id),
      sport: e.sport,
    }));

    // ── Top runners ──────────────────────────────────────────────
    const map = new Map<string, { name: string; username: string; km: number; count: number }>();
    for (const a of activities) {
      const key = a.user.username;
      const prev = map.get(key) ?? { name: a.user.name, username: a.user.username, km: 0, count: 0 };
      map.set(key, { ...prev, km: prev.km + (a.distance ?? 0), count: prev.count + 1 });
    }
    const topRunners = [...map.values()]
      .sort((a, b) => b.km - a.km)
      .slice(0, 5)
      .map((u, i) => ({
        position: i + 1,
        name: u.name,
        username: u.username,
        score: Math.round(u.km * 10) / 10,
        unit: 'km',
        activities: u.count,
      }));

    // ── Active groups ────────────────────────────────────────────
    const myMemberships = await prisma.groupMember.findMany({
      where: { userId: currentUser.id, groupId: { in: rawGroups.map((g) => g.id) } },
      select: { groupId: true },
    });
    const memberSet = new Set(myMemberships.map((m) => m.groupId));

    const activeGroups = rawGroups
      .sort((a, b) => b._count.members - a._count.members)
      .slice(0, 5)
      .map((g) => ({
        id: g.id,
        name: g.name,
        members: g._count.members,
        isMember: memberSet.has(g.id),
        sport: g.sport,
      }));

    const routes = featuredRoutes.map((r) => ({
      id: r.id,
      title: r.title,
      distanceKm: r.distanceKm,
      elevationGain: r.elevationGain,
      durationMin: r.durationMin,
      difficulty: r.difficulty,
      region: r.region,
      city: r.city,
      imageUrl: r.imageUrl,
      sport: r.sport,
    }));

    return NextResponse.json({ upcomingEvents, topRunners, activeGroups, featuredRoutes: routes });
  } catch (error) {
    console.error('[GET /api/feed/sidebar]', error);
    return NextResponse.json({ error: 'Error al obtener datos del sidebar' }, { status: 500 });
  }
}
