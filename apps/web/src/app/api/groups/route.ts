import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        sport: { select: { id: true, name: true, type: true } },
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const payload = groups.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      members: g._count.members,
      sport: g.sport,
    }));

    return NextResponse.json({ groups: payload });
  } catch (error) {
    console.error('[GET /api/groups]', error);
    return NextResponse.json({ error: 'Error al obtener comunidades' }, { status: 500 });
  }
}
