import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sport = searchParams.get('sport')?.toUpperCase();
    const difficulty = searchParams.get('difficulty');
    const region = searchParams.get('region');

    const routes = await prisma.route.findMany({
      where: {
        ...(sport ? { sport: { type: sport as 'RUNNING' | 'CYCLING' | 'TREKKING' } } : {}),
        ...(difficulty ? { difficulty } : {}),
        ...(region ? { region: { contains: region, mode: 'insensitive' } } : {}),
      },
      include: { sport: { select: { id: true, name: true, type: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ routes });
  } catch (error) {
    console.error('[GET /api/routes]', error);
    return NextResponse.json({ error: 'Error al obtener rutas' }, { status: 500 });
  }
}
