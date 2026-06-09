import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { status: 'UPCOMING' },
      include: {
        sport: { select: { id: true, name: true, type: true } },
        _count: { select: { participants: true } },
      },
      orderBy: { date: 'asc' },
    });

    const payload = events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      date: e.date.toISOString(),
      maxParticipants: e.maxParticipants,
      participants: e._count.participants,
      sport: e.sport,
    }));

    return NextResponse.json({ events: payload });
  } catch (error) {
    console.error('[GET /api/events]', error);
    return NextResponse.json({ error: 'Error al obtener eventos' }, { status: 500 });
  }
}
