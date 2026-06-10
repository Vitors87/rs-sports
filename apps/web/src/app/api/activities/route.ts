import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/current-user';
import { createActivitySchema } from '@rs-sports/validation';

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { name: true, username: true, avatarUrl: true } },
        sport: { select: { id: true, name: true, type: true } },
        posts: { select: { _count: { select: { comments: true } } } },
      },
    });

    const payload = activities.map(({ posts, ...a }) => ({
      ...a,
      date: a.date.toISOString(),
      commentCount: posts.reduce((sum, p) => sum + p._count.comments, 0),
    }));

    return NextResponse.json({ activities: payload });
  } catch (error) {
    console.error('[GET /api/activities]', error);
    return NextResponse.json({ error: 'Error al obtener actividades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createActivitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Payload inválido', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { sportId, title, description, distance, duration, elevation, date } = parsed.data;

    const sport = await prisma.sport.findUnique({ where: { id: sportId } });
    if (!sport) {
      return NextResponse.json({ error: 'Deporte no encontrado' }, { status: 404 });
    }

    const user = await getCurrentUser();

    const activity = await prisma.activity.create({
      data: { userId: user.id, sportId, title, description, distance, duration, elevation, date },
      include: {
        user: { select: { name: true, username: true, avatarUrl: true } },
        sport: { select: { id: true, name: true, type: true } },
      },
    });

    return NextResponse.json({ activity: { ...activity, date: activity.date.toISOString(), commentCount: 0 } }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/activities]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
