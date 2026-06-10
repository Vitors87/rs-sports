import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: eventId } = await params;
    const user = await getCurrentUser();

    const existing = await prisma.eventParticipant.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });

    if (existing) {
      await prisma.eventParticipant.delete({
        where: { userId_eventId: { userId: user.id, eventId } },
      });
      return NextResponse.json({ participating: false });
    }

    await prisma.eventParticipant.create({ data: { userId: user.id, eventId } });
    return NextResponse.json({ participating: true });
  } catch (error) {
    console.error('[POST /api/events/[id]/participate]', error);
    return NextResponse.json({ error: 'Error al procesar participación' }, { status: 500 });
  }
}
