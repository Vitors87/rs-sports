import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function GET() {
  try {
    const [events, currentUser] = await Promise.all([
      prisma.event.findMany({
        where: { status: 'UPCOMING' },
        include: {
          sport: { select: { id: true, name: true, type: true } },
          _count: { select: { participants: true } },
        },
        orderBy: { date: 'asc' },
      }),
      getCurrentUser(),
    ]);

    const myParticipations = await prisma.eventParticipant.findMany({
      where: { userId: currentUser.id, eventId: { in: events.map((e) => e.id) } },
      select: { eventId: true },
    });
    const participatingSet = new Set(myParticipations.map((p) => p.eventId));

    const payload = events.map((e) => ({
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

    return NextResponse.json({ events: payload });
  } catch (error) {
    console.error('[GET /api/events]', error);
    return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 });
  }
}
