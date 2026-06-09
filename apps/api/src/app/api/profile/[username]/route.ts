import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        activities: {
          include: {
            sport: { select: { id: true, name: true, type: true } },
          },
          orderBy: { date: 'desc' },
          take: 20,
        },
        _count: {
          select: { activities: true, followers: true, following: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const totalKm = user.activities.reduce((sum, a) => sum + (a.distance ?? 0), 0);

    const { activities, _count, ...userBase } = user;

    return NextResponse.json({
      user: {
        ...userBase,
        stats: {
          activities: _count.activities,
          followers: _count.followers,
          following: _count.following,
          totalKm: Math.round(totalKm * 10) / 10,
        },
      },
      activities: activities.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        distance: a.distance,
        duration: a.duration,
        elevation: a.elevation,
        date: a.date.toISOString(),
        user: { name: userBase.name, username: userBase.username },
        sport: a.sport,
      })),
    });
  } catch (error) {
    console.error('[GET /api/profile/[username]]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
