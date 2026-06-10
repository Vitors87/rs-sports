import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SPORT_TYPES = ['RUNNING', 'CYCLING', 'TREKKING'] as const;

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        distance: true,
        user: { select: { name: true, username: true } },
        sport: { select: { type: true } },
      },
    });

    const rankings: Record<
      string,
      Array<{
        position: number;
        name: string;
        username: string;
        score: number;
        unit: string;
        activities: number;
      }>
    > = {};

    for (const sportType of SPORT_TYPES) {
      const map = new Map<string, { name: string; username: string; km: number; count: number }>();

      for (const a of activities) {
        if (a.sport.type !== sportType) continue;
        const key = a.user.username;
        const prev = map.get(key) ?? { name: a.user.name, username: a.user.username, km: 0, count: 0 };
        map.set(key, { ...prev, km: prev.km + (a.distance ?? 0), count: prev.count + 1 });
      }

      rankings[sportType] = [...map.values()]
        .sort((a, b) => b.km - a.km)
        .slice(0, 10)
        .map((u, i) => ({
          position: i + 1,
          name: u.name,
          username: u.username,
          score: Math.round(u.km * 10) / 10,
          unit: 'km',
          activities: u.count,
        }));
    }

    return NextResponse.json({ rankings });
  } catch (error) {
    console.error('[GET /api/rankings]', error);
    return NextResponse.json({ error: 'Error al obtener rankings' }, { status: 500 });
  }
}
