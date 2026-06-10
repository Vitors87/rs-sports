import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const [activityCount, userCount, eventCount, groupCount, upcomingEvents] = await Promise.all([
      prisma.activity.count({ where: { status: 'PUBLISHED' } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.event.count({ where: { status: 'UPCOMING', date: { gte: now } } }),
      prisma.group.count(),
      prisma.event.findMany({
        where: { status: 'UPCOMING', date: { gte: now } },
        include: {
          sport: { select: { id: true, name: true, type: true } },
          _count: { select: { participants: true } },
        },
        orderBy: { date: 'asc' },
        take: 3,
      }),
    ]);

    return NextResponse.json({
      metrics: {
        activities: activityCount,
        athletes: userCount,
        events: eventCount,
        groups: groupCount,
      },
      upcomingEvents: upcomingEvents.map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.location,
        date: e.date.toISOString(),
        maxParticipants: e.maxParticipants,
        participants: e._count.participants,
        sport: e.sport,
      })),
    });
  } catch (error) {
    console.error('[GET /api/home]', error);
    return NextResponse.json({ error: 'Error al obtener datos del home' }, { status: 500 });
  }
}
